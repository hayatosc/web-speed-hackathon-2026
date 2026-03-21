import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

import { FormErrors } from "@web-speed-hackathon-2026/client/src/form/types";

type FormValues = object;
type TouchedState<T extends FormValues> = Partial<Record<keyof T, boolean>>;

interface UseFormOptions<T extends FormValues> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate: (values: T) => FormErrors<T>;
}

const getInitialStateKey = <T extends FormValues>(values: T) => JSON.stringify(values);

const getTouchedState = <T extends FormValues>(values: T): TouchedState<T> => {
  return Object.keys(values).reduce<TouchedState<T>>((accumulator, key) => {
    accumulator[key as keyof T] = true;
    return accumulator;
  }, {});
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "送信に失敗しました";
};

export const useForm = <T extends FormValues>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<TouchedState<T>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  const initialStateKey = getInitialStateKey(initialValues);

  useEffect(() => {
    setValues(initialValues);
    setTouched({});
    setHasSubmitted(false);
    setIsSubmitting(false);
    setSubmitError(undefined);
  }, [initialStateKey]);

  const errors = useMemo(() => validate(values), [validate, values]);
  const isInvalid = Object.keys(errors).length > 0;

  const setValue = <K extends keyof T>(name: K, value: T[K]) => {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setSubmitError(undefined);
  };

  const touch = <K extends keyof T>(name: K) => {
    setTouched((currentTouched) => ({
      ...currentTouched,
      [name]: true,
    }));
  };

  const getInputProps = <K extends keyof T>(name: K) => ({
    name: String(name),
    onBlur: () => {
      touch(name);
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      setValue(name, event.currentTarget.value as T[K]);
    },
    value: values[name],
  });

  const getFieldError = <K extends keyof T>(name: K) => {
    if (!touched[name] && !hasSubmitted) {
      return undefined;
    }
    return errors[name];
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setTouched(getTouchedState(values));

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(undefined);
    try {
      await onSubmit(values);
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    getFieldError,
    getInputProps,
    handleSubmit,
    isInvalid,
    isSubmitting,
    setValue,
    submitError,
    values,
  };
};
