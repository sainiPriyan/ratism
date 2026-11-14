
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content text-center">

        <p className="text-xs tracking-[0.3em] text-[var(--accent)] mb-8">
          LOST IN THE BURROW
        </p>

        <h1 className="not-found-number">
          404<span className="text-[var(--accent)]">.</span>
        </h1>

        <div className="w-16 h-px bg-[var(--accent)] mx-auto my-8" />

        <h2 className="text-xl md:text-2xl font-bold mb-4 leading-[3]">
          WELL, THIS IS AWKWARD.
        </h2>

        <Link
          href="/"
          className="inline-flex items-center gap-0 bg-[var(--accent)] text-black px-7 py-3 text-xs font-bold tracking-widest hover:opacity-85 transition-opacity"
        >
          <span>BACK TO THE BURROW</span>
          <span aria-hidden="true">↗</span>
        </Link>

      </div>
    </main>
  )
}
