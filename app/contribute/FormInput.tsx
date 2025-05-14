import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function FormInput({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  readOnly = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <Label className="mb-1 text-highlight">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        required={required}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="border bg-grayInverted placeholder:text-gray"
      />
    </div>
  );
}
