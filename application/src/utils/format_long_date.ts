const longDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const shortTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const withRelativeSuffix = (value: string, isFuture: boolean) => {
  return `${value}${isFuture ? "後" : "前"}`;
};

export const formatLongDate = (value: Date | number | string) => {
  return longDateFormatter.format(new Date(value));
};

export const formatShortTime = (value: Date | number | string) => {
  return shortTimeFormatter.format(new Date(value));
};

export const formatRelativeTime = (value: Date | number | string, now = Date.now()) => {
  const targetTime = new Date(value).getTime();
  const diff = targetTime - now;
  const absoluteDiff = Math.abs(diff);
  const isFuture = diff > 0;

  if (absoluteDiff < 45 * SECOND) {
    return withRelativeSuffix("数秒", isFuture);
  }
  if (absoluteDiff < 90 * SECOND) {
    return withRelativeSuffix("1分", isFuture);
  }
  if (absoluteDiff < 45 * MINUTE) {
    return withRelativeSuffix(`${Math.round(absoluteDiff / MINUTE)}分`, isFuture);
  }
  if (absoluteDiff < 90 * MINUTE) {
    return withRelativeSuffix("1時間", isFuture);
  }
  if (absoluteDiff < 22 * HOUR) {
    return withRelativeSuffix(`${Math.round(absoluteDiff / HOUR)}時間`, isFuture);
  }
  if (absoluteDiff < 36 * HOUR) {
    return withRelativeSuffix("1日", isFuture);
  }
  if (absoluteDiff < 26 * DAY) {
    return withRelativeSuffix(`${Math.round(absoluteDiff / DAY)}日`, isFuture);
  }
  if (absoluteDiff < 46 * DAY) {
    return withRelativeSuffix("1か月", isFuture);
  }
  if (absoluteDiff < 320 * DAY) {
    return withRelativeSuffix(`${Math.round(absoluteDiff / MONTH)}か月`, isFuture);
  }
  if (absoluteDiff < 548 * DAY) {
    return withRelativeSuffix("1年", isFuture);
  }
  return withRelativeSuffix(`${Math.round(absoluteDiff / YEAR)}年`, isFuture);
};

export const toISOString = (value: Date | number | string) => {
  return new Date(value).toISOString();
};
