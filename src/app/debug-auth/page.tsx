'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const { data: session, status } = useSession();
  const [authStatus, setAuthStatus] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testSignIn = async () => {
    setIsLoading(true);
    setTestResult('Testing sign in...');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password',
      });
      
      if (result?.error) {
        setTestResult(`Error: ${result.error}`);
      } else {
        setTestResult('Sign in successful!');
      }
    } catch (error) {
      setTestResult(`Exception: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setAuthStatus(status);
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
        
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h2 className="text-lg font-semibold mb-2">Session Status</h2>
          <pre className="text-sm bg-black text-green-400 p-3 rounded overflow-x-auto">
            {JSON.stringify({
              status: authStatus,
              session: session ? {
                user: {
                  name: session.user?.name,
                  email: session.user?.email,
                  image: session.user?.image ? 'Image exists' : 'No image'
                },
                expires: session.expires
              } : 'No active session'
            }, null, 2)}
          </pre>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h2 className="text-lg font-semibold mb-2">Test Authentication</h2>
          <div className="space-y-4">
            <div>
              <button
                onClick={testSignIn}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isLoading ? 'Testing...' : 'Test Sign In'}
              </button>
              <button
                onClick={() => signOut()}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
            
            {testResult && (
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-700">{testResult}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">NEXTAUTH_URL:</span> {process.env.NEXTAUTH_URL || 'Not set'}</p>
            <p><span className="font-medium">NEXTAUTH_SECRET:</span> {process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}</p>
            <p><span className="font-medium">DATABASE_URL:</span> {process.env.DATABASE_URL ? 'Set' : 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
