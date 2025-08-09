'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    displayName: ''
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
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
      
      if (data.avatar) setPreviewUrl(data.avatar);
      else if (data.image) setPreviewUrl(data.image);
      
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [session, router]);

  // Load profile on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !profile) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('displayName', formData.displayName);
      
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formDataToSend,
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update session
      await update({
        ...session,
        user: {
          ...session.user,
          name: formData.name,
          email: formData.email,
          image: updatedProfile.avatar || session.user?.image,
        },
      });
      
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">Failed to load profile.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Edit Profile' : 'Profile'}
              </h3>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium text-gray-900">Profile</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This information will be displayed publicly.
                  </p>
                </div>
                
                <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="Profile"
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-300">
                          <span className="text-xl font-medium text-gray-600">
                            {profile.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <div className="ml-4">
                        <label
                          htmlFor="avatar-upload"
                          className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          Change
                          <input
                            id="avatar-upload"
                            name="avatar"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="displayName"
                        id="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profile.displayName || 'Not set'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profile.name || 'Not set'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{profile.email || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                        {profile.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Type
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {profile.role}
                      </span>
                    </p>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form
                          if (profile) {
                            setFormData({
                              name: profile.name || '',
                              email: profile.email || '',
                              bio: profile.bio || '',
                              displayName: profile.displayName || ''
                            });
                            setPreviewUrl(profile.avatar || profile.image || '');
                            setAvatarFile(null);
                          }
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
