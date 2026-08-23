import { Container } from '@/components/Container'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations'
import { ProjectStatsList } from '@/components/stats/ProjectStatsList'
import { RevenueSection } from '@/components/stats/RevenueSection'
import { StatTile } from '@/components/stats/StatTile'
import { TrendChart } from '@/components/stats/TrendChart'
import {
  formatCompact,
  formatDay,
  formatMonth,
  formatNumber,
  getStats,
} from '@/lib/stats'
import { getRevenue } from '@/lib/stats/revenue'
import { pageMetadata } from '@/lib/site'

// Rebuild hourly so the published numbers track Google Analytics without a
// deploy. Without credentials this simply re-renders the committed snapshot.
export const revalidate = 3600

export const metadata = pageMetadata({
  title: 'Traffic & Revenue Stats',
  description:
    'Live traction for every project I’ve built — monthly visitors and lifetime users from Google Analytics, plus net Stripe revenue for the ones that take payments.',
  path: '/stats',
})

function Section({ title, children, className }) {
  return (
    <section className={className}>
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default async function Stats() {
  // Both are cached per request, so RevenueSection below shares this fetch.
  const [stats, revenue] = await Promise.all([getStats(), getRevenue()])
  const { totals } = stats

  const footnoteNumbers = new Map(
    stats.footnotes.map((footnote, index) => [footnote.id, index + 1]),
  )

  // The chart caption points at whichever project carries a data-quality note,
  // so renumbering the footnotes can never leave the caption pointing at the
  // wrong one.
  const caveated = stats.footnotes.find((footnote) => footnote.note)
  const caveatNumber = caveated ? footnoteNumbers.get(caveated.id) : null

  const asDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    })

  const updated = asDate(stats.generatedAt)
  const revenueUpdated = asDate(revenue.generatedAt)

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <FadeIn direction="fade-up">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            The numbers behind everything I&apos;ve built.
          </h1>
        </FadeIn>
        <FadeIn direction="fade-up" delay={0.1}>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            Most portfolios show you the screenshots. This one shows you the
            traffic and the money. Every project I run is tracked in Google
            Analytics, and the ones that take payments are read straight from
            Stripe — the ones that took off, the ones that quietly flatlined,
            and exactly what each has earned after fees.
          </p>
        </FadeIn>
        <FadeIn direction="fade-up" delay={0.15}>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
            Journalists and partners are welcome to cite anything here. Last
            updated {updated}.
          </p>
        </FadeIn>
      </header>

      <StaggerContainer
        className="mt-16 grid grid-cols-2 gap-4 sm:mt-20 lg:grid-cols-4"
        staggerDelay={0.08}
      >
        <StaggerItem>
          <StatTile
            label="Lifetime visitors"
            value={formatCompact(totals.lifetimeUsers)}
            sublabel={`${formatNumber(totals.lifetimeUsers)} unique people`}
          />
        </StaggerItem>
        <StaggerItem>
          <StatTile
            label={`Visitors in ${formatMonth(stats.latestMonth)}`}
            value={formatCompact(totals.monthlyUsers)}
            change={totals.monthlyChange}
            sublabel="vs. the month before"
          />
        </StaggerItem>
        <StaggerItem>
          <StatTile
            label="Visitors, last 12 months"
            value={formatCompact(totals.trailingYearUsers)}
            sublabel={`${formatNumber(totals.trailingYearUsers)} across all projects`}
          />
        </StaggerItem>
        <StaggerItem>
          <StatTile
            label="Lifetime page views"
            value={formatCompact(totals.lifetimePageViews)}
            sublabel={`Across ${formatNumber(totals.lifetimeSessions)} sessions`}
          />
        </StaggerItem>
      </StaggerContainer>

      <FadeIn direction="fade-up" className="mt-16">
        <Section title="Monthly visitors across all projects">
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {formatMonth(stats.months[0])} – {formatMonth(stats.latestMonth)}.
            Complete months only.
          </p>
          <TrendChart series={stats.monthlySeries} />
          {caveatNumber && (
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
              The {formatMonth(stats.latestMonth)} step up is concentrated in{' '}
              {caveated.name} and includes a large volume of unverified direct
              traffic — see note{' '}
              <a
                href={`#stats-note-${caveatNumber}`}
                className="font-medium text-teal-600 hover:underline dark:text-teal-400"
              >
                {caveatNumber}
              </a>{' '}
              below. Treat it as an upper bound rather than a trend.
            </p>
          )}
        </Section>
      </FadeIn>

      <FadeIn direction="fade-up" className="mt-16 sm:mt-20">
        <Section title={`All ${totals.projectCount} projects`}>
          <p className="mt-2 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            Ranked by lifetime visitors.{' '}
            {/* "12 of the 12" reads as a near-miss rather than a clean sweep. */}
            {totals.measuredProjectCount === totals.gaProjectCount
              ? `All ${totals.gaProjectCount} tracked in Google Analytics recorded traffic in the last three months`
              : `${totals.measuredProjectCount} of the ${totals.gaProjectCount} tracked in Google Analytics recorded traffic in the last three months`}
            {totals.gappedProjectCount > 0 &&
              `, and ${totals.gappedProjectCount} is currently unmeasured`}
            .
            {totals.externalProjectCount > 0 && (
              <>
                {' '}
                The remaining {totals.externalProjectCount === 1
                  ? 'one is'
                  : `${totals.externalProjectCount} are`}{' '}
                measured elsewhere and listed last, since a figure that is not
                a lifetime visitor count has no place in that ranking.
              </>
            )}
          </p>
          <ProjectStatsList
            projects={stats.projects}
            latestMonth={stats.latestMonth}
            footnoteNumbers={footnoteNumbers}
          />

          {stats.footnotes.length > 0 && (
            <ol className="mt-6 space-y-2 border-t border-zinc-100 pt-4 text-xs text-zinc-500 dark:border-zinc-700/40 dark:text-zinc-400">
              {stats.footnotes.map((footnote, index) => (
                <li
                  key={footnote.id}
                  id={`stats-note-${index + 1}`}
                  className="flex gap-2 scroll-mt-24"
                >
                  <span className="font-medium text-teal-600 dark:text-teal-400">
                    {index + 1}
                  </span>
                  <span>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {footnote.name}:
                    </span>{' '}
                    {footnote.gap && (
                      <>
                        not measured since {formatDay(footnote.gap.since)} —{' '}
                        {footnote.gap.reason}. Lifetime totals are unaffected;
                        monthly figures from that date are withheld rather than
                        reported as a decline.
                        {footnote.note ? ' ' : ''}
                      </>
                    )}
                    {footnote.external && (
                      <>
                        measured by the {footnote.external.source} rather than
                        Google Analytics, because an extension runs in the
                        browser rather than on a site. {' '}
                        {formatNumber(footnote.external.users)}{' '}
                        {footnote.external.metric} as of{' '}
                        {formatDay(footnote.external.asOf)} — a current
                        headcount, not a cumulative total, so it is listed
                        separately and is not added to the lifetime visitor or
                        page-view figures above.
                        {footnote.note ? ' ' : ''}
                      </>
                    )}
                    {footnote.baseline && (
                      <>
                        {formatNumber(footnote.baseline.pageViews)} of the
                        lifetime page views were earned on{' '}
                        {footnote.baseline.source} —{' '}
                        {footnote.baseline.reason}. That figure is fixed and
                        counted once; the{' '}
                        {formatNumber(footnote.baseline.measured.pageViews)}{' '}
                        views and{' '}
                        {formatNumber(footnote.baseline.measured.users)}{' '}
                        visitors measured since are Google Analytics&apos;, and
                        only those appear in the monthly figures and the trend.
                        Because {footnote.baseline.source} reports views rather
                        than unique readers, it is counted in page views only
                        and adds nothing to the visitor totals.
                        {footnote.note ? ' ' : ''}
                      </>
                    )}
                    {footnote.note}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Section>
      </FadeIn>

      <FadeIn direction="fade-up" className="mt-16 sm:mt-20">
        <Section title="Revenue">
          <RevenueSection />
        </Section>
      </FadeIn>

      <FadeIn direction="fade-up" className="mt-16 sm:mt-20">
        <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Methodology
          </h2>
          <dl className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <div>
              <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                Where the numbers come from
              </dt>
              <dd className="mt-1">
                Google Analytics 4, one property per project, read directly via
                the Analytics Data API. One figure is not GA&apos;s: the
                audience InitJS built on Medium before the site had analytics
                of its own, which is added once to its lifetime page views and
                marked in the table. The Chrome extension is not a website and
                has no GA property at all — its audience is the Chrome Web
                Store&apos;s own weekly figure, listed separately and excluded
                from every total on this page. Nothing else is entered by hand,
                and no figure is adjusted after it is read.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                What &ldquo;visitors&rdquo; means
              </dt>
              <dd className="mt-1">
                Monthly figures use GA4&apos;s <em>active users</em> — people
                who actually engaged, deduplicated within the month. Lifetime
                figures use <em>total users</em> since each property started
                recording. Because a person visiting in two different months is
                counted in both, monthly figures do not sum to the lifetime
                total.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                Complete months only
              </dt>
              <dd className="mt-1">
                The current month is excluded until it ends, so a partial month
                never reads as a collapse in traffic.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                Dormant and unmeasured projects
              </dt>
              <dd className="mt-1">
                Projects showing &ldquo;—&rdquo; either recorded no traffic for
                three or more months, or are not currently being measured
                because their analytics tag stopped reporting. Both stay listed
                with their lifetime totals rather than being quietly dropped,
                and both are excluded from the monthly figures — a broken tag is
                a measurement gap, not an audience decline. Affected projects
                are numbered in the table and explained beneath it.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                Where the revenue comes from
              </dt>
              <dd className="mt-1">
                Stripe, one account per project, read directly from the Balance
                Transactions API — the same ledger the payouts are made from,
                not a sales figure typed in by hand.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                What &ldquo;net revenue&rdquo; means
              </dt>
              <dd className="mt-1">
                Everything charged, minus refunds, chargebacks, and every fee
                Stripe takes — in other words what actually reached the bank,
                not what was billed. Gross is shown alongside it so the
                difference is visible rather than assumed. Figures are cash
                received in the month it settled, not accrual accounting, and
                they are before tax and before any other cost of running the
                project.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                Recurring revenue
              </dt>
              <dd className="mt-1">
                The monthly value of currently active subscriptions, with annual
                plans divided across twelve months. It is a snapshot of what is
                billing today, not a forecast, and it excludes usage-based
                pricing that has no fixed monthly amount.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                Projects with no revenue figure
              </dt>
              <dd className="mt-1">
                A project marked <em>not published</em> has no Stripe account
                connected to this page. That is not a claim that it earned
                nothing — some take no payments at all, and others are billed
                through arrangements I have not made public. Where a figure is
                published it is complete for that project; nothing is netted off
                or left out to make it look better.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                Traffic quality
              </dt>
              <dd className="mt-1">
                Figures are GA4&apos;s, with its standard known-bot exclusion
                applied and no further filtering. Automated traffic that GA does
                not recognise is therefore included. Where a month is visibly
                inflated by it, that is disclosed in the notes above rather than
                quietly removed, and engaged-visitor figures — which exclude
                nearly all of it — are available on request.
              </dd>
            </div>
          </dl>
          <p className="mt-6 border-t border-zinc-100 pt-4 text-xs text-zinc-500 dark:border-zinc-700/40 dark:text-zinc-500">
            Traffic refreshed {updated} from {stats.source}; revenue refreshed{' '}
            {revenueUpdated} from {revenue.source}. Press enquiries:{' '}
            <a
              href="mailto:mike@higglo.io"
              className="font-medium text-teal-500 transition-colors duration-200 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
            >
              mike@higglo.io
            </a>
            .
          </p>
        </div>
      </FadeIn>
    </Container>
  )
}
