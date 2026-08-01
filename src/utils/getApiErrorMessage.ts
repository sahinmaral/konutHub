import { AxiosError } from 'axios';
import { ApiError } from '../types';

const FALLBACK_MESSAGE = 'The server is unavailable. Please try again later.';

/**
 * Extracts a user-facing message from an AxiosError.
 *
 * The API returns errors in the {@link ApiError} shape, but the message can
 * live in one of two places:
 *   - `detail` for general errors, or
 *   - `errors[].errorMessage` for validation errors (where `detail` is empty).
 *
 * Infrastructure failures (502/503/504 from a proxy or gateway, network
 * errors, timeouts) arrive with no body, an HTML page, or no `response` at
 * all. In those cases `response.data` is not an ApiError, so we fall back to a
 * generic message instead of blindly reading `.detail` (which would be
 * undefined, empty, or throw).
 */
export function getApiErrorMessage(error: AxiosError): string {
  const data = error.response?.data as Partial<ApiError> | undefined;

  if (data && typeof data === 'object') {
    if (typeof data.detail === 'string' && data.detail.trim()) {
      return data.detail;
    }

    const validationMessage = data.errors?.find(e => e?.errorMessage)?.errorMessage;
    if (validationMessage) {
      return validationMessage;
    }
  }

  return FALLBACK_MESSAGE;
}
