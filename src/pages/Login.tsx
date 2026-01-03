import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, Shield, Users } from 'lucide-react';
import authBg from '@/assets/auth-bg.jpg';

type AuthMode = 'login' | 'signup';
type RoleType = 'HR' | 'EMPLOYEE';

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType>('EMPLOYEE');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, isAuthenticated, userRole, isFirstLogin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (isFirstLogin) {
        navigate('/change-password');
      } else {
        const redirectPath = userRole === 'HR' ? '/hr/dashboard' : '/employee/dashboard';
        navigate(redirectPath);
      }
    }
  }, [isAuthenticated, userRole, isFirstLogin, navigate]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setCompany('');
    setPhone('');
    setSelectedRole('EMPLOYEE');
    setError('');
    setSuccess('');
  };

  const toggleMode = () => {
    resetForm();
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    // Navigation is handled by the useEffect

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    const result = await signup({ name, email, password, company, phone, role: selectedRole });

    if (!result.success) {
      setError(result.error || 'Signup failed');
    }
    // Navigation is handled by the useEffect

    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src={authBg} 
          alt="Office workspace" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
        
        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center">
              <span className="text-foreground font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-semibold text-background">Dayflow</span>
          </div>
          
          {/* Quote */}
          <div className="max-w-md">
            <blockquote className="text-2xl font-medium text-background leading-relaxed mb-4">
              "Every workday, perfectly aligned."
            </blockquote>
            <p className="text-background/80">
              Streamline your HR operations with our intuitive workforce management platform.
            </p>
          </div>
          
          {/* Features */}
          <div className="flex gap-8">
            <div className="text-background/90">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-background/70">Companies trust us</p>
            </div>
            <div className="text-background/90">
              <p className="text-3xl font-bold">50k+</p>
              <p className="text-sm text-background/70">Active users</p>
            </div>
            <div className="text-background/90">
              <p className="text-3xl font-bold">99.9%</p>
              <p className="text-sm text-background/70">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
              <span className="text-primary-foreground font-bold text-xl">D</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Dayflow</h1>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-muted-foreground">
              {mode === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Get started with your free account today'}
            </p>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Signup Fields */}
            {mode === 'signup' && (
              <>
                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('HR')}
                      disabled={isLoading}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedRole === 'HR'
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                    >
                      <Shield className="w-6 h-6" />
                      <span className="font-medium text-sm">Admin / HR</span>
                      <span className="text-xs opacity-70">Full access</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('EMPLOYEE')}
                      disabled={isLoading}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedRole === 'EMPLOYEE'
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                    >
                      <Users className="w-6 h-6" />
                      <span className="font-medium text-sm">Employee</span>
                      <span className="text-xs opacity-70">Limited access</span>
                    </button>
                  </div>
                </div>

                {/* Company Field */}
                <div className="space-y-2">
                  <label htmlFor="company" className="block text-sm font-medium text-foreground">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Acme Inc."
                    className="input-field"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Smith"
                    className="input-field"
                    required
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                {mode === 'login' ? 'Email address' : 'Email'}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-field"
                required
                disabled={isLoading}
              />
            </div>

            {/* Phone Field - Signup Only */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="input-field"
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                {mode === 'login' && (
                  <button type="button" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field - Signup Only */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-primary flex items-center justify-center gap-2 h-12 rounded-xl" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading 
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...') 
                : (mode === 'login' ? 'Sign in' : 'Create account')
              }
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-foreground font-medium hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Terms - Only on signup */}
          {mode === 'signup' && (
            <p className="mt-6 text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{' '}
              <button type="button" className="underline hover:text-foreground">Terms of Service</button>
              {' '}and{' '}
              <button type="button" className="underline hover:text-foreground">Privacy Policy</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}