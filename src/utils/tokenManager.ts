import { clearUser, setUser } from '@/redux/reducers/appReducer';
import { store } from '@/redux/store';
import { fetchRefreshToken } from '@/services/apiServices/auths';
import { AxiosError } from 'axios';

let refreshPromise: Promise<string> | null = null;

export async function getValidAccessToken(): Promise<string> {
  const { user } = store.getState().app;
  if (!user) return '';

  if (!isAccessTokenExpired(user.accessToken)) {
    return user.accessToken;
  }

  if (isRefreshTokenExpired(user.refreshTokenExpires)) {
    store.dispatch(clearUser());
    return '';
  }

  return refreshAccessToken().catch(() => '');
}

/**
 * Exchanges the stored refresh token for a new pair, de-duplicating concurrent
 * callers so a proactive refresh (SignalR) and a reactive one (an axios 401)
 * can never spend the same rotating refresh token twice and log the user out.
 * Every refresh in the app must go through here.
 */
export async function refreshAccessToken(): Promise<string> {
  const { user } = store.getState().app;
  if (!user?.refreshToken) {
    store.dispatch(clearUser());
    throw new Error('No refresh token available');
  }

  if (!refreshPromise) {
    refreshPromise = doRefresh(user.refreshToken)
      .catch(error => {
        // Only end the session when the server actually rejects the credential. A network
        // error or a 5xx says nothing about the refresh token, and logging the user out
        // over a dropped connection would lose a session that is still perfectly valid.
        if (isCredentialRejection(error)) {
          store.dispatch(clearUser());
        }
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function isCredentialRejection(error: unknown): boolean {
  if (!(error instanceof AxiosError)) return false;
  const status = error.response?.status;
  return status === 400 || status === 401 || status === 403;
}

async function doRefresh(refreshToken: string): Promise<string> {
  const response = await fetchRefreshToken(refreshToken);

  const updated = response.data as {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpires: string;
  };

  store.dispatch(
    setUser({
      ...store.getState().app.user!,
      accessToken: updated.accessToken,
      refreshToken: updated.refreshToken,
      refreshTokenExpires: updated.refreshTokenExpires,
    }),
  );

  return updated.accessToken;
}

function isAccessTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(decodeBase64Url(token.split('.')[1]));
    return payload.exp * 1000 < Date.now() + 30_000; // 30s buffer
  } catch {
    return true;
  }
}

// JWT segments are base64url (`-`/`_`, no padding); atob expects standard
// base64, so normalise before decoding or it throws on certain tokens.
function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return atob(padded);
}

function isRefreshTokenExpired(refreshTokenExpires: string): boolean {
  return new Date(refreshTokenExpires).getTime() < Date.now();
}
