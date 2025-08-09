import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

export function ContentSearch() {
  return (
    <div className="relative flex-1 md:max-w-sm">
      <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search content..."
        className="w-full rounded-lg bg-background pl-8"
      />
    </div>
  );
}
