'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/icons';
import { FileUploader } from '@/components/admin/FileUploader';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
};

const StatCard = ({ title, value, icon, description, trend, trendValue }: StatCardProps) => {
  const trendColor = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-500 dark:text-gray-400',
  }[trend || 'neutral'];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
            {trendValue && <span className={`ml-1 ${trendColor}`}>{trendValue}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

type RecentActivity = {
  id: string;
  type: 'upload' | 'update' | 'user' | 'purchase';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
};

const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
  const iconMap = {
    upload: <Icons.upload className="h-4 w-4" />,
    update: <Icons.edit className="h-4 w-4" />,
    user: <Icons.user className="h-4 w-4" />,
    purchase: <Icons.shoppingCart className="h-4 w-4" />,
  };

  return (
    <div className="flex items-start space-x-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        {iconMap[activity.type]}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{activity.title}</p>
        <p className="text-sm text-muted-foreground">{activity.description}</p>
      </div>
      <div className="text-xs text-muted-foreground">
        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Check if user is admin
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    // In a real app, you would fetch this data from your API
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setRecentActivity([
        {
          id: '1',
          type: 'upload',
          title: 'New content uploaded',
          description: 'summer_mix_2023.mp4 was uploaded',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          user: { name: 'Alex Johnson' },
        },
        {
          id: '2',
          type: 'purchase',
          title: 'New purchase',
          description: 'Beat Pack #3 was purchased by user@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          user: { name: 'user@example.com' },
        },
        {
          id: '3',
          type: 'user',
          title: 'New user registered',
          description: 'djproducer joined the platform',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          user: { name: 'djproducer' },
        },
        {
          id: '4',
          type: 'update',
          title: 'Content updated',
          description: 'Summer Mix 2023 was updated',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
          user: { name: 'Alex Johnson' },
        },
      ]);
      
      setIsLoading(false);
    };

    fetchData();
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.loader className="mr-2 h-8 w-8 animate-spin" />
        <span>Loading admin dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || 'Admin'}
          </p>
        </div>
        <Button>
          <Icons.plus className="mr-2 h-4 w-4" />
          New Upload
        </Button>
      </div>

      <Tabs 
        defaultValue="overview" 
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value="1,234"
              icon={<Icons.users className="h-4 w-4" />}
              description="+20.1% from last month"
              trend="up"
              trendValue="+20.1%"
            />
            <StatCard
              title="Active Content"
              value="573"
              icon={<Icons.music className="h-4 w-4" />}
              description="+12.3% from last month"
              trend="up"
              trendValue="+12.3%"
            />
            <StatCard
              title="Monthly Revenue"
              value="$8,234.12"
              icon={<Icons.dollarSign className="h-4 w-4" />}
              description="+8.4% from last month"
              trend="up"
              trendValue="+8.4%"
            />
            <StatCard
              title="Pending Reviews"
              value="12"
              icon={<Icons.alertCircle className="h-4 w-4" />}
              description="-2 from yesterday"
              trend="down"
              trendValue="-2"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common admin tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Icons.plusCircle className="mr-2 h-4 w-4" />
                  Add New User
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icons.settings className="mr-2 h-4 w-4" />
                  Manage Roles
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icons.bell className="mr-2 h-4 w-4" />
                  View Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icons.fileText className="mr-2 h-4 w-4" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Content</CardTitle>
              <CardDescription>
                View and manage all content on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4 text-center text-muted-foreground">
                  Content management coming soon
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4 text-center text-muted-foreground">
                  User management coming soon
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View platform analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center rounded-md border">
                <div className="text-center">
                  <Icons.barChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">Analytics Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    View detailed analytics and insights about your platform
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <FileUploader />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Configure platform settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Platform Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure global platform settings and preferences
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h4 className="font-medium">Maintenance Mode</h4>
                        <p className="text-sm text-muted-foreground">
                          Take the platform offline for maintenance
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h4 className="font-medium">User Registration</h4>
                        <p className="text-sm text-muted-foreground">
                          Allow new users to create accounts
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h4 className="font-medium">Content Moderation</h4>
                        <p className="text-sm text-muted-foreground">
                          Enable content moderation for user uploads
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
