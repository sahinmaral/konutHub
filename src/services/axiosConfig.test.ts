import { setUser } from '@/redux/reducers/appReducer';
import { store } from '@/redux/store';
import { fetchRefreshToken } from '@/services/apiServices/auths';
import { User } from '@/types';
import { getValidAccessToken } from '@/utils/tokenManager';
import { AxiosAdapter, AxiosError, AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosConfig';

jest.mock('@/services/apiServices/auths', () => ({ fetchRefreshToken: jest.fn() }));

const mockFetchRefreshToken = fetchRefreshToken as jest.Mock;

// A JWT-shaped access token whose `exp` is far in the future, so tokenManager treats it as
// valid and only a 401 from the server can trigger a refresh.
// `id` only exists to keep otherwise-identical tokens distinguishable, so assertions about
// *which* token a request carried are meaningful.
let tokenCounter = 0;
const makeAccessToken = (secondsFromNow: number) => {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + secondsFromNow, id: ++tokenCounter }),
  )
    .toString('base64')
    .replace(/=/g, '');
  return `header.${payload}.signature`;
};

const user = {
  id: 'user-1',
  userName: 'janedoe',
  firstName: 'Jane',
  lastName: 'Doe',
  accessToken: makeAccessToken(3600),
  refreshToken: 'refresh-1',
  refreshTokenExpires: new Date(Date.now() + 86_400_000).toISOString(),
} as unknown as User;

/** Headers reach the adapter as an AxiosHeaders instance on the way out. */
function readAuthorization(config: AxiosRequestConfig): string | undefined {
  const headers = config.headers as
    | { get?: (name: string) => unknown; Authorization?: unknown }
    | undefined;

  const value =
    typeof headers?.get === 'function' ? headers.get('Authorization') : headers?.Authorization;

  return typeof value === 'string' ? value : undefined;
}

// A real AxiosError instance, because tokenManager decides whether to end the session with
// `instanceof AxiosError`; a look-alike carrying `isAxiosError` would skip that branch here
// while production takes it.
function unauthorized(config: AxiosRequestConfig) {
  const response = { status: 401, data: {}, statusText: 'Unauthorized', headers: {}, config };
  return new AxiosError(
    'Unauthorized',
    AxiosError.ERR_BAD_REQUEST,
    config as never,
    undefined,
    response as never,
  );
}

/**
 * Stands in for the network: every request 401s until `authorized` flips, which is what a
 * server does once the access token has been renewed.
 */
function makeAdapter() {
  const calls: string[] = [];
  let authorized = false;

  const adapter: AxiosAdapter = async config => {
    calls.push(String(readAuthorization(config) ?? ''));

    if (!authorized) {
      return Promise.reject(unauthorized(config));
    }

    return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config };
  };

  return { adapter, calls, authorize: () => (authorized = true) };
}

beforeEach(() => {
  jest.clearAllMocks();
  store.dispatch(setUser(user));
});

