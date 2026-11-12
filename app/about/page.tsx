
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageFrame, SectionLabel } from '@/components/site'

export default function About() {
  return (
    <PageFrame>
      <section className="section !pt-16 md:!pt-20">
        <SectionLabel>A NOTE FROM THE WALLS</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start mt-6">

          {/* Left: Ratism manifesto */}
          <div className="order-2 md:order-1">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9] mb-12">
              WHAT IS
              <br />
              <em className="not-italic text-[var(--accent)]">
                RATISM?
              </em>
            </h1>

            <div className="text-[var(--muted)] text-sm md:text-base leading-relaxed space-y-5 text-justify">
            <br></br> 
            <br></br> 
              <p>
                Ratism is the ideology that even the lowest and most
                despised creatures have a purpose, as indeed, do we all.
              </p>
                <br></br> 
              <p>
                Rats are often considered among the filthiest of
                creatures. They live in filth and were associated with
                the spread of the Black Death, which claimed millions
                of human lives. But would we be better off without
                them? Far from it.
              </p>
                <br></br> 
              <p>
                Nature is a tangled web of interdependence.
              </p>
                <br></br> 
              <p>
                Every animal plays an important role in the ecosystem.
              </p>
                <br></br>
              <p>
                These rodents of remarkable intellect contribute
                profoundly to nature, from nutrient cycling and seed
                dispersal to soil aeration. Their ecological
                contributions simply cannot be disregarded!
              </p>
                <br></br> 
              <p>
                And then, of course, there is Remy, a remarkably
                gifted artist in the culinary arts.
              </p>
                <br></br> 
              <p>
                Ratism, therefore, is not merely an appreciation of
                rats. It is a recognition that worth and purpose do
                not belong exclusively to the privileged class of
                the beautiful, the celebrated, and the universally
                admired. In fact, everyone has a place in the grand
                design of existence.
              </p>
            </div>

            {/* Navigation links */}
            <div className="mt-10 p-6 border border-[var(--border)] bg-[var(--surface)]">
              <span className="block mb-5 text-xs tracking-wider text-[var(--accent)]">
                CHECK OUT THESE LINKS. OR DON'T. WE'RE NOT YOUR SUPERVISOR.
              </span>

              <div className="flex flex-wrap gap-x-6 gap-y-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm hover:text-[var(--accent)] transition-colors"
                >
                  Explore the burrow <ArrowUpRight size={15} />
                </Link>

                <Link
                  href="/journal"
                  className="inline-flex items-center gap-2 text-sm hover:text-[var(--accent)] transition-colors"
                >
                  Read the journal <ArrowUpRight size={15} />
                </Link>

                <Link
                  href="/games"
                  className="inline-flex items-center gap-2 text-sm hover:text-[var(--accent)] transition-colors"
                >
                  Play some games <ArrowUpRight size={15} />
                </Link>

                <Link
                  href="/memes"
                  className="inline-flex items-center gap-2 text-sm hover:text-[var(--accent)] transition-colors"
                >
                  Browse the memes <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Rat photograph */}
          <div className="order-1 md:order-2 md:sticky md:top-28">
            <Image
              src="/ratism.jpeg"
              alt="Two rats beneath a Mickey Mouse figure"
              width={600}
              height={800}
              priority
              className="w-full h-auto object-cover border border-[var(--border)]"
            />

            <span className="block mt-3 text-xs tracking-widest text-[var(--muted)]">
              THE ORIGINAL INSPIRATION.
            </span>
          </div>

        </div>
      </section>
    </PageFrame>
  )
}
