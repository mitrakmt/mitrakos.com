import { Container } from '@/components/Container'
import {
  Expandable,
  ExpandableButton,
  ExpandableItems,
} from '@/components/Expandable'
import { SectionHeading } from '@/components/SectionHeading'

const tableOfContents = {
  'Introduction': {
    'Getting started': 1,
    'How to approach learning coding': 15,
    'The outcome': 20,
  },
  'Concepts': {
    'Variables and Basic Data Types': 21,
    'Basic Operations': 21,
    'Errors and Debugging': 21,
    '...and more!': 82,
  },
  'Javascript Fundamentals': {
    'Operators': 50,
    'Control Structures': 82,
    'Interacting with the user': 82,
    '...and more!': 82,
  },
  'Looping and Iteration': {
    'Intro to Loops': 82,
    'Basic Looping': 82,
    'Advanced Looping': 82,
    '...and more!': 82,
  },
  'Functions and Scope': {
    'Declaring and Invoking Functions': 82,
    'Function Scope': 82,
    'Closures': 82,
    '...and more!': 82,
  },
  'Arrays and Objects': {
    'Intro to Data Structures': 82,
    'Manipulating Objects': 82,
    '...and more!': 82,
  },
  'Advanced Javascript Concepts': {
    'The Document Object Model': 82,
    'Prototypal Inheritance': 82,
    '...and more!': 82,
  },
  'APIs, AJAX and Data Interaction': {
    'Making AJAX Calls': 82,
    'Working with JSON': 82,
    '...and more!': 82,
  },
  'Best Practices and Design Patterns': {
    'Coding Conventions and Style Guides': 82,
    'Variables and Data': 82,
    '...and more!': 82,
  },
  'Modern Javascript Features': {
    'Let, Const, and Block Scope': 82,
    'Template Literals': 82,
    '...and more!': 82,
  },
  'Object Oriented Javascript': {
    'Understanding Objects in Depth': 82,
    'ES6 Classes': 82,
    '...and more!': 82,
  },
  'Frameworks and Libraries': {
    'Popular JavaScript Libraries': 82,
    'Diving into Front-end Frameworks': 82,
    'React Deep Dive': 82,
    '...and more!': 82,
  },
  'Building Your First Project': {
    'Recap and Reflection': 82,
    'Project Ideas to Get Started': 82,
    'Building a Portfolio': 82,
    '...and more!': 82,
  },
  'Beat the Interviews': {
    'Coding Challenges': 82,
    'Cracking the Coding Interview': 82,
    'Into FANG': 82,
    '...and more!': 82,
  },
}

export function TableOfContents() {
  return (
    <section
      id="table-of-contents"
      aria-labelledby="table-of-contents-title"
      className="scroll-mt-14 py-16 sm:scroll-mt-32 sm:py-20 lg:py-32"
    >
      <Container>
        <SectionHeading number="1" id="table-of-contents-title">
          Table of contents
        </SectionHeading>
        <p className="mt-8 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Get a look at all of the content covered in the book. Everything you
          need to know is inside.
        </p>
        <p className="mt-4 text-lg tracking-tight text-slate-700 dark:text-slate-300">
          “Everything Starts as a Square” is comprised of 240 tightly edited,
          highly visual pages designed to teach you everything you need to know
          about icon design with no unnecessary filler.
        </p>
        <Expandable>
          <ol role="list" className="mt-16 space-y-10 sm:space-y-16">
            <ExpandableItems>
              {Object.entries(tableOfContents).map(([title, pages]) => (
                <li key={title}>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {title}
                  </h3>
                  <ol
                    role="list"
                    className="mt-8 divide-y divide-slate-300/30 rounded-2xl bg-slate-50 px-6 py-3 text-base tracking-tight sm:px-8 sm:py-7"
                  >
                    {Object.entries(pages).map(([title, pageNumber]) => (
                      <li
                        key={title}
                        className="flex justify-between py-3"
                        aria-label={`${title} on page ${pageNumber}`}
                      >
                        <span
                          className="font-medium text-slate-900"
                          aria-hidden="true"
                        >
                          {title}
                        </span>
                        <span
                          className="font-mono text-slate-400 dark:text-slate-600"
                          aria-hidden="true"
                        >
                          {pageNumber}
                        </span>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ExpandableItems>
          </ol>
          <ExpandableButton>See more</ExpandableButton>
        </Expandable>
      </Container>
    </section>
  )
}
