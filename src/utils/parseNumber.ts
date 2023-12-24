export const parseNumber = (input: string | undefined | null, numberDefault = 1): number => {
  const parsedInput = input ? +input : NaN;
  return !isNaN(parsedInput) ? parsedInput : numberDefault;
};
