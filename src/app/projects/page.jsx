import Image from 'next/image'
import Link from 'next/link'

import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerContainer, StaggerItem } from '@/components/animations'
import { pageMetadata } from '@/lib/site'
import logoHigglo from '@/images/logos/higglo_digital.jpg'
import logoInitjs from '@/images/logos/initjs.png'
import logoWanderlust from '@/images/logos/wanderlustapp.jpg'
import logoWebdesign from '@/images/logos/webdesignawards.avif'
import logonomads from '@/images/logos/nomads.png'
import logoenhl from '@/images/logos/enhl.png'
import logoOrthodoxChristianity101 from '@/images/logos/oc101.avif'
import shotPrintClubSociety from '@/images/projects/print-club-society.webp'
import shotVerdacert from '@/images/projects/verdacert.webp'
import shotHabeo from '@/images/projects/habeo.webp'
import shotCasework from '@/images/projects/casework.webp'
import shotHireaiscore from '@/images/projects/hireaiscore.webp'
import shotEliteHockeyHq from '@/images/projects/elite-hockey-hq.webp'
import shotAbaRank from '@/images/projects/aba-rank.webp'
import shotHigglo from '@/images/projects/higglo-digital.webp'
import shotWanderlust from '@/images/projects/wanderlust-app.webp'
import shotWebdesign from '@/images/projects/web-design-awards.webp'
import shotEnhl from '@/images/projects/enhl.webp'
import shotOrthodoxChristianity101 from '@/images/projects/orthodox-christianity-101.webp'
import shotInitjs from '@/images/projects/initjs.webp'

