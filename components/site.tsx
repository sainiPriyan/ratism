'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X, UserRound } from 'lucide-react'
import { articles, jokes, memes } from '@/data/content'
import { createClient } from '@/lib/supabase/client'

const nav = [
  ['Games', '/games'],
  ['Memes', '/memes'],
  ['Journal', '/journal'],
  ['Experiments', '/experiments'],
]

export function Logo() {
return (
    <Link href="/" className="logo" aria-label="Ratism home">
      <Image
        src="/ratism-logo.png"
        alt="Ratism"
        width={42}
        height={42}
        className="logo-image"
      />
      <span>RATISM</span>
    </Link>
  )
}


export function Navbar() {
  const [open, setOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [supabase] = useState(() => createClient())

  useEffect(() => {
    let active = true

    async function updateAuth(userId: string | null) {
      if (!active) return

      setLoggedIn(!!userId)
      setAvatarUrl(null)

      if (!userId) return

      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .maybeSingle()

      if (active && data?.avatar_url) {
        setAvatarUrl(data.avatar_url)
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      updateAuth(data.user?.id ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateAuth(session?.user?.id ?? null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Logo />

        <nav
          className={`nav-links ${open ? 'is-open' : ''}`}
          aria-label="Primary navigation"
        >
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}

          <Link href="/about" onClick={() => setOpen(false)}>
            About
          </Link>
        </nav>

        <div className="nav-auth flex items-center gap-3">
          {loggedIn ? (
            <Link
              href="/profile"
              aria-label="Your profile"
              title="Your profile"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-colors overflow-hidden"
              onClick={() => setOpen(false)}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound
                  size={19}
                  className="text-[var(--accent)]"
                />
              )}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold tracking-wider text-[var(--muted)] hover:text-white transition-colors"
                onClick={() => setOpen(false)}
              >
                LOG IN
              </Link>

              <Link
                href="/signup"
                className="text-xs font-bold tracking-wider px-4 py-3 bg-[var(--accent)] text-black hover:opacity-85 transition-opacity"
                onClick={() => setOpen(false)}
              >
                SIGN UP
              </Link>
            </>
          )}
        </div>

        <button
          className="menu-button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}


export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Logo />
          <p className="footer-copy">
            An independent corner of the internet for games, ideas, memes and
            other suspicious activity.
          </p>
        </div>

        <div className="footer-links">
          <span>FIND US IN THE WALLS</span>
          <Link href="/about">About</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/experiments">Experiments</Link>
        </div>

        <div className="footer-rat" aria-hidden="true">
          🧀
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 RATISM. ALL RIGHTS RESERVED, PROBABLY.</span>
        <span>MADE IN THE BURROW. RELEASED INTO THE WILD.</span>
      </div>
    </footer>
  )
}

export function SectionLabel({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="section-label">
      <Image
        src="/section-icon.png"
        alt=""
        width={18}
        height={18}
        className="section-icon"
      />
      {children}
    </div>
  )
}
export function RatSvg({
  fed = false,
  petted = false,
}: {
  fed?: boolean
  petted?: boolean
}) {
  return (
    <div
      className={`rat-illustration ${fed ? 'rat-fed' : ''} ${petted ? 'rat-petted' : ''}`}
      aria-label="A small illustrated rat"
      role="img"
    >
      <div className="rat-ear rat-ear-one" />
      <div className="rat-ear rat-ear-two" />

      <div className="rat-head">
        <span className="rat-eye" />
        <span className="rat-eye rat-eye-two" />
        <span className="rat-nose" />
        <span className="rat-whisker w-one" />
        <span className="rat-whisker w-two" />
      </div>

      <div className="rat-body" />
      <div className="rat-tail" />
      <div className="rat-feet" />
    </div>
  )
}

export function ExploreSection() {
  const cards = [
    {
      title: 'GAMES',
      text: 'Small games. Questionable amounts of effort.',
      icon: '✣',
      href: '/games',
      className: 'explore-wide',
    },
    {
      title: 'MEMES',
      text: 'A carefully curated collection of internet nonsense.',
      icon: '▧',
      href: '/memes',
      className: '',
    },
    {
      title: 'JOURNAL',
      text: 'Thoughts, stories and things worth writing down.',
      icon: '▤',
      href: '/journal',
      className: '',
    },
    {
      title: 'EXPERIMENTS',
      text: 'Unnecessary projects. Interesting results.',
      icon: '⌁',
      href: '/experiments',
      className: 'explore-wide',
    },
  ]

  return (
    <section className="section explore-section">
      <div className="section-heading">
        <div>
          <SectionLabel>EXPLORE THE BURROW</SectionLabel>
          <h2>
            WHAT&apos;S HAPPENING
            <br />
            <em>IN THE BURROW?</em>
          </h2>
        </div>

        <p>
          There is always something
          <br />
          happening behind the walls.
        </p>
      </div>

      <div className="explore-grid">
        {cards.map((card) => (
          <Link
            href={card.href}
            key={card.title}
            className={`explore-card ${card.className}`}
          >
            <div className="card-icon">{card.icon}</div>

            <div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>

            <ArrowUpRight className="card-arrow" />
          </Link>
        ))}
      </div>
    </section>
  )
}

export function RatInteraction() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('the rat is waiting.')
  const [fed, setFed] = useState(false)
  const [petted, setPetted] = useState(false)

  const feedMessages = [
    'thank you, human.',
    'this is acceptable.',
    'you may pass.',
    'the council approves.',
    'more cheese.',
    'not enough cheese.',
    'i know what you did.',
  ]

  const petMessages = [
    '...nice.',
    'do that again.',
    'a gentle hand.',
    'the whiskers are pleased.',
  ]

  const feed = () => {
    setCount((value) => value + 1)
    setFed(true)
    setPetted(false)
    setMessage(feedMessages[count % feedMessages.length])

    setTimeout(() => setFed(false), 500)
  }

  const pet = () => {
    setPetted(true)
    setFed(false)
    setMessage(petMessages[count % petMessages.length])

    setTimeout(() => setPetted(false), 500)
  }

  return (
    <section className="rat-section section">
      <div className="rat-copy">
        <SectionLabel>A SMALL INTERNET EASTER EGG</SectionLabel>

        <h2>
          FEED
          <br />
          <em>THE RAT.</em>
        </h2>

        <p>
          It doesn&apos;t do much. That&apos;s sort of the point. Give it a snack
          and see what happens.
        </p>

        <div className="rat-score">
          <span>CHEESE ACQUIRED</span>
          <strong>{String(count).padStart(2, '0')}</strong>
        </div>
      </div>

      <div className="rat-enclosure">
        <div className="enclosure-label">
          <span>SPECIMEN 001</span>
          <span>
            MOOD: {fed ? 'PLEASED' : petted ? 'SOFT' : 'QUESTIONABLE'}
          </span>
        </div>

        <RatSvg fed={fed} petted={petted} />

        <div className="rat-message">
          &ldquo;{message}&rdquo;
        </div>

        <div className="rat-actions">
          <button className="button button-primary" onClick={feed}>
            FEED THE RAT
          </button>

          <button className="button button-ghost" onClick={pet}>
            PET THE RAT
          </button>
        </div>
      </div>
    </section>
  )
}

export function MemeArchive() {
  const [random, setRandom] = useState(0)

  return (
    <section className="section archive-section">
      <div className="section-heading">
        <div>
          <SectionLabel>THE COLLECTION</SectionLabel>
          <h2>
            THE RAT
            <br />
            <em>ARCHIVE.</em>
          </h2>
        </div>

        <div className="heading-side">
          <p>
            Important cultural contributions.
            <br />
            Probably.
          </p>

          <button
            className="text-button"
            onClick={() => setRandom((random + 1) % memes.length)}
          >
            ↗ RANDOM MEME
          </button>
        </div>
      </div>

      <div className="meme-grid">
        {memes.map((meme, i) => (
          <div
            className={`meme-slot ${meme.height} ${i === random ? 'meme-random' : ''}`}
            key={meme.id}
          >
            <div className="placeholder-mark">
              {i === random ? '✦' : '⌁'}
            </div>

            <span className="meme-tag">{meme.category}</span>
            <p>{meme.caption}</p>
            <small>{meme.id.toUpperCase()} / IMAGE SLOT</small>
          </div>
        ))}
      </div>

      <Link href="/memes" className="outline-link">
        VIEW THE ENTIRE ARCHIVE <ArrowUpRight />
      </Link>
    </section>
  )
}

export function DailyNonsense() {
  const [index, setIndex] = useState(0)

  return (
    <section className="daily-section">
      <div>
        <SectionLabel>THE DAILY NONSENSE</SectionLabel>
        <p className="daily-thought">&ldquo;{jokes[index]}&rdquo;</p>
      </div>

      <button
        className="button button-ghost"
        onClick={() => setIndex((index + 1) % jokes.length)}
      >
        GIVE ME ANOTHER <span>↗</span>
      </button>
    </section>
  )
}

export function JournalPreview() {
  return (
    <section className="section journal-section">
      <div className="section-heading">
        <div>
          <SectionLabel>RECENT TRANSMISSIONS</SectionLabel>
          <h2>
            FRESH FROM
            <br />
            <em>THE BURROW.</em>
          </h2>
        </div>

        <Link href="/journal" className="text-button">
          VIEW JOURNAL ↗
        </Link>
      </div>

      <div className="journal-grid">
        {articles.map((article) => (
          <article className="journal-card" key={article.title}>
            <div className={`article-art ${article.accent}`}>
              <span>R.</span>
              <i>○</i>
            </div>

            <div className="article-meta">
              <span>{article.category}</span>
              <span>{article.readTime}</span>
            </div>

            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <small>{article.date}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

export function PageFrame({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}