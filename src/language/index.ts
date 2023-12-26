import { languages } from '../constant/language';
import en from './en';
import vi from './vi';

const LANGUAGE = {
  [languages.en]: en,
  [languages.vi]: vi,
};

export const language = (locale: string) => {
  return LANGUAGE[locale];
};
