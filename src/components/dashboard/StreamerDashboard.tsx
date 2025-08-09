'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

type TabValue = 'music' | 'videos' | 'points' | 'withdraw';

export function StreamerDashboard() {
  const [activeTab, setActiveTab] = useState<TabValue>('music');
  const [points, setPoints] = useState(750);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock content data
  const musicContent = [
    { id: 1, title: 'Chill Vibes', artist: 'DJ StreamRich', duration: '3:45', points: 1 },
    { id: 2, title: 'Summer Beats', artist: 'Beats Master', duration: '4:12', points: 1 },
  ];

  const videoContent = [
    { id: 1, title: 'Morning Workout', creator: 'FitLife', duration: '12:30', points: 2 },
    { id: 2, title: 'Cooking Tutorial', creator: 'Chef Alex', duration: '8:45', points: 1 },
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          setPoints((p) => p + 1);
          return 0;
        }
        return prev + 5;
      });
    }, 1000);
  };

  const handleWithdraw = () => {
    if (points >= 1000) {
      alert(`Successfully cashed out $${(points / 200).toFixed(2)}!`);
      setPoints(0);
    } else {
      alert(`You need ${1000 - points} more points to cash out.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Streamer Dashboard</h2>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
          🎯 {points} Points (${(points / 200).toFixed(2)})
        </div>
      </div>

      <Tabs defaultValue="music" className="w-full" onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="music" className="flex items-center gap-2">
            <Icons.music className="h-4 w-4" /> Music
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Icons.video className="h-4 w-4" /> Videos
          </TabsTrigger>
          <TabsTrigger value="points" className="flex items-center gap-2">
            <Icons.star className="h-4 w-4" /> My Points
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center gap-2">
            <Icons.dollarSign className="h-4 w-4" /> Cash Out
          </TabsTrigger>
        </TabsList>

        <TabsContent value="music" className="space-y-4">
          <h3 className="text-lg font-semibold">Listen to Music</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {musicContent.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.artist} • {item.duration}</p>
                </CardHeader>
                <CardContent>
                  <button
                    onClick={handlePlay}
                    className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md flex items-center justify-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Icons.pause className="h-4 w-4" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Icons.play className="h-4 w-4" />
                        <span>Play for {item.points} point{item.points !== 1 ? 's' : ''}</span>
                      </>
                    )}
                  </button>
                  {isPlaying && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <h3 className="text-lg font-semibold">Watch Videos</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videoContent.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.creator} • {item.duration}</p>
                </CardHeader>
                <CardContent>
                  <button
                    onClick={handlePlay}
                    className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md flex items-center justify-center gap-2"
                  >
                    <Icons.play className="h-4 w-4" />
                    <span>Watch for {item.points} point{item.points !== 1 ? 's' : ''}</span>
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-center py-8">{points} Points</div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-primary h-4 rounded-full text-xs text-white flex items-center justify-center"
                  style={{ width: `${Math.min(100, (points / 1000) * 100)}%` }}
                >
                  {Math.min(100, Math.round((points / 1000) * 100))}%
                </div>
              </div>
              <p className="text-center text-muted-foreground">
                {points >= 1000 ? (
                  '🎉 You can cash out now!'
                ) : (
                  `Earn ${1000 - points} more points to cash out $5`
                )}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Earnings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                <div className="text-4xl font-bold">${(points / 200).toFixed(2)}</div>
                <p className="text-muted-foreground">Available to withdraw</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Points:</span>
                  <span className="font-medium">{points} points</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Rate:</span>
                  <span className="font-medium">1000 points = $5.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                  <span>Payout Amount:</span>
                  <span>${(points / 200).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={points < 1000}
                className={`w-full py-3 rounded-md font-medium ${
                  points >= 1000
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {points >= 1000 ? 'Cash Out Now' : `Need ${1000 - points} more points to cash out`}
              </button>

              <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-md">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Earn points by watching videos and listening to music</li>
                  <li>1000 points = $5.00</li>
                  <li>Minimum withdrawal: $5.00 (1000 points)</li>
                  <li>Payments are processed within 3-5 business days</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
