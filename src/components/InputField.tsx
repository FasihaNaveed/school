import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: UseFormRegisterReturn;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  defaultValue,
  error,
  hidden,
  inputProps,
}: InputFieldProps) => {
  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register}
        {...inputProps}
        defaultValue={defaultValue}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message}</p>
      )}
    </div>
  );
};

export default InputField;