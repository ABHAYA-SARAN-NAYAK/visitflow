import { useState } from 'react';
import { X, Mail, Phone, Chrome, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, setUser } = useStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    await new Promise(r => setTimeout(r, 1200));
    setUser({
      id: 'u1',
      name: form.name || 'Explorer',
      email: form.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.email}`,
      explorerPoints: 240,
      badges: [
        { id: 'b1', name: 'Early Bird', emoji: '🌅', description: 'Visited 3 places before 8 AM' },
        { id: 'b2', name: 'Crowd Dodger', emoji: '🥷', description: 'Visited 5 places at LOW crowd' },
      ],
      savedPlaces: [],
      totalCheckins: 12,
      joinedDate: new Date().toISOString(),
    });
    setIsLoading(false);
    closeAuthModal();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setUser({
      id: 'u1',
      name: 'Travel Explorer',
      email: 'explorer@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
      explorerPoints: 240,
      badges: [
        { id: 'b1', name: 'Early Bird', emoji: '🌅', description: 'Visited 3 places before 8 AM' },
      ],
      savedPlaces: [],
      totalCheckins: 8,
      joinedDate: new Date().toISOString(),
    });
    setIsLoading(false);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-accent to-accent/80 text-white text-center">
          <button onClick={closeAuthModal} className="absolute top-3 right-3 w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="font-display text-xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Join VISIT FLOW'}
          </h2>
          <p className="text-sm text-white/70 mt-1">
            {mode === 'login'
              ? 'Sign in to access your saved places & alerts'
              : 'Start exploring smarter with AI predictions'
            }
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-border rounded-xl hover:bg-bg-secondary transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-semibold">Continue with Google</span>
          </button>

          <div className="relative flex items-center">
            <div className="flex-1 border-t border-border" />
            <span className="mx-3 text-xs text-text-muted">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="input-field w-full text-sm"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="input-field w-full text-sm"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="input-field w-full text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-text-muted">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-accent font-semibold hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-accent font-semibold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
