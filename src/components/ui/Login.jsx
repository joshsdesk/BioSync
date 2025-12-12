import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
 import Input from'./Input';
 import Button from'./Button';
 import Icon from'../AppIcon';

const Login = ({ onToggleMode }) => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email?.trim() || !formData.password?.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await signIn(formData.email.trim(), formData.password)
      
      if (error) {
        if (error?.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.')
        } else if (error?.message?.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.')
        } else if (error?.message?.includes('Failed to fetch') || 
                   error?.message?.includes('AuthRetryableFetchError')) {
          setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        } else {
          setError(error.message || 'Failed to sign in. Please try again.')
        }
        return
      }

      if (data?.user) {
        navigate('/dashboard')
      }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
      } else {
        setError('Something went wrong. Please try again.')
        console.error('Login error:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoType) => {
    const demoCredentials = {
      admin: { email: 'admin@sportsanalyzer.com', password: 'admin123' },
      coach: { email: 'coach@sportsanalyzer.com', password: 'coach123' },
      athlete: { email: 'athlete@sportsanalyzer.com', password: 'athlete123' }
    }

    const credentials = demoCredentials[demoType]
    if (!credentials) return

    setFormData(credentials)
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await signIn(credentials.email, credentials.password)
      
      if (error) {
        setError('Demo login failed. Please try manual login.')
        return
      }

      if (data?.user) {
        navigate('/dashboard')
      }
    } catch (error) {
      setError('Demo login failed. Please try manual login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
        <p className="text-muted-foreground">Sign in to access your sports analysis dashboard</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          iconName={loading ? "Loader2" : "LogIn"}
          iconPosition="left"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      {/* Demo Credentials Section */}
      <div className="mt-8 p-4 bg-muted/30 border border-muted-foreground/20 rounded-lg">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">Demo Accounts</h3>
          <p className="text-xs text-muted-foreground">Try the platform with these test accounts</p>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-background/50 rounded border">
            <div>
              <span className="font-medium text-foreground">Admin:</span>
              <span className="ml-2 text-muted-foreground">admin@sportsanalyzer.com / admin123</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="text-xs h-6 px-2"
            >
              Use
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-background/50 rounded border">
            <div>
              <span className="font-medium text-foreground">Coach:</span>
              <span className="ml-2 text-muted-foreground">coach@sportsanalyzer.com / coach123</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDemoLogin('coach')}
              disabled={loading}
              className="text-xs h-6 px-2"
            >
              Use
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-background/50 rounded border">
            <div>
              <span className="font-medium text-foreground">Athlete:</span>
              <span className="ml-2 text-muted-foreground">athlete@sportsanalyzer.com / athlete123</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDemoLogin('athlete')}
              disabled={loading}
              className="text-xs h-6 px-2"
            >
              Use
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-3">
          Click "Use" to automatically fill and login with demo credentials
        </p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-primary hover:text-primary/80 font-medium"
            disabled={loading}
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login