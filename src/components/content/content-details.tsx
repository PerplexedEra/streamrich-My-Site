import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Content } from "@/types/content";

export function ContentDetails({ content }: { content: Content }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{content.views} views</span>
          <span>•</span>
          <span>{content.uploadDate}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Icons.thumbsUp className="h-4 w-4" />
            <span>{content.likes}</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Icons.thumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
            <img 
              src={content.creator.avatar} 
              alt={content.creator.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{content.creator.name}</h3>
              <p className="text-sm text-muted-foreground">
                {content.creator.subscribers} subscribers
              </p>
            </div>
            <Button size="sm" className="rounded-full">
              Subscribe
            </Button>
          </div>
          
          <div className="mt-3 text-sm">
            <p className="whitespace-pre-line">{content.description}</p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
