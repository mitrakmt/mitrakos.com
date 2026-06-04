import { Container } from '@/components/Container'
import { FadeIn } from '@/components/animations'

export function SimpleLayout({ title, intro, children }) {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <FadeIn direction="fade-up">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            {title}
          </h1>
        </FadeIn>
        <FadeIn direction="fade-up" delay={0.1}>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            {intro}
          </p>
        </FadeIn>
      </header>
      {children && (
        <FadeIn direction="fade-up" delay={0.2} className="mt-16 sm:mt-20">
          {children}
        </FadeIn>
      )}
    </Container>
  )
}
