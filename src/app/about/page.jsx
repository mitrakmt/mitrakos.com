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
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations'
import portraitImage from '@/images/portrait.jpg'
import { pageMetadata } from '@/lib/site'

function SocialLink({ className, href, children, icon: Icon, ...props }) {
  if (props.target === '_blank' && !props.rel) {
    props.rel = 'noopener noreferrer'
  }
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition-colors duration-200 hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
        {...props}
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition-all duration-200 group-hover:fill-teal-500 group-hover:scale-110" />
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

export const metadata = pageMetadata({
  title: 'About Michael Mitrakos',
  description:
    'Learn about Michael Mitrakos, a US-based senior software engineer and tech lead focused on frontend engineering, team leadership, and web product development.',
  path: '/about',
})

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <FadeIn direction="scale-up" delay={0.2}>
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <Image
                src={portraitImage}
                alt=""
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover transition-all duration-500 hover:rotate-0 hover:scale-[1.02] dark:bg-zinc-800"
              />
            </div>
          </FadeIn>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <FadeIn direction="fade-up">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              I’m Michael Mitrakos. I’m a US-based software engineer who loves
              building for the web.
            </h1>
          </FadeIn>
          <StaggerContainer className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400" staggerDelay={0.1}>
            <StaggerItem>
              <p>
                Hi, I’m Michael Mitrakos, a software engineer based in the United
                States. I’ve spent my career building products for startups and
                agencies, always chasing elegant solutions to real problems.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                My passion lies in frontend engineering—turning ideas into
                delightful experiences in the browser. I love working with modern
                frameworks and crafting interfaces that feel just right.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                I’m equally excited about leading and growing engineering teams.
                Mentoring developers, fostering collaboration, and guiding
                projects from concept to launch energize me every day.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                I’m driven by the belief that great software is built by teams who
                care about the craft, and I’m always looking for new challenges to
                tackle together.
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>
        <div className="lg:pl-20">
          <StaggerContainer className="space-y-0" staggerDelay={0.08}>
            <StaggerItem>
              <SocialLink
                href="https://x.com/Mike_Mitrakos"
                icon={XIcon}
                target="_blank"
              >
                Follow on X
              </SocialLink>
            </StaggerItem>
            <StaggerItem>
              <SocialLink
                href="https://www.instagram.com/mike_mitrakos/"
                icon={InstagramIcon}
                className="mt-4"
                target="_blank"
              >
                Follow on Instagram
              </SocialLink>
            </StaggerItem>
            <StaggerItem>
              <SocialLink
                href="https://github.com/mitrakmt"
                icon={GitHubIcon}
                className="mt-4"
                target="_blank"
              >
                Follow on GitHub
              </SocialLink>
            </StaggerItem>
            <StaggerItem>
              <SocialLink
                href="https://www.linkedin.com/in/mitrakos"
                icon={LinkedInIcon}
                className="mt-4"
                target="_blank"
              >
                Follow on LinkedIn
              </SocialLink>
            </StaggerItem>
            <StaggerItem>
              <SocialLink
                href="mailto:mike@higglo.io"
                icon={MailIcon}
                className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
              >
                mike@higglo.io
              </SocialLink>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </Container>
  )
}
