import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerContainer, StaggerItem } from '@/components/animations'
import { formatDate } from '@/lib/formatDate'
import { pageMetadata } from '@/lib/site'

import articles from './articles.json'

function Article({ article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={article.url}>{article.title}</Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 hidden md:block"
      >
        {article.date}
      </Card.Eyebrow>
    </article>
  )
}

export const metadata = pageMetadata({
  title: 'initJS | Learn JavaScript',
  description:
    'Learn JavaScript with initJS articles and resources that take you from beginner concepts to more advanced programming topics.',
  path: '/initjs',
})

export default async function ArticlesIndex() {
  return (
    <SimpleLayout
      title="Writing on All Things Javascript"
      intro="All of my long-form thoughts on programming in Javascript."
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <StaggerContainer
          className="flex max-w-3xl flex-col space-y-16"
          staggerDelay={0.1}
        >
          {articles.map((article) => (
            <StaggerItem key={article.url}>
              <Article article={article} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </SimpleLayout>
  )
}
