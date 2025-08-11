'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

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
  stats?: {
    totalStreams: number;
    totalEarnings: number;
    currentBalance: number;
    earningsByType: {
      music: number;
      video: number;
      other: number;
    };
    recentPayouts: Array<{
      id: string;
      amount: number;
      date: string;
      status: 'completed' | 'pending' | 'failed';
    }>;
  };
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
      console.log('Fetching profile data...');
      const response = await fetch('/api/user/profile', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Profile API error:', data);
        throw new Error(data.message || 'Failed to fetch profile');
      }
      
      console.log('Profile data received:', data);
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

  // Main content
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
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
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Streaming & Earning Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Total Streams</h3>
                    <p className="text-3xl font-bold">{profile.stats?.totalStreams.toLocaleString() || '0'}</p>
                    <p className="text-sm text-gray-500 mt-1">All-time streams</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Total Earnings</h3>
                    <p className="text-3xl font-bold">${profile.stats?.totalEarnings.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-gray-500 mt-1">Lifetime earnings</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Current Balance</h3>
                    <p className="text-3xl font-bold">${profile.stats?.currentBalance.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-gray-500 mt-1">Available for withdrawal</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Earnings by Content Type</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Music</span>
                        <span className="text-sm font-medium">
                          ${(profile.stats?.earningsByType?.music || 0).toFixed(2)}
                        </span>
                      </div>
                      <Progress 
                        value={((profile.stats?.earningsByType?.music || 0) / (profile.stats?.totalEarnings || 1)) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Video</span>
                        <span className="text-sm font-medium">
                          ${(profile.stats?.earningsByType?.video || 0).toFixed(2)}
                        </span>
                      </div>
                      <Progress 
                        value={((profile.stats?.earningsByType?.video || 0) / (profile.stats?.totalEarnings || 1)) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Other</span>
                        <span className="text-sm font-medium">
                          ${(profile.stats?.earningsByType?.other || 0).toFixed(2)}
                        </span>
                      </div>
                      <Progress 
                        value={((profile.stats?.earningsByType?.other || 0) / (profile.stats?.totalEarnings || 1)) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Recent Payouts</h3>
                  {profile.stats?.recentPayouts && profile.stats.recentPayouts.length > 0 ? (
                    <div className="overflow-hidden border rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {profile.stats.recentPayouts.map((payout) => (
                            <tr key={payout.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(payout.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${payout.amount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  payout.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : payout.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Icons.package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium">No payouts yet</h3>
                      <p className="mt-1 text-sm">Your payouts will appear here when available.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
