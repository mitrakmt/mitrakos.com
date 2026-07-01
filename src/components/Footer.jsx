import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/Container'
import { FadeIn } from '@/components/animations'

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="transition-colors duration-200 hover:text-teal-500 dark:hover:text-teal-400"
    >
      {children}
    </Link>
  )
}

const awardsProfileUrl = 'https://www.webdesignawards.io/nominees/mitrakos?ref=badge'

const awards = [
  {
    img: 'https://www.webdesignawards.io/badges/2025/winner_2025.webp',
    alt: 'Winner – Web Design Awards',
    title:
      'Awarded by Web Design Awards · Winner — view full award profile on Web Design Awards',
    heading: 'Awarded by Web Design Awards · Winner',
  },
  {
    img: 'https://www.webdesignawards.io/badges/2026/best_of_software-development_2026.webp',
    alt: 'Best of Software Development 2026 – Web Design Awards',
    title:
      'Recognized by Web Design Awards · Best of Software Development 2026 – Web Design Awards — view full award profile on Web Design Awards',
    heading: 'Recognized by Web Design Awards · Best of Software Development 2026',
  },
  {
    img: 'https://www.webdesignawards.io/badges/2026/best_of_portfolio_2026.webp',
    alt: 'Best of Portfolio 2026 – Web Design Awards',
    title:
      'Recognized by Web Design Awards · Best of Portfolio 2026 – Web Design Awards — view full award profile on Web Design Awards',
    heading: 'Recognized by Web Design Awards · Best of Portfolio 2026',
  },
  {
    img: 'https://www.webdesignawards.io/badges/2026/best_of_creative-studio_2026.webp',
    alt: 'Best of Creative Studio 2026 – Web Design Awards',
    title:
      'Recognized by Web Design Awards · Best of Creative Studio 2026 – Web Design Awards — view full award profile on Web Design Awards',
    heading: 'Recognized by Web Design Awards · Best of Creative Studio 2026',
  },
]

function Awards() {
  return (
    <div className="mb-10 border-b border-zinc-100 pb-10 dark:border-zinc-700/40">
      <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Recognition
      </h2>
      <ul
        role="list"
        className="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
      >
        {awards.map((award) => (
          <li key={award.img}>
            <a
              href={awardsProfileUrl}
              target="_blank"
              rel="noopener"
              title={award.title}
              className="group flex items-center gap-3 leading-tight text-zinc-800 no-underline transition-colors duration-200 hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-400"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={award.img}
                alt={award.alt}
                width={80}
                height={80}
                loading="lazy"
                className="h-16 w-16 flex-none transition-transform duration-200 group-hover:scale-105 sm:h-20 sm:w-20"
              />
              <span className="flex flex-col text-xs">
                <strong className="text-[13px] font-semibold">
                  {award.heading}
                </strong>
                <span className="text-zinc-400 dark:text-zinc-500">
                  webdesignawards.io
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <ContainerInner>
            <FadeIn direction="fade-up">
              <Awards />
              <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  <NavLink href="/about">About</NavLink>
                  <NavLink href="/projects">Projects</NavLink>
                  <NavLink href="/technology">Technology</NavLink>
                  <NavLink href="/initjs">initJS</NavLink>
                </div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  &copy; {new Date().getFullYear()} Michael Mitrakos. All rights
                  reserved.
                </p>
              </div>
            </FadeIn>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
