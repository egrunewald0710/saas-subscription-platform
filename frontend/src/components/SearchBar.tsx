import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search...", label = "Search" }: SearchBarProps) {
  return (
    <label className="table-search search-control">
      <Search size={15} aria-hidden="true" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={label} />
    </label>
  );
}
