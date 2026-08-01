import { Locale } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import i18n from '@/localization/i18n';

/** date-fns locale matching the currently active app language. */
export const getDateFnsLocale = (): Locale => (i18n.language === 'tr' ? tr : enUS);
