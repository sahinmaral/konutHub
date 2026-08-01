import { act, renderHook } from '@testing-library/react-native';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('does not update the value before the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      {
        initialProps: { value: 'a' },
      },
    );

    rerender({ value: 'b' });
    act(() => {
      jest.advanceTimersByTime(299);
    });

    expect(result.current).toBe('a');
  });

  it('updates to the latest value once the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      {
        initialProps: { value: 'a' },
      },
    );

    rerender({ value: 'b' });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('b');
  });

  it('resets the timer when the value changes again before the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      {
        initialProps: { value: 'a' },
      },
    );

    rerender({ value: 'b' });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    rerender({ value: 'c' });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Only 200ms elapsed since the latest change ('c'), so it hasn't committed yet.
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('c');
  });
});
