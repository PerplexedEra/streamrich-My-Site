import Link from "next/link";
import { Icons } from "@/components/icons";
import { Content } from "@/types/content";

interface RelatedContentProps {
  items: Array<{
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: string;
    type: 'AUDIO' | 'VIDEO';
    creator: {
      name: string;
    };
  }>;
}

export function RelatedContent({ items }: RelatedContentProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Up next</h3>
      
      <div className="space-y-3">
        {items.map((item) => (
          <Link 
            key={item.id} 
            href={`/content/${item.id}`}
            className="group flex gap-2"
          >
            <div className="relative flex-shrink-0 w-[120px] h-[68px] bg-muted rounded overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.thumbnail})` }}
              >
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary/80 p-1.5 rounded-full">
                    {item.type === 'AUDIO' ? (
                      <Icons.music className="h-4 w-4 text-white" />
                    ) : (
                      <Icons.playCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] px-1 rounded">
                  {item.duration}
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary">
                {item.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {item.creator.name}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Icons.eye className="h-3 w-3 mr-1" />
                  {item.views}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
