import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui';

const Auth = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'otp'>('login');
  const [email, setEmail] = useState('demo@health360.com');
  const [password, setPassword] = useState('sdfasfdkahflaksjhdfaksjdfhalskjdhfalskjfhaslkfjhaslkfdhjalskdfjhalskdfhjalskdjfh');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState({
    newsletter: true,
    reminders: false,
    offers: true
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'login') {
      setIsLoading(true);
      try {
        const success = await login(email, password);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Invalid email or password');
        }
      } catch (err) {
        setError('Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (mode === 'register') {
      setMode('otp');
    } else if (mode === 'otp') {
      // Simulate successful verification and auto-login
      setIsLoading(true);
      try {
        const success = await login(email, password);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Account creation failed. Please try again.');
        }
      } catch (err) {
        setError('Account creation failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Page 
      title={mode === 'login' ? 'Welcome Back' : 'Join Health360'}
      subtitle={
        mode === 'login' 
          ? 'Sign in to access your health dashboard and track your progress'
          : 'Create your account to save recommendations and track your health journey'
      }
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Card className="w-full sm:max-w-md mx-auto lg:mx-0">
            <CardHeader>
              <CardTitle>
                {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Verify Your Email'}
              </CardTitle>
              {mode === 'otp' && (
                <CardDescription>
                  We've sent a 6-digit verification code to <strong>{email}</strong>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {(mode === 'login' || mode === 'register') && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="demo@health360.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="demo123"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}

                {mode === 'otp' && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                        Verification Code
                      </label>
                      <Input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter any 6 digits (e.g., 123456)"
                        maxLength={6}
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-700">Communication Preferences</h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={preferences.newsletter}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev, newsletter: e.target.checked
                            }))}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Health newsletter and tips</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={preferences.reminders}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev, reminders: e.target.checked
                            }))}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Test and appointment reminders</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={preferences.offers}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev, offers: e.target.checked
                            }))}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Special offers and member discounts</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading 
                    ? (mode === 'login' ? 'Signing In...' : 'Processing...')
                    : (mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Verify & Complete Setup')
                  }
                </Button>
              </form>

              {mode !== 'otp' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Demo:</strong> Enter any email and password to {mode === 'login' ? 'sign in' : 'create an account'}
                  </p>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')} 
                    className="text-purple-600 hover:text-purple-700 font-medium"
                    disabled={isLoading}
                  >
                    {mode === 'login' ? 'Create Account' : 'Sign In'}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Member Benefits</CardTitle>
                <CardDescription>Join Health360 and unlock exclusive features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">💾</div>
                    <div>
                      <h4 className="font-medium text-gray-900">Save Your Progress</h4>
                      <p className="text-sm text-gray-600">Keep track of your health assessments and recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <h4 className="font-medium text-gray-900">Track Lab Results</h4>
                      <p className="text-sm text-gray-600">Monitor your testosterone and health metrics over time</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">💰</div>
                    <div>
                      <h4 className="font-medium text-gray-900">Member Pricing</h4>
                      <p className="text-sm text-gray-600">Save 15-25% on supplements and lab tests</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🔬</div>
                    <div>
                      <h4 className="font-medium text-gray-900">Priority Booking</h4>
                      <p className="text-sm text-gray-600">Get faster access to lab appointments and consultations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link to="/recommendations">
              Continue as Guest
            </Link>
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default Auth;
