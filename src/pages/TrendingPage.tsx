import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
`;

const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.space[1]};
  border-radius: ${({ theme }) => theme.radii.full};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[6]}`};
  background: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active }) => active ? 'white' : 'inherit'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
`;

const VideoCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const Thumbnail = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: ${({ theme }) => theme.colors.gray700};
  position: relative;
  
  &::after {
    content: '▶';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: white;
    opacity: 0.8;
  }
  
  .duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.75rem;
  }
`;

const VideoInfo = styled.div`
  padding: ${({ theme }) => theme.space[3]};
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const ChannelAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gray700};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  flex-shrink: 0;
`;

const VideoTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-bottom: ${({ theme }) => theme.space[1]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ChannelName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const VideoMeta = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  gap: ${({ theme }) => theme.space[2]};
  
  span:not(:last-child)::after {
    content: '•';
    margin-left: ${({ theme }) => theme.space[2]};
  }
`;

const EarningBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.primary};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 4px;
  
  &::before {
    content: '💰';
    margin-right: 4px;
  }
`;

// Mock data for trending videos
const trendingVideos = [
  {
    id: '1',
    title: 'How to Make Money Watching Videos Online - Complete Guide 2025',
    channel: 'StreamRich Tutorials',
    views: '1.2M',
    timestamp: '2 days ago',
    duration: '12:34',
    isEarning: true,
    earnings: '5.2K',
  },
  {
    id: '2',
    title: 'Top 10 Ways to Earn More on StreamRich',
    channel: 'Earning Tips',
    views: '854K',
    timestamp: '1 week ago',
    duration: '8:45',
    isEarning: true,
    earnings: '3.8K',
  },
  {
    id: '3',
    title: 'StreamRich vs Competitors: Which Pays More?',
    channel: 'Tech Reviews',
    views: '1.5M',
    timestamp: '3 days ago',
    duration: '15:22',
    isEarning: false,
  },
  {
    id: '4',
    title: 'My First Month on StreamRich - $1,234 Earned!',
    channel: 'Earning Journey',
    views: '2.3M',
    timestamp: '5 days ago',
    duration: '18:12',
    isEarning: true,
    earnings: '8.7K',
  },
  {
    id: '5',
    title: 'Best Lofi Beats to Study/Work To - 24/7 Livestream',
    channel: 'Chill Beats',
    views: '5.7M',
    timestamp: 'Streaming now',
    duration: 'LIVE',
    isEarning: true,
    isLive: true,
  },
  {
    id: '6',
    title: 'How Creators Can Maximize Their Earnings on StreamRich',
    channel: 'Creator Academy',
    views: '423K',
    timestamp: '1 day ago',
    duration: '22:18',
    isEarning: true,
    earnings: '2.1K',
  },
];

export const TrendingPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('all');
  
  const filteredVideos = activeTab === 'all' 
    ? trendingVideos 
    : trendingVideos.filter(video => video.isEarning);

  return (
    <Container>
      <Header>
        <Title>Trending Now</Title>
        <Tabs>
          <Tab 
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            All Videos
          </Tab>
          <Tab 
            active={activeTab === 'earning'}
            onClick={() => setActiveTab('earning')}
          >
            Earning Content
          </Tab>
        </Tabs>
      </Header>
      
      <VideoGrid>
        {filteredVideos.map((video) => (
          <VideoCard key={video.id}>
            <Thumbnail>
              {video.isLive && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: '#FF0000',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    background: 'white',
                    borderRadius: '50%',
                  }} />
                  LIVE
                </div>
              )}
              <div className="duration">
                {video.isLive ? 'LIVE' : video.duration}
              </div>
            </Thumbnail>
            <VideoInfo>
              <VideoTitle>{video.title}</VideoTitle>
              <ChannelInfo>
                <ChannelAvatar>
                  {video.channel.split(' ').map(n => n[0]).join('')}
                </ChannelAvatar>
                <div>
                  <ChannelName>{video.channel}</ChannelName>
                  <VideoMeta>
                    <span>{video.views} views</span>
                    <span>{video.timestamp}</span>
                  </VideoMeta>
                  {video.isEarning && video.earnings && (
                    <EarningBadge>Earned {video.earnings} SRC</EarningBadge>
                  )}
                </div>
              </ChannelInfo>
            </VideoInfo>
          </VideoCard>
        ))}
      </VideoGrid>
    </Container>
  );
};

export default TrendingPage;
