import Image from 'next/image'
import Link from 'next/link'

import { GridPattern } from '@/components/GridPattern'
import { SectionHeading } from '@/components/SectionHeading'
import authorImage from '@/images/portrait.jpg'

function XIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8132L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
    </svg>
  )
}

export function Author() {
  return (
    <section
      id="author"
      aria-labelledby="author-title"
      className="relative scroll-mt-14 pb-3 pt-8 sm:scroll-mt-32 sm:pb-16 sm:pt-10 lg:pt-16"
    >
      <div className="absolute inset-x-0 bottom-0 top-1/2 text-zinc-900/10 dark:text-zinc-100 [mask-image:linear-gradient(transparent,white)]">
        <GridPattern x="50%" y="100%" />
      </div>
      <div className="relative mx-auto max-w-5xl pt-16 sm:px-6">
        <div className="bg-slate-50 pt-px sm:rounded-6xl">
          <div className="relative mx-auto -mt-16 h-44 w-44 overflow-hidden rounded-full bg-slate-200 md:float-right md:h-64 md:w-64 md:[shape-outside:circle(40%)] lg:mr-20 lg:h-72 lg:w-72">
            <Image
              className="absolute inset-0 h-full w-full object-cover"
              src={authorImage}
              alt=""
              sizes="(min-width: 1024px) 18rem, (min-width: 768px) 16rem, 11rem"
            />
          </div>
          <div className="px-4 py-10 sm:px-10 sm:py-16 md:py-20 lg:px-20 lg:py-32">
            <SectionHeading number="5" id="author-title">
              Author
            </SectionHeading>
            <p className="mt-8 font-display text-5xl font-extrabold tracking-tight text-zinc-800 sm:text-6xl">
              <span className="block text-blue-800">Michael Mitrakos –</span> Hi, I’m Michael, the author of From Zero to Code: JavaScript for Absolute Beginners.
            </p>
            <p className="mt-4 text-lg tracking-tight text-slate-700">
              I’ve been a developer for over a decade, working with clients across various industries to build efficient, scalable websites and applications. As a passionate educator, I’ve been teaching JavaScript workshops for the past three years, helping beginners get started with programming. My teaching style is all about breaking down complex concepts into easy-to-follow steps, making it simple for anyone to dive into coding and start building their own projects with confidence.
            </p>
            <p className="mt-8">
              <Link
                href="https://www.x.com/mike_mitrakos"
                target="_blank"
                className="inline-flex items-center text-base font-medium tracking-tight text-zinc-900"
              >
                <XIcon className="h-10 w-10 fill-current" />
                <span className="ml-4">Follow on X</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
