import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Content } from "@/types/content";

export function ContentPlayer({ content }: { content: Content }) {
  return (
    <div className="bg-black rounded-lg overflow-hidden mb-6">
      {content.type === 'VIDEO' ? (
        <div className="aspect-video w-full bg-muted flex items-center justify-center">
          <div className="text-center p-8">
            <Icons.video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Video player will be displayed here</p>
          </div>
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <div className="text-center p-8">
            <Icons.music className="h-16 w-16 mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">Audio player will be displayed here</p>
          </div>
        </div>
      )}
      
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icons.heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icons.share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icons.bookmark className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icons.plus className="h-4 w-4 mr-2" />
              Save to Playlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
