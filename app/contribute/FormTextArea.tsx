import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  required = false,
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <Label className="mb-1 text-highlight">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <Textarea
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        required={required}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="border bg-grayInverted placeholder:text-gray"
      />
    </div>
  );
}
