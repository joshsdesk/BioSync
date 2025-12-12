import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
 import Header from'../../components/ui/Header';
 import Login from'../../components/ui/Login';
 import Signup from'../../components/ui/Signup';

const AuthPage = () => {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [mode, setMode] = useState('login') // 'login' or 'signup'

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
            <div className="w-full max-w-md">
              {mode === 'login' ? (
                <Login onToggleMode={toggleMode} />
              ) : (
                <Signup onToggleMode={toggleMode} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AuthPage