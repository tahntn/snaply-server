export const randomNumber = (n: number) => {
  const randomDecimal = Math.random();

  const randomNumber = randomDecimal * n;
  return Math.floor(randomNumber) + 1;
};
