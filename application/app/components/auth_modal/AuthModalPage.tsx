import { AuthFormData } from "@web-speed-hackathon-2026/client/app/auth/types";
import { validate } from "@web-speed-hackathon-2026/client/app/auth/validation";
import { FormInputField } from "@web-speed-hackathon-2026/client/app/components/foundation/FormInputField";
import { Link } from "@web-speed-hackathon-2026/client/app/components/foundation/Link";
import { ModalErrorMessage } from "@web-speed-hackathon-2026/client/app/components/modal/ModalErrorMessage";
import { ModalSubmitButton } from "@web-speed-hackathon-2026/client/app/components/modal/ModalSubmitButton";
import { useForm } from "@web-speed-hackathon-2026/client/app/hooks/use_form";

interface Props {
  onRequestCloseModal: () => void;
  onSubmit: (values: AuthFormData) => Promise<void>;
}

export const AuthModalPage = ({ onRequestCloseModal, onSubmit }: Props) => {
  const { getFieldError, getInputProps, handleSubmit, isInvalid, isSubmitting, setValue, submitError, values } =
    useForm<AuthFormData>({
      initialValues: {
        name: "",
        password: "",
        type: "signin",
        username: "",
      },
      onSubmit,
      validate,
    });
  const type = values.type;

  return (
    <form className="grid gap-y-6" onSubmit={handleSubmit}>
      <h2 className="text-center text-2xl font-bold">
        {type === "signin" ? "サインイン" : "新規登録"}
      </h2>

      <div className="flex justify-center">
        <button
          className="text-cax-brand underline"
          onClick={() => setValue("type", type === "signin" ? "signup" : "signin")}
          type="button"
        >
          {type === "signin" ? "初めての方はこちら" : "サインインはこちら"}
        </button>
      </div>

      <div className="grid gap-y-2">
        <FormInputField
          {...getInputProps("username")}
          autoComplete="username"
          error={getFieldError("username")}
          label="ユーザー名"
          leftItem={<span className="text-cax-text-subtle leading-none">@</span>}
        />

        {type === "signup" && (
          <FormInputField
            {...getInputProps("name")}
            autoComplete="nickname"
            error={getFieldError("name")}
            label="名前"
          />
        )}

        <FormInputField
          {...getInputProps("password")}
          autoComplete={type === "signup" ? "new-password" : "current-password"}
          error={getFieldError("password")}
          label="パスワード"
          type="password"
        />
      </div>

      {type === "signup" ? (
        <p>
          <Link className="text-cax-brand underline" onClick={onRequestCloseModal} to="/terms">
            利用規約
          </Link>
          に同意して
        </p>
      ) : null}

      <ModalSubmitButton disabled={isSubmitting || isInvalid} loading={isSubmitting}>
        {type === "signin" ? "サインイン" : "登録する"}
      </ModalSubmitButton>

      <ModalErrorMessage>{submitError ?? null}</ModalErrorMessage>
    </form>
  );
};
