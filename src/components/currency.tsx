type CurrencyProps = {
  value: number;
};

export function Currency({ value }: CurrencyProps) {
  return value.toLocaleString(navigator.language, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}
