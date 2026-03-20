const longDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const formatLongDate = (value: Date | number | string) => {
  return longDateFormatter.format(new Date(value));
};
