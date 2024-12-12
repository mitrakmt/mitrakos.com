import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata = {
  title: 'About',
  description:
    'I’m Michael Mitrakos. I live in Egypt, where I build the future.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            I’m Michael Mitrakos. I live in Egypt, where I design the
            future.
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              Hi, I’m Michael Mitrakos, the CEO of Higglo Digital, founder of WanderlustApp, and Web Design Awards. I've always been passionate about creating and exploring, and my journey has been shaped by a love for both technology and the boundless possibilities of imagination.
            </p>
            <p>
              Pursuing engineering in college further fueled my drive to create and explore. A lifelong dream of traveling the globe has taken me to over 150 countries, enriching my perspective and inspiring the work I do every day.
            </p>
            <p>
              Today, I lead Higglo Digital, where we craft cutting-edge SEO strategies for industries as diverse as esports and beyond. I'm also deeply committed to celebrating and elevating great design through Web Design Awards and encouraging exploration and discovery through WanderlustApp.
            </p>
            <p>
              I believe the future is built by those who dare to create, and I’m grateful to be part of that journey.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink href="https://x.com/Mike_Mitrakos" icon={XIcon} target="_blank">
              Follow on X
            </SocialLink>
            <SocialLink href="https://www.instagram.com/mike_mitrakos/" icon={InstagramIcon} className="mt-4" target="_blank">
              Follow on Instagram
            </SocialLink>
            <SocialLink href="https://github.com/mitrakmt" icon={GitHubIcon} className="mt-4" target="_blank">
              Follow on GitHub
            </SocialLink>
            <SocialLink href="https://www.linkedin.com/in/mitrakos" icon={LinkedInIcon} className="mt-4" target="_blank">
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:mike@higglo.io"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              mike@higglo.io
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
