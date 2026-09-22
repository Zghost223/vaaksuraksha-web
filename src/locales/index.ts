import { en } from './en';
import { hi } from './hi';
import { mr } from './mr';
import { gu } from './gu';
import { ta } from './ta';
import { bn } from './bn';
import { te } from './te';

export { en, hi, mr, gu, ta, bn, te };

export type Locale = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'bn' | 'te';

export const locales: Locale[] = ['en', 'hi', 'mr', 'gu', 'ta', 'bn', 'te'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  ta: 'தமிழ்',
  bn: 'বাংলা',
  te: 'తెలుగు',
};

export const defaultLocale: Locale = 'en';

export function getLocaleStrings(locale: Locale) {
  switch (locale) {
    case 'hi': return hi;
    case 'mr': return mr;
    case 'gu': return gu;
    case 'ta': return ta;
    case 'bn': return bn;
    case 'te': return te;
    default: return en;
  }
}