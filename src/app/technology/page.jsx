import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({ children, ...props }) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({ title, href, children }) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Technology',
  description: 'Software I use, gadgets I love, and other things I recommend.',
}

export default function Technology() {
  return (
    <SimpleLayout
      title="Software I use, gadgets I love, and other things I recommend."
      intro="I get asked a lot about the things I use to build software, stay productive, or buy to fool myself into thinking I’m being productive when I’m really just procrastinating. Here’s a big list of all of my favorite stuff."
    >
      <div className="space-y-20">
        <ToolsSection title="Workstation">
          <Tool title="M2 MacBook Air, 64GB RAM (2022)">
            This machine has been a game-changer for me, offering silent performance even under demanding tasks. The efficiency and power of the M2 chip make it ideal for all my productivity needs.
          </Tool>
          <Tool title="Apple Magic Trackpad">
            Something about all the gestures makes me feel like a wizard with
            special powers. I really like feeling like a wizard with special
            powers.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Development tools">
          <Tool title="Visual Studio Code">
            My coding environment of choice, Visual Studio Code provides all the features of an IDE with the flexibility of a text editor. Its extensive plugin ecosystem allows me to customize my development environment perfectly to my needs.
          </Tool>
          <Tool title="iTerm2">
            I’m honestly not even sure what features I get with this that aren’t
            just part of the macOS Terminal but it’s what I use.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Marketing">
          <Tool title="Buffer">
            Managing social media has never been easier with Buffer. It allows me to schedule posts across platforms, ensuring my content strategy is consistent without constant manual input.
          </Tool>
          <Tool title="Ubersuggest">
            For quick keyword research and SEO insights, UberSuggest is my go-to tool. It helps me understand what my audience is searching for, optimizing my content for better visibility.
          </Tool>
          <Tool title="Google Search Console">
            This tool is essential for monitoring and maintaining my site's presence in Google Search results. It gives me detailed reports on search traffic, crawl errors, and site security issues.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Productivity">
          <Tool title="Notion">
            I've found Notion to be incredibly versatile for organizing my thoughts, projects, and daily tasks. It's like having a digital workspace where everything from notes to project management can be seamlessly integrated.
          </Tool>
          <Tool title="Google Drive">
            All my document storage, sharing, and collaboration happen here. Google Drive's integration with other Google services makes it a cornerstone for my digital workflow.
          </Tool>
          <Tool title="Pitch">
            For presentations, Pitch has been a revelation. It's intuitive, collaborative, and the templates are professional enough to make my presentations stand out without spending hours on design.
          </Tool>
          <Tool title="Canva">
            When it comes to design, Canva simplifies everything. Whether it's social media graphics, flyers, or even simple infographics, Canva's user-friendly interface lets me create professional-looking content quickly.
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
