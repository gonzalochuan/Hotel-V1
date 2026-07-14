import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
      // If this mount is the OAuth popup itself (opened by signInWithGoogle
      // below) and it already has a session, close it right away.
      if (window.opener && data.session) window.close()
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)
      if (window.opener && event === 'SIGNED_IN') window.close()
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    // Use a popup instead of a full-page redirect so the checkout form's
    // in-progress state survives sign-in — a full redirect would reload
    // the app and lose it.
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin, skipBrowserRedirect: true },
    })
    if (error || !data.url) return

    const width = 480
    const height = 640
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const popup = window.open(data.url, 'oauth-popup', `width=${width},height=${height},left=${left},top=${top}`)

    if (!popup) {
      // Popup blocked — fall back to a full redirect.
      window.location.href = data.url
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, loading, signInWithGoogle, signOut }),
    [session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
