import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/lib/types";

const sortOptions: SortOption[] = [
  { label: "Latest repositories", field: "created_at", order: "desc" },
  { label: "Oldest repositories", field: "created_at", order: "asc" },
  { label: "Most stars", field: "stargazers_count", order: "desc" },
  { label: "Least stars", field: "stargazers_count", order: "asc" },
];

interface SortSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function SortSelect({ value, onValueChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort repositories" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem
            key={`${option.field}-${option.order}`}
            value={`${option.field}-${option.order}`}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}