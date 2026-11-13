
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
    <main className="min-h-[75vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[0.2em] text-[var(--accent)] mb-4">
          ONE LAST THING
        </p>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          CLAIM YOUR NAME.
        </h1>

        <p className="text-sm text-[var(--muted)] mb-10">
          Choose a username to establish your identity in the Ratism community.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs mb-2 text-[var(--muted)]">
              USERNAME
            </label>

            <input
              required
              minLength={3}
              maxLength={20}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              className="w-full bg-transparent border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
            />

            <p className="text-xs text-[var(--muted)] mt-2">
              3–20 characters. Letters, numbers and underscores only.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] text-black font-semibold text-sm py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'CREATING PROFILE...' : 'COMPLETE PROFILE'}
          </button>
        </form>
      </div>
    </main>
  )
}
