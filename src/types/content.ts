export type Content = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  type: 'AUDIO' | 'VIDEO';
  creator: {
    id: string;
    name: string;
    avatar: string;
    subscribers: string;
  };
  tags: string[];
  uploadDate: string;
};

export type ContentItem = {
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
