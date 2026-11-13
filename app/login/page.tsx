
'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (loginError) throw loginError

      router.replace('/')
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to log in. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
  setError('')
  setLoading(true)

  try {
    const { error: oauthError } =
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

    if (oauthError) throw oauthError
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Google login failed. Please try again.'
    )
    setLoading(false)
  }
}

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[0.2em] text-[var(--accent)] mb-4">
          WELCOME BACK
        </p>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          LOG IN.
        </h1>

        <p className="text-sm text-[var(--muted)] mb-10">
          Your corner of the burrow awaits.
        </p>

        {searchParams.get('error') === 'verification_failed' && (
          <p className="text-sm text-red-500 mb-5" role="alert">
            Your verification link is invalid or expired. Please try signing up again or request a new confirmation email.
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs mb-2 text-[var(--muted)]">
              EMAIL ADDRESS
            </label>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs mb-2 text-[var(--muted)]">
              PASSWORD
            </label>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full bg-transparent border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
            />
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
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </form>
        

        <div className="flex justify-between gap-4 text-sm mt-8">
          <Link
            href="/forgot-password"
            className="text-[var(--muted)] hover:text-[var(--accent)]"
          >
            Forgot password?
          </Link>

          <Link
            href="/signup"
            className="text-[var(--accent)] hover:underline"
          >
            Create account
          </Link>
        </div>

       <div className="relative my-7">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-[var(--border)]" />
  </div>

    <div className="relative flex justify-center text-xs">
        <span className="bg-[var(--background)] px-3 text-[var(--muted)]">
        OR
        </span>
    </div>
    </div>

    <button
    type="button"
    onClick={handleGoogleLogin}
    disabled={loading}
    className="w-full border border-[var(--border)] py-3 text-sm font-semibold hover:border-[var(--accent)] transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
    >
    <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.27 5.64c4.25-3.92 7.52-9.72 7.52-17.29Z"/>
        <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19Z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.27-5.64c-2.02 1.35-4.61 2.15-8.64 2.15-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"/>
    </svg>

    CONTINUE WITH GOOGLE
    </button>   

      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
