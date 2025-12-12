import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // MOCK USER DATA
  const MOCK_USER = {
    id: 'mock-user-123',
    email: 'guest@biosync.app',
    user_metadata: { full_name: 'Guest Coach' }
  }

  const MOCK_PROFILE = {
    id: 'mock-user-123',
    username: 'GuestCoach',
    full_name: 'Guest Coach',
    role: 'coach'
  }

  // Helper to check if we are in mock mode (supabase is null)
  const isMockMode = !supabase;

  // Separate async operations object to maintain auth callback synchronicity
  const profileOperations = {
    async load(userId) {
      if (!userId) return

      if (isMockMode) {
        setUserProfile(MOCK_PROFILE)
        return
      }

      setProfileLoading(true)
      try {
        const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()

        if (!error && data) {
          setUserProfile(data)
        }
      } catch (error) {
        console.error('Profile load error:', error)
      } finally {
        setProfileLoading(false)
      }
    },

    clear() {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }

  // Protected auth handlers - MUST remain synchronous
  const authStateHandlers = {
    // CRITICAL: This MUST remain synchronous
    onChange: (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      if (session?.user) {
        // Fire async operations separately - NO AWAIT
        profileOperations?.load(session?.user?.id)
      } else {
        profileOperations?.clear()
      }
    }
  }

  useEffect(() => {
    if (isMockMode) {
      console.warn("⚠️ MOCK MODE ACTIVE: Simulating logged-in user.");
      setUser(MOCK_USER)
      setUserProfile(MOCK_PROFILE)
      setLoading(false)
      return
    }

    // Get initial session
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      authStateHandlers?.onChange(null, session)
    })

    // Listen for auth changes - PROTECTED: Never modify this callback signature
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      authStateHandlers?.onChange
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Auth methods
  const signUp = async (email, password, metadata = {}) => {
    if (isMockMode) {
      return { data: { user: MOCK_USER }, error: null }
    }
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    if (isMockMode) {
      setUser(MOCK_USER)
      setUserProfile(MOCK_PROFILE)
      return { data: { user: MOCK_USER }, error: null }
    }
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    if (isMockMode) {
      setUser(null)
      setUserProfile(null)
      return { error: null }
    }
    try {
      const { error } = await supabase?.auth?.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    if (!user?.id) return { data: null, error: new Error('No user logged in') }

    if (isMockMode) {
      const newProfile = { ...userProfile, ...updates }
      setUserProfile(newProfile)
      return { data: newProfile, error: null }
    }

    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()

      if (!error && data) {
        setUserProfile(data)
      }

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider
export { AuthContext };