import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations'
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
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <FadeIn direction="fade-up">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Writing on All Things Javascript
          </h1>
        </FadeIn>
        <FadeIn direction="fade-up" delay={0.1}>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            All of my long-form thoughts on programming in Javascript.
          </p>
        </FadeIn>
      </header>
      <div className="mt-16 sm:mt-20">
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <StaggerContainer
            className="flex max-w-3xl flex-col space-y-16"
            staggerDelay={0.1}
            animate
          >
            {articles.map((article) => (
              <StaggerItem key={article.url}>
                <Article article={article} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </Container>
  )
}
