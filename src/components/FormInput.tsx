import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";

interface FormInputProps {
  id: string;
  value: string;
  type: "email" | "password" | "text";
  onChange: (e: any) => void;
  title: string;
  placeholder: string;
}

const FormInput = ({
  id,
  value,
  onChange,
  title,
  placeholder,
  type,
}: FormInputProps) => (
  <div className="space-y-1">
    <Label htmlFor={id}>{title}</Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default FormInput;
