import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageFrame, SectionLabel } from '@/components/site'

export function PlaceholderPage({
  label,
  title,
  intro,
  symbol,
  links,
}: {
  label: string
  title: string
  intro: string
  symbol: string
  links?: { label: string; href: string }[]
}) {
  return (
    <PageFrame>
      <section className="placeholder-page section">
        <div className="placeholder-symbol" aria-hidden="true">
          {symbol}
        </div>

        <SectionLabel>{label}</SectionLabel>

        <h1>{title}</h1>
        <p>{intro}</p>

        <div className="empty-panel">
          <span>⌁</span>
          <strong>THIS ROOM IS STILL BEING FURNISHED.</strong>
          <small>
            Check back soon. Or don&apos;t. We&apos;re not your supervisor.
          </small>
        </div>

        {links && (
          <div className="page-links">
            {links.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label} <ArrowUpRight />
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageFrame>
  )
}