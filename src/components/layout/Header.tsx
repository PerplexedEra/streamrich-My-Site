'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
  
  @media (prefers-color-scheme: dark) {
    background: rgba(26, 32, 44, 0.8);
  }
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[4]};
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  display: flex;
`;

const Logo = styled.span`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  span {
    display: inline-block;
    margin-left: ${({ theme }) => theme.space[2]};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: ${({ theme }) => `${theme.space[2]} 0`};
  position: relative;
  transition: color 0.2s ease-in-out;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.2s ease-in-out;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    
    &::after {
      width: 100%;
    }
  }
  
  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    
    &::after {
      width: 100%;
    }
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 ${({ theme }) => theme.space[6]};
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: all 0.2s ease-in-out;
  padding-left: ${({ theme }) => theme.space[10]};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.space[4]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textTertiary};
  pointer-events: none;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  cursor: pointer;
  padding: ${({ theme }) => theme.space[2]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (prefers-color-scheme: dark) {
    &:hover {
      background: ${({ theme }) => theme.colors.gray700};
    }
  }
`;

const UploadButton = styled(Link)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  cursor: pointer;
  padding: ${({ theme }) => theme.space[2]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.space[4]};
  z-index: 90;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  
  ${({ isOpen }) => isOpen && `
    display: block;
  `}
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none !important;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => `${theme.space[3]} 0`};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    const searchInput = document.getElementById('search') as HTMLInputElement;
    if (searchInput && searchInput.value.trim()) {
      router.push(`/signin?q=${encodeURIComponent(searchInput.value.trim())}`);
    }
  };

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <LogoLink href="/">
            <span>StreamRich</span>
          </LogoLink>
          
          <Nav>
            <NavLink href="/content">Content</NavLink>
            <NavLink to="/trending">Trending</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/earn">Earn</NavLink>
          </Nav>
          
          <SearchContainer>
            <form onSubmit={handleSearch}>
              <SearchIcon>🔍</SearchIcon>
              <SearchInput 
                id="search"
                type="text" 
                placeholder="Search videos, music, and more..."
              />
            </form>
          </SearchContainer>
          
          <Actions>
            <ActionButton title="Upload" as={Link} to="/upload">
              <span role="img" aria-label="Upload">
                📤
              </span>
            </ActionButton>
            <ActionButton title="Notifications">
              <span role="img" aria-label="Notifications">
                🔔
              </span>
            </ActionButton>
            <ActionButton title="Messages">
              <span role="img" aria-label="Messages">
                💬
              </span>
            </ActionButton>
            <UserAvatar title="My Profile" onClick={() => router.push('/profile')}>
              U
            </UserAvatar>
            <MobileMenuButton onClick={toggleMenu}>
              <span role="img" aria-label="Menu">
                {isMenuOpen ? '✕' : '☰'}
              </span>
            </MobileMenuButton>
          </Actions>
        </HeaderContent>
      </HeaderContainer>
      
      <MobileMenu isOpen={isMenuOpen}>
        <MobileNavLink to="/" onClick={toggleMenu}>Home</MobileNavLink>
        <MobileNavLink to="/trending" onClick={toggleMenu}>Trending</MobileNavLink>
        <MobileNavLink to="/categories" onClick={toggleMenu}>Categories</MobileNavLink>
        <MobileNavLink to="/earn" onClick={toggleMenu}>Earn</MobileNavLink>
        <MobileNavLink to="/upload" onClick={toggleMenu}>Upload</MobileNavLink>
        <MobileNavLink to="/profile/me" onClick={toggleMenu}>My Profile</MobileNavLink>
      </MobileMenu>
    </>
  );
};

export default Header;
