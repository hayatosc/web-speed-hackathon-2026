import { Button } from "@web-speed-hackathon-2026/client/app/components/foundation/Button";
import { FormInputField } from "@web-speed-hackathon-2026/client/app/components/foundation/FormInputField";
import { ModalErrorMessage } from "@web-speed-hackathon-2026/client/app/components/modal/ModalErrorMessage";
import { ModalSubmitButton } from "@web-speed-hackathon-2026/client/app/components/modal/ModalSubmitButton";
import { NewDirectMessageFormData } from "@web-speed-hackathon-2026/client/app/direct_message/types";
import { validate } from "@web-speed-hackathon-2026/client/app/direct_message/validation";
import { useForm } from "@web-speed-hackathon-2026/client/app/hooks/use_form";

interface Props {
  id: string;
  onSubmit: (values: NewDirectMessageFormData) => Promise<void>;
}

export const NewDirectMessageModalPage = ({ id, onSubmit }: Props) => {
  const { getFieldError, getInputProps, handleSubmit, isInvalid, isSubmitting, submitError } =
    useForm<NewDirectMessageFormData>({
      initialValues: {
        username: "",
      },
      onSubmit,
      validate,
    });

  return (
    <div className="grid gap-y-6">
      <h2 className="text-center text-2xl font-bold">新しくDMを始める</h2>

      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>
        <FormInputField
          {...getInputProps("username")}
          error={getFieldError("username")}
          label="ユーザー名"
          leftItem={<span className="text-cax-text-subtle leading-none">@</span>}
          placeholder="username"
        />

        <div className="grid gap-y-2">
          <ModalSubmitButton
            className={submitError ? "!bg-cax-brand/50 hover:!bg-cax-brand/50" : undefined}
            disabled={isSubmitting || isInvalid}
            loading={isSubmitting}
          >
            DMを開始
          </ModalSubmitButton>
          <Button variant="secondary" command="close" commandfor={id}>
            キャンセル
          </Button>
        </div>

        <ModalErrorMessage>{submitError ?? null}</ModalErrorMessage>
      </form>
    </div>
  );
};
