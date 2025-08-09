'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type UserRole = 'STREAMER' | 'CREATOR' | 'ADMIN';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      // If user has no role, redirect to role selection
      if (!session?.user?.role) {
        router.push('/onboarding/role-selection');
      } else {
        setIsLoading(false);
      }
    }
  }, [status, session, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const userRole = session?.user?.role as UserRole;

  // Render different dashboard content based on user role
  const renderDashboardContent = () => {
    switch (userRole) {
      case 'STREAMER':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Streamer Dashboard</h2>
            <p>Welcome back, Streamer! Here's what's happening with your account.</p>
            {/* Add streamer-specific content here */}
          </div>
        );
      case 'CREATOR':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Creator Dashboard</h2>
            <p>Welcome back, Creator! Manage your content and track your earnings.</p>
            {/* Add creator-specific content here */}
          </div>
        );
      case 'ADMIN':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
            <p>Welcome back, Admin! Manage the platform and view analytics.</p>
            {/* Add admin-specific content here */}
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
            <p>Your role is being processed. Please wait or contact support if this message persists.</p>
          </div>
        );
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
          {userRole || 'No Role'}
        </div>
      </div>
      
      {renderDashboardContent()}
      
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium mb-2">Quick Actions</h3>
          <ul className="space-y-2">
            <li><a href="/content" className="text-indigo-600 hover:underline">Browse Content</a></li>
            <li><a href="/dashboard/profile" className="text-indigo-600 hover:underline">View Profile</a></li>
            <li><a href="/settings" className="text-indigo-600 hover:underline">Account Settings</a></li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium mb-2">Recent Activity</h3>
          <p className="text-sm text-gray-500">No recent activity to show.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium mb-2">Account Status</h3>
          <div className="flex items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
