import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: ${({ theme }) => `${theme.space[16]} ${theme.space[4]}`};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20 0%, ${({ theme }) => theme.colors.secondary}20 100%);
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: ${({ theme }) => theme.space[12]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  margin-bottom: ${({ theme }) => theme.space[4]};
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.space[8]};
`;

const CTAButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[6]}`};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-weight: 600;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[12]};
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.space[6]};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.colors.primary}20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

export const HomePage: React.FC = () => {
  return (
    <Container>
      <HeroSection>
        <Title>Earn While You Watch</Title>
        <Subtitle>
          StreamRich rewards you for watching videos and listening to music. 
          Get paid for your time, or upload your content and grow your audience.
        </Subtitle>
        <CTAButton>Get Started - It's Free</CTAButton>
      </HeroSection>
      
      <FeaturesSection>
        <FeatureCard>
          <FeatureIcon>🎬</FeatureIcon>
          <FeatureTitle>Watch & Earn</FeatureTitle>
          <FeatureDescription>
            Earn coins for every minute of content you watch. The more you watch, the more you earn!
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🎵</FeatureIcon>
          <FeatureTitle>Upload & Monetize</FeatureTitle>
          <FeatureDescription>
            Share your music and videos with the world. Get paid when users engage with your content.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>💎</FeatureIcon>
          <FeatureTitle>Premium Content</FeatureTitle>
          <FeatureDescription>
            Access exclusive content from top creators and earn bonus rewards for premium engagement.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
    </Container>
  );
};

export default HomePage;
