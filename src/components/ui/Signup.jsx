import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
 import Input from'./Input';
 import Button from'./Button';
 import Select from'./Select';
 import Icon from'../AppIcon';

const Signup = ({ onToggleMode }) => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'athlete'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const roleOptions = [
    { value: 'athlete', label: 'Athlete', description: 'Analyze your own performance' },
    { value: 'coach', label: 'Coach', description: 'Provide feedback to athletes' },
    { value: 'admin', label: 'Admin', description: 'Manage platform and users' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError(null)
  }

  const handleRoleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }))
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!formData.email?.trim()) {
      setError('Email is required')
      return false
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }

    if (!formData.password?.trim()) {
      setError('Password is required')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (!formData.fullName?.trim()) {
      setError('Full name is required')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data, error } = await signUp(
        formData.email.trim(),
        formData.password,
        {
          full_name: formData.fullName.trim(),
          role: formData.role
        }
      )
      
      if (error) {
        if (error?.message?.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.')
        } else if (error?.message?.includes('Password should be at least')) {
          setError('Password must be at least 6 characters long.')
        } else if (error?.message?.includes('Failed to fetch') || 
                   error?.message?.includes('AuthRetryableFetchError')) {
          setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        } else {
          setError(error.message || 'Failed to create account. Please try again.')
        }
        return
      }

      if (data?.user) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
      } else {
        setError('Something went wrong. Please try again.')
        console.error('Signup error:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Account Created!</h2>
          <p className="text-muted-foreground mb-4">
            Welcome to Sports Analyzer! You'll be redirected to your dashboard shortly.
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
        <p className="text-muted-foreground">Join Sports Analyzer to start improving your performance</p>
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
          type="text"
          name="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          required
          disabled={loading}
        />

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

        <Select
          label="Role"
          description="Choose your role on the platform"
          options={roleOptions}
          value={formData.role}
          onChange={handleRoleChange}
          disabled={loading}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password (min. 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          iconName={loading ? "Loader2" : "UserPlus"}
          iconPosition="left"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-primary hover:text-primary/80 font-medium"
            disabled={loading}
          >
            Sign in here
          </button>
        </p>
      </div>

      <div className="mt-6 p-4 bg-muted/30 border border-muted-foreground/20 rounded-lg">
        <h3 className="text-sm font-semibold text-foreground mb-2">Role Information</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p><strong>Athlete:</strong> Upload and analyze your training videos, track progress</p>
          <p><strong>Coach:</strong> Provide feedback to athletes, manage team analysis</p>
          <p><strong>Admin:</strong> Full platform access, user management capabilities</p>
        </div>
      </div>
    </div>
  )
}

export default Signup