const projects = [
  {
    name: 'Print Club Society',
    description:
      'A curated directory of the world’s print clubs — riso studios, archival photography, and collectible editions in one library.',
    link: {
      href: 'https://www.printclubsociety.com',
      label: 'printclubsociety.com',
    },
    screenshot: shotPrintClubSociety,
    logo: null,
    logoColor:
      'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  },
  {
    name: 'Verdacert',
    description:
      'Certified document translation — Arabic, Farsi, Urdu and more, native-speaker reviewed and delivered in 24 hours.',
    link: { href: 'https://www.verdacert.com', label: 'verdacert.com' },
    screenshot: shotVerdacert,
    logo: null,
    logoColor:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  {
    name: 'Habeo',
    description:
      'The IT asset system of record for higher education — built to replace ServiceNow ITAM at universities.',
    link: { href: 'https://www.usehabeo.com', label: 'usehabeo.com' },
    screenshot: shotHabeo,
    logo: null,
    logoColor:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  {
    name: 'Casework',
    description:
      'EU AI Act conformity files, risk assessments, and Article 9 documentation for teams shipping hiring AI.',
    link: { href: 'https://www.getcasework.com', label: 'getcasework.com' },
    screenshot: shotCasework,
    logo: null,
    logoColor:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  },
  {
    name: 'HireAIScore',
    description:
      'Independent scoring of AI hiring vendors against the regulations they have to answer to. No paid placement.',
    link: { href: 'https://www.hireaiscore.com', label: 'hireaiscore.com' },
    screenshot: shotHireaiscore,
    logo: null,
    logoColor:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  {
    name: 'Elite Hockey HQ',
    description:
      '52-week periodized training programs, pro-built workouts, and daily readiness for hockey players.',
    link: { href: 'https://www.elitehockeyhq.com', label: 'elitehockeyhq.com' },
    screenshot: shotEliteHockeyHq,
    logo: null,
    logoColor:
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  },
  {
    name: 'ABA Rank',
    description:
      'The objective directory for Applied Behavior Analysis providers — ranked on disclosed inputs, never on ad spend.',
    link: { href: 'https://www.abarank.com', label: 'abarank.com' },
    screenshot: shotAbaRank,
    logo: null,
    logoColor:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  {
    name: 'Higglo Digital',
    description:
      'An integrated growth engine — SEO, GEO, CRO, and web — wired into one system for ABA and behavioral health.',
    link: { href: 'https://www.higglo.io', label: 'higglo.io' },
    screenshot: shotHigglo,
    logo: logoHigglo,
  },
  {
    name: 'Wanderlust App',
    description:
      'Plan a trip on real city data, live it offline on the ground, and turn it into something worth sharing.',
    link: { href: 'https://www.wanderlustapp.io', label: 'wanderlustapp.io' },
    screenshot: shotWanderlust,
    logo: logoWanderlust,
  },
  {
    name: 'Web Design Awards',
    description:
      'An editorially-curated index of the web’s best work, judged every cycle by working designers since 2014.',
    link: {
      href: 'https://www.webdesignawards.io',
      label: 'webdesignawards.io',
    },
    screenshot: shotWebdesign,
    logo: logoWebdesign,
  },
  {
    name: 'Nomads Ice Hockey',
    description: 'The first ice hockey team in Egypt.',
    link: {
      href: 'https://www.nomadsicehockey.com',
      label: 'nomadsicehockey.com',
    },
    // nomadsicehockey.com no longer resolves, so there is no live page to
    // capture — the card falls back to the logo lockup.
    screenshot: null,
    logo: logonomads,
  },
  {
    name: 'Egyptian Hockey League (EHL)',
    description: 'The first ice hockey league in Egypt.',
    link: {
      href: 'https://www.egyptianhockeyleague.com',
      label: 'egyptianhockeyleague.com',
    },
    screenshot: shotEnhl,
    logo: logoenhl,
  },
  {
    name: 'Orthodox Christianity 101',
    description: 'Teaching the basics of Orthodox Christianity for beginners.',
    link: {
      href: 'https://www.orthodoxchristianity101.com',
      label: 'orthodoxchristianity101.com',
    },
    screenshot: shotOrthodoxChristianity101,
    logo: logoOrthodoxChristianity101,
  },
  {
    name: 'InitJS',
    description: 'Teaching JavaScript to over 400,000 readers.',
    link: { href: 'https://www.initjs.org', label: 'initjs.org' },
    screenshot: shotInitjs,
    logo: logoInitjs,
  },
]

function ProjectFavicon({ project }) {
  if (project.logo) {
    return (
      <Image
        src={project.logo}
        alt=""
        className="h-4 w-4 flex-none rounded-full object-cover"
        unoptimized
      />
    )
  }

  const initials = project.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <span
      aria-hidden="true"
      className={`flex h-4 w-4 flex-none items-center justify-center rounded-full text-[0.5rem] font-bold leading-none ${
        project.logoColor ?? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
      }`}
    >
      {initials}
    </span>
  )
}

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.75 5.75 9.25 8l-2.5 2.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProjectCard({ project, priority = false }) {
  return (
    <article className="group relative flex flex-col">
      {/* A miniature browser window: the chrome gives fourteen very different
          landing pages one consistent frame, and doubles as the URL label. */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-zinc-800/10 group-hover:ring-zinc-900/10 dark:bg-zinc-800 dark:ring-white/10 dark:group-hover:ring-white/20">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <div className="flex flex-none gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-600" />
            <span className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-600" />
            <span className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-600" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-zinc-50 px-2 py-1 dark:bg-zinc-900/60">
            <ProjectFavicon project={project} />
            <span className="truncate text-xs text-zinc-400 dark:text-zinc-500">
              {project.link.label}
            </span>
          </div>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-50 dark:bg-zinc-900">
          {project.screenshot ? (
            <Image
              src={project.screenshot}
              alt={`Landing page of ${project.name}`}
              placeholder="blur"
              priority={priority}
              sizes="(min-width: 1024px) 30rem, (min-width: 640px) 20rem, 100vw"
              className="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-[1.03] dark:brightness-[0.92] dark:group-hover:brightness-100"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800/60">
              {project.logo ? (
                <Image
                  src={project.logo}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover opacity-80 shadow-sm transition duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
                  unoptimized
                />
              ) : null}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-zinc-900/5 dark:ring-white/5" />
        </div>
      </div>

      <h2 className="mt-6 text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
        <Link href={project.link.href}>
          <span className="absolute inset-0 z-20 rounded-2xl" />
          <span className="relative z-10">{project.name}</span>
        </Link>
      </h2>
      <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {project.description}
      </p>
      <div
        aria-hidden="true"
        className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500 transition-transform duration-200 group-hover:translate-x-1"
      >
        Visit site
        <ArrowIcon className="ml-1 h-4 w-4 stroke-current transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </article>
  )
}

export const metadata = pageMetadata({
  title: 'Selected Projects',
  description:
    'Selected work by Michael Mitrakos — web apps and startup products including Print Club Society, Verdacert, Habeo, Casework, and HireAIScore.',
  path: '/projects',
})

export default function Projects() {
  return (
    <SimpleLayout
      title="My Projects: Things I've made trying to put my dent in the universe."
      intro="I've worked on tons of little projects over the years but these are the ones that I'm most proud of. If you see something that piques your interest, check out the project and get in touch if you have ideas for how it can be improved."
    >
      <StaggerContainer
        role="list"
        className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2"
        staggerDelay={0.06}
      >
        {projects.map((project, index) => (
          <StaggerItem key={project.name} role="listitem">
            {/* The first row is above the fold on desktop — eager-load it so the
                screenshot is the LCP element rather than a blur placeholder. */}
            <ProjectCard project={project} priority={index < 2} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SimpleLayout>
  )
}
