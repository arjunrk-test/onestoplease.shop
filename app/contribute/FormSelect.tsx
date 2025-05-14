import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FormSelect({
  label,
  required,
  options,
  onChange,
}: {
  label: string;
  required?: boolean;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1 text-highlight">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <Select required={required} onValueChange={onChange}>
        <SelectTrigger className="bg-grayInverted">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="bg-grayInverted text-background">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
