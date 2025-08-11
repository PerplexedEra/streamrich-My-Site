'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: ${({ theme }) => theme.space[6]};
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  margin: ${({ theme }) => theme.space[4]} 0;
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.space[6]};
  line-height: 1.6;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[6]}`};
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const StyledLink = styled.a`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[6]}`};
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  text-decoration: none;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>Oops! Page Not Found</Title>
      <Message>
        The page you're looking for might have been removed, had its name changed, 
        or is temporarily unavailable. Let's get you back on track!
      </Message>
      <Button onClick={handleGoBack}>
        Go Back
      </Button>
      <Link href="/" passHref>
        <StyledLink>Go to Home</StyledLink>
      </Link>
    </Container>
  );
};

export default NotFoundPage;
