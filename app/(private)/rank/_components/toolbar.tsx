import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Toolbar({ query, setQuery }: {
  query: string;
  setQuery: (v: string) => void;
  timeframe: string;
  setTimeframe: (v: string) => void;
  onRefresh?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome…"
          className="pl-9"
        />
      </div>
    </div>
  );
}