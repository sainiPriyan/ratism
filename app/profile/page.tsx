
'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { UserRound, LogOut, Save, ArrowLeft } from 'lucide-react'

type Profile = {
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    async function loadProfile() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.replace('/login')
        return
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('username, full_name, bio, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      if (!active) return

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      if (!data) {
        router.replace('/complete-profile')
        return
      }

      setProfile(data)
      setUsername(data.username)
      setFullName(data.full_name ?? '')
      setBio(data.bio ?? '')
      setEmail(user.email ?? '')
      setLoading(false)
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [router, supabase])

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!profile) return

    const cleanUsername = username.trim().toLowerCase()
    const cleanFullName = fullName.trim()
    const cleanBio = bio.trim()

    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      setError(
        'Username must be 3–20 characters and contain only letters, numbers or underscores.'
      )
      return
    }

    if (cleanFullName.length > 60) {
      setError('Full name cannot exceed 60 characters.')
      return
    }

    if (cleanBio.length > 250) {
      setError('Bio cannot exceed 250 characters.')
      return
    }

    setSaving(true)

    try {
      if (cleanUsername !== profile.username.toLowerCase()) {
        const { data: available, error: checkError } =
          await supabase.rpc('is_username_available', {
            desired_username: cleanUsername,
          })

        if (checkError) throw checkError

        if (!available) {
          setError('This username is already taken.')
          return
        }
      }

      const { data: { user }, error: authError } =
        await supabase.auth.getUser()

      if (authError || !user) {
        router.replace('/login')
        return
      }

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          username: cleanUsername,
          full_name: cleanFullName || null,
          bio: cleanBio || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select('username, full_name, bio, avatar_url')
        .single()

      if (updateError) throw updateError

      setProfile(data)
      setUsername(data.username)
      setFullName(data.full_name ?? '')
      setBio(data.bio ?? '')
      setEditing(false)
      setMessage('Your profile has been updated.')

      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not update your profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    setError('')

    const { error: signOutError } = await supabase.auth.signOut()

    if (signOutError) {
      setError(signOutError.message)
      setSigningOut(false)
      return
    }

    router.replace('/')
    router.refresh()
  }

  if (loading) {
    return (
      <main className="min-h-[75vh] flex items-center justify-center px-6">
        <p className="text-xs tracking-[0.2em] text-[var(--muted)]">
          ENTERING THE BURROW...
        </p>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-[75vh] flex items-center justify-center px-6">
        <p className="text-sm text-red-500">
          {error || 'Unable to load your profile.'}
        </p>
      </main>
    )
  }

  return (
    <main className="section min-h-[75vh]">
      <div className="max-w-4xl mx-auto">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          BACK TO RATISM
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12">

          <div className="w-24 h-24 rounded-full border border-[var(--border)] overflow-hidden flex items-center justify-center bg-[var(--surface)] shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profile picture"
                width={96}
                height={96}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound
                size={38}
                className="text-[var(--accent)]"
              />
            )}
          </div>

          <div className="flex-1">
            <p className="text-xs tracking-[0.2em] text-[var(--accent)] mb-2">
              YOUR CORNER OF THE BURROW
            </p>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              {profile.full_name || profile.username}
            </h1>

            <p className="text-sm text-[var(--muted)] mt-2">
              @{profile.username}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center justify-center gap-2 border border-[var(--border)] px-5 py-3 text-xs font-semibold tracking-wider hover:border-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            <LogOut size={15} />
            {signingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
          </button>
        </div>

        <div className="border-t border-[var(--border)] pt-8">

          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold">
                PROFILE DETAILS
              </h2>
              <p className="text-xs text-[var(--muted)] mt-2">
                Manage your identity in the Ratism community.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setMessage('')
                  setEditing(true)
                }}
                className="text-xs font-semibold tracking-wider text-[var(--accent)] hover:opacity-70"
              >
                EDIT PROFILE ↗
              </button>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="text-sm text-red-500 mb-6"
            >
              {error}
            </p>
          )}

          {message && (
            <p className="text-sm text-[var(--accent)] mb-6">
              {message}
            </p>
          )}

          <form onSubmit={handleSave} className="space-y-6">

            <div>
              <label className="block text-xs tracking-wider text-[var(--muted)] mb-2">
                USERNAME
              </label>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!editing}
                maxLength={20}
                className="w-full bg-transparent border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-xs tracking-wider text-[var(--muted)] mb-2">
                FULL NAME
              </label>

              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!editing}
                maxLength={60}
                placeholder="Your name"
                className="w-full bg-transparent border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-xs tracking-wider text-[var(--muted)] mb-2">
                EMAIL ADDRESS
              </label>

              <input
                value={email}
                disabled
                className="w-full bg-transparent border border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)] opacity-70"
              />

              <p className="text-xs text-[var(--muted)] mt-2">
                Email address is managed by your authentication provider.
              </p>
            </div>

            <div>
              <label className="block text-xs tracking-wider text-[var(--muted)] mb-2">
                BIO
              </label>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!editing}
                maxLength={250}
                rows={4}
                placeholder="A little about yourself..."
                className="w-full bg-transparent border border-[var(--border)] px-4 py-3 text-sm outline-none resize-none focus:border-[var(--accent)] disabled:opacity-70"
              />

              {editing && (
                <p className="text-xs text-[var(--muted)] text-right mt-2">
                  {bio.length}/250
                </p>
              )}
            </div>

            {editing && (
              <div className="flex flex-wrap gap-3 pt-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[var(--accent)] text-black px-6 py-3 text-xs font-bold tracking-wider hover:opacity-85 transition-opacity disabled:opacity-50"
                >
                  <Save size={15} />
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUsername(profile.username)
                    setFullName(profile.full_name ?? '')
                    setBio(profile.bio ?? '')
                    setEditing(false)
                    setError('')
                    setMessage('')
                  }}
                  className="border border-[var(--border)] px-6 py-3 text-xs font-semibold tracking-wider hover:border-[var(--accent)] transition-colors"
                >
                  CANCEL
                </button>

              </div>
            )}
          </form>
        </div>

        <div className="border-t border-[var(--border)] mt-12 pt-8">
          <p className="text-xs tracking-[0.2em] text-[var(--muted)] mb-4">
            YOUR NEXT ADVENTURE
          </p>

          <Link
            href="/experiments"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:opacity-70"
          >
            EXPLORE EXPERIMENTS
            <ArrowLeft size={14} className="rotate-180" />
          </Link>
        </div>

      </div>
    </main>
  )
}
