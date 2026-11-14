
'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { GoogleAuthNudge } from '@/components/google-auth-nudge'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const supabase = createClient()

  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [nudgeVisible, setNudgeVisible] = useState(false)
  const [nudgeDismissed, setNudgeDismissed] = useState(false)

  function revealGoogleNudge() {
    if (!nudgeDismissed) setNudgeVisible(true)
  }

  function dismissGoogleNudge() {
    setNudgeDismissed(true)
    setNudgeVisible(false)
  }

  function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    revealGoogleNudge()
  }

  async function handleGoogleSignup() {
    dismissGoogleNudge()
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

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <aside className="auth-aside" aria-label="About Ratism">
          <p className="auth-index">RATISM / 01</p>
          <h2>Make room for <em>curiosity.</em></h2>
          <p className="auth-aside-note">A LITTLE SPACE TO THINK</p>
        </aside>
        <section className="auth-panel">
        <p className="auth-eyebrow">ACCOUNT / 01</p>
        <h1 className="auth-panel-title">JOIN THE BURROW.</h1>

        <p className="auth-panel-copy">
          Make a little corner for yourself. Bring your curiosity.
        </p>

        <form onSubmit={handleSignup} onInvalidCapture={revealGoogleNudge} noValidate className="auth-form auth-signup-form">
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
              onFocus={revealGoogleNudge}
              onClick={revealGoogleNudge}
              onChange={revealGoogleNudge}
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
              onFocus={revealGoogleNudge}
              onClick={revealGoogleNudge}
              onChange={revealGoogleNudge}
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
                onFocus={revealGoogleNudge}
                onClick={revealGoogleNudge}
                onChange={revealGoogleNudge}
                placeholder="At least 8 characters"
                aria-label="Password"
                className="auth-input"
              />
              <button type="button" className="auth-password-toggle" onClick={() => { revealGoogleNudge(); setShowPassword((visible) => !visible) }} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
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
                onFocus={revealGoogleNudge}
                onClick={revealGoogleNudge}
                onChange={revealGoogleNudge}
                placeholder="Enter your password again"
                aria-label="Confirm password"
                className="auth-input"
              />
              <button type="button" className="auth-password-toggle" onClick={() => { revealGoogleNudge(); setShowConfirmPassword((visible) => !visible) }} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} aria-pressed={showConfirmPassword}>
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
            onClick={revealGoogleNudge}
            disabled={googleLoading}
            className="auth-button"
          >
            CREATE ACCOUNT
          </button>
        </form>

        <div className="auth-divider" aria-hidden="true">OR</div>

        {nudgeVisible && <GoogleAuthNudge dismissible={false} />}

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={googleLoading}
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
