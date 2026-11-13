
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()

    if (error || !data?.claims) {
    redirect('/login')
    }

    const userId = data.claims.sub

  if (error || !userId) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, bio, avatar_url')
    .eq('id', userId.sub)
    .single()

  return (
    <main className="section min-h-[70vh]">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.2em] text-[var(--accent)] mb-4">
          YOUR SPACE
        </p>

        <h1 className="text-4xl md:text-6xl font-black mb-4">
          WELCOME BACK.
        </h1>

        <p className="text-[var(--muted)] mb-10">
          Welcome to your corner of the burrow,
          <span className="text-[var(--accent)]">
            {' '}@{profile?.username ?? 'user'}
          </span>.
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          <Link
            href="/experiments/new"
            className="border border-[var(--border)] p-7 hover:border-[var(--accent)] transition-colors"
          >
            <h2 className="text-xl font-bold mb-3">
              + CREATE EXPERIMENT
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Document a project, publish your findings and share your work.
            </p>
          </Link>

          <Link
            href={`/profile/${profile?.username}`}
            className="border border-[var(--border)] p-7 hover:border-[var(--accent)] transition-colors"
          >
            <h2 className="text-xl font-bold mb-3">
              YOUR PROFILE
            </h2>
            <p className="text-sm text-[var(--muted)]">
              View and manage your public identity on Ratism.
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}
