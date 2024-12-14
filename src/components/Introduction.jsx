import Link from 'next/link'

import { CheckIcon } from '@/components/CheckIcon'
import { Container } from '@/components/Container'

export function Introduction() {
  return (
    <section
      id="introduction"
      aria-label="Introduction"
      className="pb-16 pt-20 sm:pb-20 md:pt-36 lg:py-32"
    >
      <Container className="text-lg tracking-tight text-slate-700 dark:text-slate-100">
        <p className="font-display text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          "From Zero to Code: JavaScript for Absolute Beginners" is an ebook designed to teach you the fundamentals of JavaScript in a simple, easy-to-understand way.
        </p>
        <p className="mt-4">
          Before I dove into coding, I thought programming was for experts with years of experience, who knew every detail and complex syntax by heart. I imagined long, difficult lines of code that would take forever to understand.
        </p>
        <p className="mt-4">
          But that’s not how you should start learning at all.
        </p>
        <p className="mt-4">
          In From Zero to Code, you'll discover a structured approach that helps you learn JavaScript step by step, without feeling overwhelmed.
        </p>
        <ul role="list" className="mt-8 space-y-3">
          {[
            'Understanding the core JavaScript concepts and syntax',
            'Writing your first lines of code with confidence',
            'Debugging and troubleshooting errors like a pro',
            'Using loops, functions, and arrays to build your own small projects',
            'Building a solid foundation for learning more advanced coding skills',
          ].map((feature) => (
            <li key={feature} className="flex">
              <CheckIcon className="h-8 w-8 flex-none fill-blue-500" />
              <span className="ml-4">{feature}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          By the end of the ebook, you’ll have the knowledge and confidence to start writing your own JavaScript code and dive deeper into programming without fear.
        </p>
        <p className="mt-10">
          <Link
            href="#free-chapters"
            className="text-base font-medium text-blue-600 hover:text-blue-800"
          >
            Get two free chapters straight to your inbox{' '}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </p>
      </Container>
    </section>
  )
}
