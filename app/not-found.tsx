
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl text-center">

        <p className="text-xs tracking-[0.3em] text-[var(--accent)] mb-8">
          LOST IN THE BURROW
        </p>

        <h1 className="text-[clamp(7rem,22vw,14rem)] leading-none font-black tracking-tighter">
          404<span className="text-[var(--accent)]">.</span>
        </h1>

        <div className="w-16 h-px bg-[var(--accent)] mx-auto my-8" />

        <h2 className="text-xl md:text-2xl font-bold mb-4">
          WELL, THIS IS AWKWARD.
        </h2>

        <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed max-w-md mx-auto mb-10">
          The page you're looking for seems to have wandered off.
          Even rats lose their way sometimes.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-3 bg-[var(--accent)] text-black px-7 py-3 text-xs font-bold tracking-widest hover:opacity-85 transition-opacity"
        >
          <span>BACK TO THE BURROW</span>
          <span aria-hidden="true">↗</span>
        </Link>

        <p className="text-[10px] tracking-[0.2em] text-[var(--muted)] mt-16 opacity-60">
          RATISM — NOTHING EXISTS WITHOUT PURPOSE.
        </p>

      </div>
    </main>
  )
}
