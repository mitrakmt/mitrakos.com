import { SimpleLayout } from '@/components/SimpleLayout'

import { alternateTypes } from '@/lib/site'

export const metadata = {
  title: 'You’re subscribed',
  description:
    'Thanks for subscribing — you’re on the list for new writing from Michael Mitrakos on software engineering, leadership, and building for the web.',
  // Stated explicitly so this page never inherits a canonical from the root
  // layout. It is noindex either way, but an inherited canonical would name it
  // the homepage.
  alternates: {
    canonical: '/thank-you',
    types: alternateTypes,
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function ThankYou() {
  return (
    <SimpleLayout
      title="Thanks for subscribing."
      intro="I’ll send you an email any time I publish a new blog post, release a new project, or have anything interesting to share that I think you’d want to hear about. You can unsubscribe at any time, no hard feelings."
    />
  )
}
