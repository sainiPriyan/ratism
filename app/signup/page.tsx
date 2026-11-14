
'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const supabase = createClient()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const cleanUsername = username.trim().toLowerCase()

    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      setError(
        'Username must be 3–20 characters and contain only letters, numbers or underscores.'
      )
      return
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
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

      const { error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: cleanUsername,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      })

      if (signupError) throw signupError

      setSuccess(true)
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

  async function handleGoogleSignup() {
    setError('')
    setGoogleLoading(true)

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
          : 'Google sign-up failed. Please try again.'
      )
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <main className="auth-page">
        <section className="auth-panel mx-auto text-center" aria-live="polite">
          <p className="auth-eyebrow mb-4">
            ALMOST THERE
          </p>

          <h1 className="auth-panel-title">
            CHECK YOUR EMAIL.
          </h1>

          <p className="auth-panel-copy mb-8">
            We've sent a verification link to{' '}
            <strong>{email}</strong>. Click the link to activate
            your Ratism account.
          </p>

          <Link
            href="/login"
            className="auth-text-link"
          >
            Back to login
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <aside className="auth-aside" aria-label="About Ratism">
          <p className="auth-index">RATISM / 01</p>
          <h2>Make room for <em>curiosity.</em></h2>
          <p className="auth-aside-copy">A small corner of the internet for thoughtful ideas and the people who follow them.</p>
          <p className="auth-aside-note">A LITTLE SPACE TO THINK</p>
        </aside>
        <section className="auth-panel">
        <p className="auth-eyebrow">ACCOUNT / 01</p>
        <h1 className="auth-panel-title">JOIN THE BURROW.</h1>

        <p className="auth-panel-copy">
          Make a little corner for yourself. Bring your curiosity.
        </p>

        <form onSubmit={handleSignup} className="auth-form auth-signup-form">
          <div className="auth-field">
            <label htmlFor="signup-username" className="block text-xs mb-2 text-[var(--muted)]">
              USERNAME
            </label>

            <input
              id="signup-username"
              required
              minLength={3}
              maxLength={20}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email" className="block text-xs mb-2 text-[var(--muted)]">
              EMAIL ADDRESS
            </label>

            <input
              id="signup-email"
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-password" className="block text-xs mb-2 text-[var(--muted)]">
              PASSWORD
            </label>

            <div className="auth-password-wrap">
              <input
                id="signup-password"
                required
                type={showPassword ? 'text' : 'password'}
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                aria-label="Password"
                className="auth-input"
              />
              <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="signup-confirm-password" className="block text-xs mb-2 text-[var(--muted)]">
              CONFIRM PASSWORD
            </label>

            <div className="auth-password-wrap">
              <input
                id="signup-confirm-password"
                required
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your password again"
                aria-label="Confirm password"
                className="auth-input"
              />
              <button type="button" className="auth-password-toggle" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} aria-pressed={showConfirmPassword}>
                {showConfirmPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          {error && (
            <p className="auth-feedback" role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="auth-button"
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="auth-divider" aria-hidden="true">OR</div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading || googleLoading}
          className="auth-button auth-button-secondary"
        >
          {googleLoading ? (
            'CONNECTING TO GOOGLE...'
          ) : (
            <>
              <svg
                viewBox="0 0 48 48"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.27 5.64c4.25-3.92 7.52-9.72 7.52-17.29Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.27-5.64c-2.02 1.35-4.61 2.15-8.64 2.15-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
                />
              </svg>

              CONTINUE WITH GOOGLE
            </>
          )}
        </button>

        <p className="auth-footnote">
          Already have an account?{' '}
          <Link
            href="/login"
            className="auth-text-link"
          >
            Log in
          </Link>
        </p>
        </section>
      </div>
    </main>
  )
}
