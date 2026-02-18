import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Handles the OAuth callback from Supabase Google Auth.
 * Supabase appends tokens to the URL hash after authentication.
 */
export default function AuthCallbackPage() {
  const { login, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase returns tokens in the URL hash
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token) {
        const session = {
          access_token,
          refresh_token,
          expires_at: params.get('expires_at'),
        };

        // Store session so API calls can use the token
        login({ email: 'Loading...' }, session);
        localStorage.setItem('session', JSON.stringify(session));

        // Fetch profile & set needsProfileCompletion flag in AuthContext
        await refreshProfile();

        // Navigate to dashboard — ProtectedRoute will auto-redirect
        // to /complete-profile if phone/college are missing
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    };

    handleCallback();
  }, [login, navigate, refreshProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
}
