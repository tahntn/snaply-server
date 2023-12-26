import { Request, Response, NextFunction } from 'express';
import { LANGUAGE } from '../constant/httpHeader';
import { language } from '../language';
import { IObject } from '../types';

const setLanguage = (req: Request, res: Response, next: NextFunction) => {
  const locale = ['vi', 'en'].includes(req.headers[LANGUAGE] as string)
    ? (req.headers[LANGUAGE] as string)
    : 'vi';

  (req as { locale?: string }).locale = locale;
  (req as { language?: IObject }).language = language(locale);

  next();
};

export default setLanguage;
