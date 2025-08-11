'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type FormData = {
  name: string;
  email: string;
  bio: string;
  displayName: string;
};

interface ProfileData {
  id: string;
  displayName: string;
  bio: string;
  avatar: string | null;
  points: number;
  totalEarned: number;
  availableCash: number;
  totalWithdrawn: number;
  role: string;
  name?: string;
  email?: string;
  image?: string | null;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    bio: '',
    displayName: ''
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Fetch profile data
  const fetchProfile = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      setProfile(data);
      
      setFormData({
        name: data.name || data.displayName || '',
        email: data.email || session.user?.email || '',
        bio: data.bio || '',
        displayName: data.displayName || data.name || ''
      });
      
      if (data.avatar) {
        setPreviewUrl(data.avatar);
      } else if (data.image) {
        setPreviewUrl(data.image);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchProfile();
    } else {
      router.push('/auth/signin');
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('displayName', formData.displayName);
      
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const response = await fetch('/api/user/profile', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update the session to reflect changes
      if (update) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: formData.name || session.user?.name || '',
            email: formData.email || session.user?.email || '',
            image: updatedProfile.avatar || session.user?.image || null,
          },
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">{error || 'Failed to load profile.'}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
              <Avatar className="w-full h-full">
                {previewUrl ? (
                  <AvatarImage src={previewUrl} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-4xl">
                    {profile.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{profile.displayName || profile.name || 'User'}</h1>
              <p className="text-gray-600">{profile.email}</p>
              {profile.bio && <p className="mt-2 text-gray-700">{profile.bio}</p>}
              
              <div className="mt-4">
                <Button onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Points</p>
              <p className="text-2xl font-bold">{profile.points || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Total Earned</p>
              <p className="text-2xl font-bold">${profile.totalEarned?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold">${profile.availableCash?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <Label>Profile Picture</Label>
                <div className="mt-2 flex items-center">
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar"
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700"
                  >
                    Change Photo
                  </label>
                  {previewUrl && (
                    <span className="ml-4 text-sm text-gray-500">
                      New photo selected
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form to original values
                    fetchProfile();
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Success/Error Messages */}
          {success && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
