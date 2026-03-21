export type FormErrors<T extends object> = Partial<Record<keyof T, string>>;
