import { AxiosError } from 'axios';
import { showMessage } from 'react-native-flash-message';
import i18n from '@/localization/i18n';
import { getApiErrorMessage } from './getApiErrorMessage';

/**
 * Shows a danger flash message for a caught exception: the API-provided
 * message when it is an {@link AxiosError}, otherwise a generic fallback.
 */
export function notifyApiError(exception: unknown): void {
  if (exception instanceof AxiosError) {
    showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
  } else {
    showMessage({ message: i18n.t('common.errorOccurred'), type: 'danger' });
  }
}
