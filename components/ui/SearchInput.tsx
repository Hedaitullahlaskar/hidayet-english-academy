import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

/** A search box for filtering an already-fetched list/table client-side — not a server query. */
export function SearchInput({ value, onChange, placeholder = "Search…", className, ...rest }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400 dark:text-navy-500" strokeWidth={2} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={rest["aria-label"] ?? placeholder}
        className="w-full rounded-lg border border-navy-200 bg-white py-2.5 pl-9 pr-9 text-sm text-navy-900 outline-none transition-colors focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-navy-400 transition-colors hover:bg-navy-100 hover:text-navy-700 dark:text-navy-500 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}
