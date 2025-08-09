import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space[8]};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    text-align: left;
    align-items: flex-start;
  }
`;

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  margin-bottom: ${({ theme }) => theme.space[4]};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-right: ${({ theme }) => theme.space[8]};
    margin-bottom: 0;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Username = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Stats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Bio = styled.p`
  margin-bottom: ${({ theme }) => theme.space[6]};
  line-height: 1.6;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[6]}`};
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &.outline {
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    margin-left: ${({ theme }) => theme.space[3]};
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[4]}`};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ active }) => active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TabContent = styled.div`
  min-height: 300px;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[6]};
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
`;

const VideoInfo = styled.div`
  padding: ${({ theme }) => theme.space[3]};
`;

const VideoTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-bottom: ${({ theme }) => theme.space[1]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const VideoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space[12]} 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('videos');
  
  // Mock data - in a real app, this would come from an API
  const profile = {
    name: 'Alex Johnson',
    username: '@alexj',
    bio: 'Content creator and music enthusiast. Making videos about music production, sound design, and creative process. Join me on this journey!',
    stats: {
      videos: 42,
      followers: '12.5K',
      following: 356,
      earnings: '5,720',
    },
    videos: Array(6).fill({
      id: '1',
      title: 'How to Make Beats Like a Pro',
      views: '12.5K',
      timestamp: '2 days ago',
      duration: '12:34',
    }),
    playlists: Array(3).fill({
      id: '1',
      title: 'Music Production Tutorials',
      videoCount: 8,
    }),
    likedVideos: Array(4).fill({
      id: '1',
      title: 'Top 10 Synth Sounds You Need to Know',
      creator: 'Sound Design Pro',
      views: '45.2K',
      timestamp: '1 week ago',
    }),
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'videos':
        return (
          <VideoGrid>
            {profile.videos.map((video: any, index: number) => (
              <VideoCard key={index}>
                <Thumbnail />
                <VideoInfo>
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoMeta>
                    <span>{video.views} views</span>
                    <span>{video.timestamp}</span>
                  </VideoMeta>
                </VideoInfo>
              </VideoCard>
            ))}
          </VideoGrid>
        );
      case 'playlists':
        return (
          <VideoGrid>
            {profile.playlists.map((playlist: any, index: number) => (
              <VideoCard key={index}>
                <Thumbnail>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem',
                  }}>
                    {playlist.videoCount} videos
                  </div>
                </Thumbnail>
                <VideoInfo>
                  <VideoTitle>{playlist.title}</VideoTitle>
                  <VideoMeta>
                    <span>{playlist.videoCount} videos</span>
                  </VideoMeta>
                </VideoInfo>
              </VideoCard>
            ))}
          </VideoGrid>
        );
      case 'liked':
        return (
          <VideoGrid>
            {profile.likedVideos.map((video: any, index: number) => (
              <VideoCard key={index}>
                <Thumbnail />
                <VideoInfo>
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoMeta>
                    <span>{video.creator}</span>
                    <span>{video.views} views</span>
                  </VideoMeta>
                </VideoInfo>
              </VideoCard>
            ))}
          </VideoGrid>
        );
      case 'earnings':
        return (
          <div>
            <h3>Earnings Overview</h3>
            <div style={{
              background: 'linear-gradient(135deg, #6C63FF, #00C9A7)',
              padding: '2rem',
              borderRadius: '1rem',
              color: 'white',
              margin: '1.5rem 0',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Earnings</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                {profile.stats.earnings} <span style={{ fontSize: '1rem', opacity: 0.9 }}>SRC</span>
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>≈ ${(parseInt(profile.stats.earnings.replace(/,/g, '')) * 0.1).toLocaleString()}</div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              margin: '2rem 0',
            }}>
              <div style={{
                background: 'rgba(108, 99, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>This Month</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>1,240 SRC</div>
                <div style={{ color: '#4CAF50', fontSize: '0.875rem' }}>+12% from last month</div>
              </div>
              
              <div style={{
                background: 'rgba(0, 201, 167, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>Total Views</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>124.5K</div>
                <div style={{ color: '#4CAF50', fontSize: '0.875rem' }}>+5,240 this month</div>
              </div>
              
              <div style={{
                background: 'rgba(76, 175, 80, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>Subscribers</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>12.5K</div>
                <div style={{ color: '#4CAF50', fontSize: '0.875rem' }}>+342 this month</div>
              </div>
            </div>
            
            <Button>Withdraw Earnings</Button>
          </div>
        );
      default:
        return <EmptyState>No content available</EmptyState>;
    }
  };

  return (
    <Container>
      <ProfileHeader>
        <Avatar>
          {profile.name.split(' ').map((n: string) => n[0]).join('')}
        </Avatar>
        <ProfileInfo>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.5rem' }}>
            <Name>{profile.name}</Name>
            <div style={{ marginLeft: 'auto', display: 'flex' }}>
              <Button>Edit Profile</Button>
              <Button className="outline">Share</Button>
            </div>
          </div>
          <Username>{profile.username}</Username>
          
          <Stats>
            <StatItem>
              <StatValue>{profile.stats.videos}</StatValue>
              <StatLabel>Videos</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{profile.stats.followers}</StatValue>
              <StatLabel>Followers</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{profile.stats.following}</StatValue>
              <StatLabel>Following</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{profile.stats.earnings}</StatValue>
              <StatLabel>Earned (SRC)</StatLabel>
            </StatItem>
          </Stats>
          
          <Bio>{profile.bio}</Bio>
        </ProfileInfo>
      </ProfileHeader>
      
      <Tabs>
        <Tab 
          active={activeTab === 'videos'}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </Tab>
        <Tab 
          active={activeTab === 'playlists'}
          onClick={() => setActiveTab('playlists')}
        >
          Playlists
        </Tab>
        <Tab 
          active={activeTab === 'liked'}
          onClick={() => setActiveTab('liked')}
        >
          Liked Videos
        </Tab>
        <Tab 
          active={activeTab === 'earnings'}
          onClick={() => setActiveTab('earnings')}
        >
          Earnings
        </Tab>
      </Tabs>
      
      <TabContent>
        {renderTabContent()}
      </TabContent>
    </Container>
  );
};

export default ProfilePage;
