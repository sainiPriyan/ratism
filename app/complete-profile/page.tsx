
'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CompleteProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function checkProfile() {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser()

      if (authError || !user) {
        router.replace('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.username) {
        router.replace('/')
        return
      }

      setChecking(false)
    }

    checkProfile()
  }, [router, supabase])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const cleanUsername = username.trim().toLowerCase()

    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      setError(
        'Username must be 3–20 characters and contain only letters, numbers or underscores.'
      )
      return
    }

    setLoading(true)

    try {
      const { data: available, error: checkError } =
        await supabase.rpc('is_username_available', {
          desired_username: cleanUsername,
        })

      if (checkError) throw checkError

      if (!available) {
        setError('This username is already taken.')
        return
      }

      const { data: { user }, error: authError } =
        await supabase.auth.getUser()

      if (authError || !user) {
        router.replace('/login')
        return
      }

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: cleanUsername,
        })

      if (insertError) throw insertError

      router.replace('/')
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="min-h-[75vh] flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">
          PREPARING YOUR BURROW...
        </p>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <aside className="auth-aside" aria-label="About Ratism">
          <p className="auth-index">RATISM / 03</p>
          <h2>Find your name in the <em>burrow.</em></h2>
          <p className="auth-aside-copy">A username is the last little detail before your Ratism profile is ready.</p>
          <p className="auth-aside-note">ONE LAST THING</p>
        </aside>
        <section className="auth-panel">
        <p className="auth-eyebrow">PROFILE SETUP</p>
        <h1 className="auth-panel-title">CLAIM YOUR CORNER.</h1>

        <p className="auth-panel-copy">
          Choose a username to finish setting up your Ratism profile and make this corner yours.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="profile-username" className="block text-xs mb-2 text-[var(--muted)]">
              USERNAME
            </label>

            <input
              id="profile-username"
              required
              minLength={3}
              maxLength={20}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              className="auth-input"
            />

            <p className="text-xs text-[var(--muted)] mt-2">
              Choose 3–20 characters using letters, numbers or underscores.
            </p>
          </div>

          {error && (
            <p className="auth-feedback" role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'CREATING PROFILE...' : 'COMPLETE PROFILE'}
          </button>
        </form>
        </section>
      </div>
    </main>
  )
}
