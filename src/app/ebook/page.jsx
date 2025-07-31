import { Author } from '@/components/Author'
import { FreeChapters } from '@/components/FreeChapters'
import { Hero } from '@/components/Hero'
import { Introduction } from '@/components/Introduction'
import { NavBar } from '@/components/NavBar'
import { Pricing } from '@/components/Pricing'
import { Resources } from '@/components/Resources'
import { Screencasts } from '@/components/Screencasts'
import { TableOfContents } from '@/components/TableOfContents'
import { Testimonial } from '@/components/Testimonial'
import { Testimonials } from '@/components/Testimonials'
import avatarImage1 from '@/images/avatars/avatar-1.png'
import avatarImage2 from '@/images/avatars/avatar-2.png'

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <NavBar />
      <TableOfContents />
      <Testimonial
        id="testimonial-from-tommy-stroman"
        author={{
          name: 'Joey Yaccarino',
          role: 'Sales Engineer',
          image: avatarImage1,
        }}
      >
        <p>
          “An incredibly clear and approachable guide—From Zero to Code turned JavaScript from a daunting subject into something I now feel excited to learn and explore further!”
        </p>
      </Testimonial>
      <Screencasts />
      <Testimonial
        id="testimonial-from-gerardo-stark"
        author={{
          name: 'Tony Galidro',
          role: 'Entrepreneur',
          image: avatarImage2,
        }}
      >
        <p>
        "An excellent resource for beginners! From Zero to Code made JavaScript feel approachable and fun—this ebook helped me go from complete beginner to confident coder in no time!"
        </p>
      </Testimonial>
      <Resources />
      {/* <FreeChapters /> */}
      <Pricing />
      <Testimonials />
      <Author />
    </>
  )
}
