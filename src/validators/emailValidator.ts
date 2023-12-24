import Joi from 'joi';

export const validateEmail = (email: string): string | null => {
  const emailSchema = Joi.string().email().required();
  const { error } = emailSchema.validate(email);

  if (error) {
    return 'Please enter a valid email.';
  }

  return null;
};
