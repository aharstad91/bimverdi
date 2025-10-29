'use client';

import { useState, useEffect } from 'react';

interface AuthMethodResult {
  authenticated?: boolean;
  cookie_found?: boolean;
  token_found?: boolean;
  message?: string;
  [key: string]: any;
}

interface AuthTestResponse {
  timestamp: string;
  auth_methods: {
    wordpress_session: AuthMethodResult;
    iron_session: AuthMethodResult;
    jwt_token: AuthMethodResult;
  };
  debug: {
    available_cookies: string[];
    request_headers: {
      authorization: string;
      cookie: string;
    };
  };
}

export default function TestAuthPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuthTestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/test-auth');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to test auth');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">🔐 Authentication Test</h1>
        <p className="text-gray-600 mb-8">
          Phase 0.2: Testing iron-session with WordPress REST API
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <button
              onClick={testAuth}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '⏳ Testing...' : '🔄 Re-test'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-medium">❌ Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Timestamp */}
              <div className="text-sm text-gray-600">
                <strong>Timestamp:</strong> {result.timestamp}
              </div>

              {/* WordPress Session */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  {result.auth_methods.wordpress_session.authenticated ? '✅' : '❌'}
                  WordPress Session
                </h3>
                {result.auth_methods.wordpress_session.authenticated ? (
                  <div className="text-sm space-y-1">
                    <p><strong>User ID:</strong> {result.auth_methods.wordpress_session.user_id}</p>
                    <p><strong>Username:</strong> {result.auth_methods.wordpress_session.username}</p>
                    <p><strong>Email:</strong> {result.auth_methods.wordpress_session.email}</p>
                    <p><strong>Display Name:</strong> {result.auth_methods.wordpress_session.display_name}</p>
                    <p><strong>Roles:</strong> {result.auth_methods.wordpress_session.roles?.join(', ')}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">{result.auth_methods.wordpress_session.message}</p>
                )}
              </div>

              {/* iron-session */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  {result.auth_methods.iron_session.cookie_found ? '✅' : '❌'}
                  iron-session Cookie
                </h3>
                {result.auth_methods.iron_session.cookie_found ? (
                  <div className="text-sm space-y-1">
                    <p><strong>Cookie Name:</strong> {result.auth_methods.iron_session.cookie_name}</p>
                    <p><strong>Cookie Length:</strong> {result.auth_methods.iron_session.cookie_length} characters</p>
                    <p className="text-amber-600 mt-2">{result.auth_methods.iron_session.note}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    <p>{result.auth_methods.iron_session.message}</p>
                    <p className="mt-1 text-xs">Expected: {result.auth_methods.iron_session.expected_cookie_name}</p>
                  </div>
                )}
              </div>

              {/* JWT Token */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  {result.auth_methods.jwt_token.authenticated ? '✅' : '❌'}
                  JWT Token
                </h3>
                {result.auth_methods.jwt_token.authenticated ? (
                  <div className="text-sm space-y-1">
                    <p><strong>User ID:</strong> {result.auth_methods.jwt_token.user_id}</p>
                  </div>
                ) : result.auth_methods.jwt_token.token_found ? (
                  <p className="text-sm text-amber-600">{result.auth_methods.jwt_token.note}</p>
                ) : (
                  <p className="text-sm text-gray-600">{result.auth_methods.jwt_token.message}</p>
                )}
              </div>

              {/* Debug Info */}
              <details className="border rounded-lg p-4">
                <summary className="font-semibold cursor-pointer">🐛 Debug Info</summary>
                <div className="mt-3 text-sm space-y-2">
                  <div>
                    <strong>Available Cookies:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                      {JSON.stringify(result.debug.available_cookies, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <strong>Request Headers:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                      {JSON.stringify(result.debug.request_headers, null, 2)}
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Test Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Testing Instructions:</h3>
          <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
            <li>Test 1: Run test while logged OUT → Should see all ❌</li>
            <li>Test 2: Login at <code className="bg-blue-100 px-1 rounded">/logg-inn</code> → Return here</li>
            <li>Test 3: Run test while logged IN → Should see ✅ for iron-session</li>
            <li>Test 4: Check if WordPress can read user_id from session</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
