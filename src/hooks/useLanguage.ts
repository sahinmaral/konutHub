import { useEffect } from 'react';
import i18n, { LanguageCode, resolveLanguage } from '../localization/i18n';
import { useAppSelector } from '../redux/hooks';

/**
 * Keeps i18next in sync with the persisted language preference and returns the
 * resolved language code currently in effect. Mirrors the useTheme pattern.
 */
const useLanguage = (): LanguageCode => {
  const mode = useAppSelector(state => state.language.mode);
  const resolved = resolveLanguage(mode);

  useEffect(() => {
    if (i18n.language !== resolved) {
      i18n.changeLanguage(resolved);
    }
  }, [resolved]);

  return resolved;
};

export default useLanguage;
