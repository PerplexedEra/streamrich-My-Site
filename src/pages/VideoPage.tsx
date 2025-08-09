import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
`;

const VideoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space[6]};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const VideoPlayer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: ${({ theme }) => theme.colors.gray800};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const VideoTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const VideoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]};
  padding-bottom: ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ChannelInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const ChannelAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gray700};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const ChannelName = styled.div`
  font-weight: 600;
`;

const SubscribeButton = styled.button`
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const VideoDescription = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const RelatedVideo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Thumbnail = styled.div`
  width: 160px;
  min-width: 160px;
  height: 90px;
  background: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const RelatedVideoInfo = styled.div``;

const RelatedVideoTitle = styled.div`
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.space[1]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RelatedVideoMeta = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const VideoPage: React.FC = () => {
  // This would come from your data/API in a real app
  const video = {
    id: '1',
    title: 'How to Make Money Watching Videos Online',
    channel: 'StreamRich Tutorials',
    views: '1.2M',
    timestamp: '2 days ago',
    description: 'Learn how to maximize your earnings on StreamRich with these pro tips and tricks for watching and engaging with content.',
    duration: '12:34',
  };

  const relatedVideos = Array(5).fill({
    id: '1',
    title: 'Top 10 Ways to Earn More on StreamRich',
    channel: 'Earning Tips',
    views: '854K',
    timestamp: '1 week ago',
    duration: '8:45',
  });

  return (
    <Container>
      <VideoContainer>
        <div>
          <VideoPlayer>
            {/* Video player would go here */}
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              background: 'linear-gradient(45deg, #6C63FF, #00C9A7)'
            }}>
              Video Player
            </div>
          </VideoPlayer>
          
          <VideoTitle>{video.title}</VideoTitle>
          
          <VideoMeta>
            <ChannelInfo>
              <ChannelAvatar>SR</ChannelAvatar>
              <div>
                <ChannelName>{video.channel}</ChannelName>
                <div style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>1.2M subscribers</div>
              </div>
            </ChannelInfo>
            <SubscribeButton>Subscribe</SubscribeButton>
          </VideoMeta>
          
          <VideoDescription>
            <p>{video.description}</p>
            <div style={{ marginTop: '1rem', color: '#A0AEC0', fontSize: '0.875rem' }}>
              {video.views} views • {video.timestamp}
            </div>
          </VideoDescription>
        </div>
        
        <Sidebar>
          <h3 style={{ marginBottom: '0.5rem' }}>Up next</h3>
          {relatedVideos.map((video, index) => (
            <RelatedVideo key={index}>
              <Thumbnail />
              <RelatedVideoInfo>
                <RelatedVideoTitle>{video.title}</RelatedVideoTitle>
                <RelatedVideoMeta>
                  {video.channel} • {video.views} views • {video.timestamp}
                </RelatedVideoMeta>
              </RelatedVideoInfo>
            </RelatedVideo>
          ))}
        </Sidebar>
      </VideoContainer>
    </Container>
  );
};

export default VideoPage;
