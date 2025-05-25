import { useContext } from "react";
import {
  useFormContext,
  type FieldValues,
  type FieldPath,
} from "react-hook-form";
import { FormFieldContext, FormItemContext } from "./form";

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

type FormItemContextValue = {
  id: string;
};

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext) as FormFieldContextValue;
  const itemContext = useContext(FormItemContext) as FormItemContextValue;
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};
