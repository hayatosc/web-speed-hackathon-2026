import { NewDirectMessageFormData } from "@web-speed-hackathon-2026/client/app/direct_message/types";
import { FormErrors } from "@web-speed-hackathon-2026/client/app/form/types";

export const validate = (
  values: NewDirectMessageFormData,
): FormErrors<NewDirectMessageFormData> => {
  const errors: FormErrors<NewDirectMessageFormData> = {};

  const normalizedUsername = values.username?.trim().replace(/^@/, "") || "";

  if (normalizedUsername.length === 0) {
    errors.username = "ユーザー名を入力してください";
  }

  return errors;
};