describe('axiosInstance 401 handling', () => {
  it('refreshes once and retries the request with the new token', async () => {
    const { adapter, calls, authorize } = makeAdapter();
    axiosInstance.defaults.adapter = adapter;

    mockFetchRefreshToken.mockImplementation(async () => {
      authorize();
      return {
        data: {
          accessToken: makeAccessToken(3600),
          refreshToken: 'refresh-2',
          refreshTokenExpires: new Date(Date.now() + 86_400_000).toISOString(),
        },
      };
    });

    const response = await axiosInstance.get('/channels');

    expect(response.data).toEqual({ ok: true });
    expect(mockFetchRefreshToken).toHaveBeenCalledTimes(1);
    expect(mockFetchRefreshToken).toHaveBeenCalledWith('refresh-1');
    expect(calls).toHaveLength(2);
    expect(calls[1]).toBe(`Bearer ${store.getState().app.user?.accessToken}`);
    expect(store.getState().app.user?.refreshToken).toBe('refresh-2');
  });

  // The rotated refresh token can only be spent once, so two requests failing at the same
  // time must share a single exchange instead of racing each other into a dead session.
  it('spends the refresh token once when several requests get a 401 together', async () => {
    const { adapter, authorize } = makeAdapter();
    axiosInstance.defaults.adapter = adapter;

    mockFetchRefreshToken.mockImplementation(async () => {
      authorize();
      return {
        data: {
          accessToken: makeAccessToken(3600),
          refreshToken: 'refresh-2',
          refreshTokenExpires: new Date(Date.now() + 86_400_000).toISOString(),
        },
      };
    });

    const responses = await Promise.all([
      axiosInstance.get('/channels'),
      axiosInstance.get('/users/me'),
      axiosInstance.get('/messages'),
    ]);

    expect(responses.map(r => r.status)).toEqual([200, 200, 200]);
    expect(mockFetchRefreshToken).toHaveBeenCalledTimes(1);
  });

  // The bug this guards against: the interceptor and the SignalR token factory used to run
  // their own refresh, so a proactive and a reactive refresh could spend the same rotating
  // refresh token and drop the session.
  it('shares one refresh with the SignalR access-token factory', async () => {
    const { adapter, authorize } = makeAdapter();
    axiosInstance.defaults.adapter = adapter;
    // An already-expired access token is what makes the SignalR factory refresh proactively.
    store.dispatch(setUser({ ...user, accessToken: makeAccessToken(-60) }));

    mockFetchRefreshToken.mockImplementation(async () => {
      authorize();
      return {
        data: {
          accessToken: makeAccessToken(3600),
          refreshToken: 'refresh-2',
          refreshTokenExpires: new Date(Date.now() + 86_400_000).toISOString(),
        },
      };
    });

    const [hubToken, response] = await Promise.all([
      getValidAccessToken(),
      axiosInstance.get('/channels'),
    ]);

    expect(mockFetchRefreshToken).toHaveBeenCalledTimes(1);
    expect(hubToken).toBe(store.getState().app.user?.accessToken);
    expect(response.status).toBe(200);
  });

  it('retries with the newer token instead of refreshing again', async () => {
    const rotatedAccessToken = makeAccessToken(3600);
    const calls: string[] = [];
    let requestCount = 0;

    // The first request 401s, but by the time the interceptor sees it another caller has
    // already refreshed — the retry should just use the token now in the store.
    axiosInstance.defaults.adapter = async config => {
      calls.push(String(readAuthorization(config)));
      requestCount += 1;

      if (requestCount === 1) {
        store.dispatch(setUser({ ...user, accessToken: rotatedAccessToken }));
        return Promise.reject(unauthorized(config));
      }

      return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config };
    };

    const response = await axiosInstance.get('/channels');

    expect(response.status).toBe(200);
    expect(mockFetchRefreshToken).not.toHaveBeenCalled();
    expect(calls[1]).toBe(`Bearer ${rotatedAccessToken}`);
  });

  it('clears the session when the server rejects the refresh token', async () => {
    const { adapter } = makeAdapter();
    axiosInstance.defaults.adapter = adapter;
    const rejection = new AxiosError('Unauthorized');
    rejection.response = { status: 401, data: {} } as never;
    mockFetchRefreshToken.mockRejectedValue(rejection);

    await expect(axiosInstance.get('/channels')).rejects.toThrow('Unauthorized');
    expect(store.getState().app.user).toBeNull();
  });

  // Losing the connection says nothing about the refresh token, and dropping the session
  // over it would log the user out of a session that is still valid.
  it('keeps the session when the refresh fails without a response', async () => {
    const { adapter } = makeAdapter();
    axiosInstance.defaults.adapter = adapter;
    mockFetchRefreshToken.mockRejectedValue(new AxiosError('Network Error'));

    await expect(axiosInstance.get('/channels')).rejects.toThrow('Network Error');
    expect(store.getState().app.user).not.toBeNull();
    expect(store.getState().app.user?.refreshToken).toBe('refresh-1');
  });

  it('keeps the session when the refresh endpoint returns a server error', async () => {
    const { adapter } = makeAdapter();
    axiosInstance.defaults.adapter = adapter;
    const serverError = new AxiosError('Bad Gateway');
    serverError.response = { status: 502, data: {} } as never;
    mockFetchRefreshToken.mockRejectedValue(serverError);

    await expect(axiosInstance.get('/channels')).rejects.toThrow('Bad Gateway');
    expect(store.getState().app.user).not.toBeNull();
  });

  it('can refresh again after a failed attempt', async () => {
    const { adapter, authorize } = makeAdapter();
    axiosInstance.defaults.adapter = adapter;
    mockFetchRefreshToken.mockRejectedValueOnce(new AxiosError('Network Error'));

    await expect(axiosInstance.get('/channels')).rejects.toThrow('Network Error');

    mockFetchRefreshToken.mockImplementation(async () => {
      authorize();
      return {
        data: {
          accessToken: makeAccessToken(3600),
          refreshToken: 'refresh-2',
          refreshTokenExpires: new Date(Date.now() + 86_400_000).toISOString(),
        },
      };
    });

    const response = await axiosInstance.get('/channels');

    expect(response.status).toBe(200);
    expect(mockFetchRefreshToken).toHaveBeenCalledTimes(2);
  });

  it('does not attempt a refresh when there is no session', async () => {
    const { adapter } = makeAdapter();
    axiosInstance.defaults.adapter = adapter;
    store.dispatch({ type: 'app/clearUser' });

    await expect(axiosInstance.get('/channels')).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(mockFetchRefreshToken).not.toHaveBeenCalled();
  });

  it('gives up instead of looping when the retried request is rejected again', async () => {
    const { adapter, calls } = makeAdapter();
    axiosInstance.defaults.adapter = adapter;

    // The server keeps returning 401 even after a successful refresh.
    mockFetchRefreshToken.mockResolvedValue({
      data: {
        accessToken: makeAccessToken(3600),
        refreshToken: 'refresh-2',
        refreshTokenExpires: new Date(Date.now() + 86_400_000).toISOString(),
      },
    });

    await expect(axiosInstance.get('/channels')).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(mockFetchRefreshToken).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(2);
  });

  // The refresh call travels on the same instance as everything else, so its own 401 comes
  // back through this interceptor. Until the refresh endpoint was exempted, that second pass
  // awaited the very refresh promise that was waiting on it: nothing ever settled, so the
  // session was neither renewed nor cleared and the app sat on its loading screen forever.
  it('clears the session instead of hanging when the refresh request itself 401s', async () => {
    const { adapter, calls } = makeAdapter();
    axiosInstance.defaults.adapter = adapter;

    // Faithful to production, where fetchRefreshToken posts through this same instance.
    mockFetchRefreshToken.mockImplementation((refreshToken: string) =>
      axiosInstance.post('/auth/refresh', { refreshToken }),
    );

    await expect(axiosInstance.get('/channels')).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(store.getState().app.user).toBeNull();
    // The original request and one refresh attempt — no second trip round the loop.
    expect(calls).toHaveLength(2);
    expect(mockFetchRefreshToken).toHaveBeenCalledTimes(1);
  });
});
