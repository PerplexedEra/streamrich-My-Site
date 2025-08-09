import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";

export function ContentFilters() {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Icons.filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>All Content</DropdownMenuItem>
          <DropdownMenuItem>Videos</DropdownMenuItem>
          <DropdownMenuItem>Music</DropdownMenuItem>
          <DropdownMenuItem>Most Viewed</DropdownMenuItem>
          <DropdownMenuItem>Newest</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
