import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RadioGroupDemo() {
  return (
    // <div className="flex mt-4">
    <RadioGroup defaultValue="comfortable" className="flex mt-4 gap-8">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1" id="1" />
        <Label htmlFor="1">Completed</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="0" id="0" />
        <Label htmlFor="0">Not Completed</Label>
      </div>
    </RadioGroup>
    // </div>
  );
}
