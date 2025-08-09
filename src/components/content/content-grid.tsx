import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

type Content = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  type: 'AUDIO' | 'VIDEO';
  creator: {
    name: string;
    avatar: string;
  };
};

interface ContentGridProps {
  content: Content[];
}

export function ContentGrid({ content }: ContentGridProps) {
  if (content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Icons.video className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No content available</h3>
        <p className="text-sm text-muted-foreground mb-4">Check back later for new content</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {content.map((item) => (
        <div key={item.id} className="group relative">
          <Link href={`/content/${item.id}`} className="block">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
              {/* Thumbnail with play button overlay */}
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.thumbnail})` }}
              >
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary/80 p-3 rounded-full">
                    {item.type === 'AUDIO' ? (
                      <Icons.music className="h-6 w-6 text-white" />
                    ) : (
                      <Icons.playCircle className="h-10 w-10 text-white" />
                    )}
                  </div>
                </div>
                
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                  {item.duration}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-muted overflow-hidden">
                    <img 
                      src={item.creator.avatar} 
                      alt={item.creator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {item.creator.name}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span className="flex items-center">
                      <Icons.eye className="h-3 w-3 mr-1" />
                      {item.views}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Icons.heart className="h-3 w-3 mr-1" />
                      {item.likes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
