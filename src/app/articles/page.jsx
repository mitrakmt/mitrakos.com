import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerContainer, StaggerItem } from '@/components/animations'
import { getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'
import { pageMetadata } from '@/lib/site'

function Article({ article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
  )
}

export const metadata = pageMetadata({
  title: 'Articles',
  description:
    "Read Michael Mitrakos's articles on programming, frontend engineering, leadership, product design, and building high-quality web applications.",
  path: '/articles',
})

export default async function ArticlesIndex() {
  let articles = await getAllArticles()

  return (
    <SimpleLayout
      title="Writing on software design, company building, and travel."
      intro="All of my long-form thoughts on programming, leadership, product, and more, collected in chronological order."
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <StaggerContainer
          className="flex max-w-3xl flex-col space-y-16"
          staggerDelay={0.1}
        >
          {articles.map((article) => (
            <StaggerItem key={article.slug}>
              <Article article={article} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </SimpleLayout>
  )
}
