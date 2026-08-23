import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerContainer, StaggerItem } from '@/components/animations'
import { pageMetadata } from '@/lib/site'

function ToolsSection({ children, ...props }) {
  return (
    <Section {...props}>
      <StaggerContainer role="list" className="space-y-16" staggerDelay={0.1}>
        {children}
      </StaggerContainer>
    </Section>
  )
}

function Tool({ title, href, children }) {
  return (
    <StaggerItem>
      <Card as="li" className="transition-transform duration-300 hover:translate-x-1">
        <Card.Title as="h3" href={href}>
          {title}
        </Card.Title>
        <Card.Description>{children}</Card.Description>
      </Card>
    </StaggerItem>
  )
}

export const metadata = pageMetadata({
  title: 'Tech Stack & Tools I Use',
  description:
    'The stack Michael Mitrakos builds with — JavaScript, TypeScript, React, Next.js, Node.js, Tailwind CSS — plus the tools, gadgets, and apps he recommends.',
  path: '/technology',
})

export default function Technology() {
  return (
    <SimpleLayout
      title="Software I use, gadgets I love, and other things I recommend."
      intro="I get asked a lot about the things I use to build software, stay productive, or buy to fool myself into thinking I'm being productive when I'm really just procrastinating. Here's a big list of all of my favorite stuff."
    >
      <div className="space-y-20">
        <ToolsSection title="Workstation">
          <Tool title="MacBook Pro 14&quot;, M5">
            My daily driver for everything from heavy development work to
            content creation. The M5 chip handles everything I throw at it
            without breaking a sweat.
          </Tool>
          <Tool title="Apple Magic Trackpad">
            Something about all the gestures makes me feel like a wizard with
            special powers. I really like feeling like a wizard with special
            powers.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Tech stack">
          <Tool title="JavaScript">
            The language I keep coming back to after almost a decade of writing
            it. It runs everywhere, the ecosystem moves fast, and I&apos;ve
            written enough of it to know exactly where the sharp edges are.
          </Tool>
          <Tool title="TypeScript">
            JavaScript with a safety net. Types catch the class of bug that used
            to eat an afternoon, and the editor tooling you get for free makes
            refactoring something I&apos;ll actually do instead of avoid.
          </Tool>
          <Tool title="React">
            My default for anything with a user interface. Components compose,
            state is predictable, and the mental model has held up across every
            project I&apos;ve shipped with it.
          </Tool>
          <Tool title="Next.js">
            The framework I reach for on nearly every new project. Server-side
            rendering, file-based routing, and image optimization out of the box
            mean I spend my time on the product instead of the plumbing — and
            the SEO benefits are hard to argue with.
          </Tool>
          <Tool title="Node.js">
            Everything on the server side. APIs, background jobs, scrapers, CLI
            scripts — being able to use one language across the whole stack is
            still the thing I appreciate most about it.
          </Tool>
          <Tool title="Tailwind CSS">
            Utility classes instead of a stylesheet I&apos;ll be scared to touch
            in six months. It keeps design decisions in the markup where I can
            see them and makes it easy to stay consistent across a project.
          </Tool>
          <Tool title="Vercel">
            Where most of my projects live. Push to Git, get a deployment,
            preview every branch — the workflow disappears into the background,
            which is exactly what I want from hosting.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Development tools">
          <Tool title="Visual Studio Code">
            My coding environment of choice, Visual Studio Code provides all the
            features of an IDE with the flexibility of a text editor. Its
            extensive plugin ecosystem allows me to customize my development
            environment perfectly to my needs.
          </Tool>
          <Tool title="iTerm2">
            I'm honestly not even sure what features I get with this that aren't
            just part of the macOS Terminal but it's what I use.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Marketing">
          <Tool title="Buffer">
            Managing social media has never been easier with Buffer. It allows
            me to schedule posts across platforms, ensuring my content strategy
            is consistent without constant manual input.
          </Tool>
          <Tool title="Ubersuggest">
            For quick keyword research and SEO insights, UberSuggest is my go-to
            tool. It helps me understand what my audience is searching for,
            optimizing my content for better visibility.
          </Tool>
          <Tool title="Google Search Console">
            This tool is essential for monitoring and maintaining my site's
            presence in Google Search results. It gives me detailed reports on
            search traffic, crawl errors, and site security issues.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Productivity">
          <Tool title="Notion">
            I&apos;ve found Notion to be incredibly versatile for organizing my
            thoughts, projects, and daily tasks. It&apos;s like having a digital
            workspace where everything from notes to project management can be
            seamlessly integrated.
          </Tool>
          <Tool title="Google Drive">
            All my document storage, sharing, and collaboration happen here.
            Google Drive's integration with other Google services makes it a
            cornerstone for my digital workflow.
          </Tool>
          <Tool title="Pitch">
            For presentations, Pitch has been a revelation. It's intuitive,
            collaborative, and the templates are professional enough to make my
            presentations stand out without spending hours on design.
          </Tool>
          <Tool title="Canva">
            When it comes to design, Canva simplifies everything. Whether it's
            social media graphics, flyers, or even simple infographics, Canva's
            user-friendly interface lets me create professional-looking content
            quickly.
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
