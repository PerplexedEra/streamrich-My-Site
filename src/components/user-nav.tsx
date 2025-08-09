'use client';

import * as React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

// Simple avatar component since we don't have the UI components yet
const Avatar = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}>
    {children}
  </div>
);

const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
    {children}
  </span>
);

// Simple dropdown components since we don't have the UI components yet
const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DropdownMenuTrigger) {
          return React.cloneElement(child as React.ReactElement, { 
            onClick: () => setIsOpen(!isOpen) 
          });
        }
        return isOpen ? child : null;
      })}
    </div>
  );
};

const DropdownMenuTrigger = ({ children, ...props }: { 
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <div {...props}>
    {children}
  </div>
);

const DropdownMenuContent = ({ 
  children, 
  className = '',
  align = 'end' 
}: { 
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}) => (
  <div 
    className={`absolute mt-2 w-56 rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${className}`}
    style={{
      right: align === 'end' ? 0 : 'auto',
      left: align === 'start' ? 0 : 'auto',
    }}
  >
    {children}
  </div>
);

const DropdownMenuLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="px-2 py-1.5 text-sm font-semibold">
    {children}
  </div>
);

const DropdownMenuSeparator = () => (
  <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
);

const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="p-1">
    {children}
  </div>
);

const DropdownMenuItem = ({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
  >
    {children}
  </button>
);

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function UserNav() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const userInitial = session?.user?.name?.[0] || 'U';
  const userEmail = session?.user?.email || 'user@example.com';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{session?.user?.name || 'User'}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {userEmail}
            </span>
            {isAdmin && (
              <span className="mt-1 inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Admin
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="flex items-center">
              <Icons.user className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center">
                  <Icons.dashboard className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/upload" className="flex items-center">
                  <Icons.upload className="mr-2 h-4 w-4" />
                  <span>Upload Content</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center">
              <Icons.settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <Icons.logOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
