/**
 * Registry of the projects surfaced on the public traction tracker.
 *
 * `propertyId` is the GA4 property the numbers are read from — it is the join
 * key between this file and `src/data/stats-snapshot.json`. Everything else on
 * an entry is presentation only, so adding a project here without refreshing
 * the snapshot simply renders it with no numbers rather than breaking the page.
 *
 * To add a project: create/locate its GA4 property, add an entry below, then
 * run `npm run stats:refresh`.
 *
 * `stripe.accountId` opts a project into the published revenue figures and
 * names the account those figures must come from. Its key is looked up by
 * project id in STRIPE_RESTRICTED_KEYS, and a key resolving to any other
 * account is rejected rather than published under the wrong name. Omit the
 * field entirely and the project's revenue is simply not published — which is
 * rendered as "not published", never as $0.
 *
 * One account per project: revenue is attributed by account, so two projects
 * sharing a Stripe account would each be credited with the whole of it.
 * Splitting one account across projects needs product-level attribution, which
 * this does not do.
 */
export const trackedProjects = [
  {
    id: 'lives-of-the-saints',
    propertyId: '330297200',
    name: 'Lives of the Saints Calendar',
    description:
      'Daily Orthodox saints calendar, readings, and print editions.',
    category: 'Content',
    url: 'https://www.livesofthesaintscalendar.com',
    // The GA tag stopped firing on 8 Jun 2026 — daily users went from ~200 to
    // single digits overnight. Months from the gap onward are withheld rather
    // than published as a 92% audience collapse that did not happen. Delete
    // this block once the tag is fixed and the numbers speak for themselves.
    trackingGap: {
      since: '2026-06-08',
      reason: 'analytics tag stopped firing',
    },
  },
  {
    id: 'orthodox-christianity-101',
    propertyId: '433513657',
    name: 'Orthodox Christianity 101',
    description: 'Teaching the basics of Orthodox Christianity for beginners.',
    category: 'Content',
    url: 'https://www.orthodoxchristianity101.com',
  },
  {
    id: 'wanderlust',
    propertyId: '357116490',
    name: 'Wanderlust App',
    description: 'Beautiful places on your new tab page.',
    category: 'Product',
    url: 'https://www.wanderlustapp.io',
    stripe: { accountId: 'acct_1MRLRMEPO2m8KS3J' },
  },
  {
    id: 'web-design-awards',
    propertyId: '401977647',
    name: 'Web Design Awards',
    description: 'Recognizing the best of the web.',
    category: 'Product',
    url: 'https://www.webdesignawards.io',
    stripe: { accountId: 'acct_1MRLzyBzDx2evTOq' },
    note: 'July 2026 includes a large volume of unverified direct traffic, concentrated in a small number of regions and averaging under 5% engagement. Engaged-visitor figures available on request.',
  },
  {
    id: 'higglo',
    propertyId: '347428937',
    name: 'Higglo Digital',
    description:
      'Memorable brand experiences, SEO, and award-winning websites.',
    category: 'Agency',
    url: 'https://www.higglo.io',
  },
  {
    id: 'elite-hockey-hq',
    propertyId: '471040404',
    name: 'Elite Hockey HQ',
    description: 'Elite ice hockey training, resources, and community.',
    category: 'Product',
    url: 'https://www.elitehockeyhq.com',
    stripe: { accountId: 'acct_1RxMQoLaWreVvtrK' },
  },
  {
    id: 'enhl',
    propertyId: '498129113',
    name: 'ENHL',
    description: 'The Egyptian National Hockey League, the first in Egypt.',
    category: 'Community',
    url: 'https://www.egyptianhockeyleague.com',
  },
  {
    id: 'verdacert',
    propertyId: '537261811',
    name: 'Verdacert',
    description: 'Sustainability certification platform for businesses.',
    category: 'Product',
    url: 'https://www.verdacert.com',
    stripe: { accountId: 'acct_1TVvkZJqfe0ICXlq' },
  },
  {
    id: 'aba-rank',
    propertyId: '534525235',
    name: 'ABA Rank',
    description: 'Ranking and analytics for applied behavior analysis.',
    category: 'Product',
    url: 'https://www.abarank.com',
  },
  {
    id: 'landearly',
    propertyId: '543873379',
    name: 'LandEarly',
    description: 'Early-stage job discovery for engineers.',
    category: 'Product',
    url: 'https://www.landearly.com',
    stripe: { accountId: 'acct_1ThnLLJdbnqJNEMK' },
  },
  {
    id: 'outlink-ai',
    propertyId: '509093508',
    name: 'Outlink AI',
    description: 'AI-assisted link building and outreach.',
    category: 'Product',
    url: 'https://www.outlinkai.com',
    stripe: { accountId: 'acct_1Thn79JdsVSzFiEO' },
  },
  {
    id: 'initjs',
    propertyId: '543855806',
    name: 'InitJS',
    description: 'Teaching JavaScript to over 400,000 readers.',
    category: 'Content',
    url: 'https://www.initjs.org',
  },
  {
    id: 'hireaiscore',
    propertyId: '539861168',
    name: 'HireAIScore',
    description: 'AI-powered candidate scoring and hiring intelligence.',
    category: 'Product',
    url: 'https://www.hireaiscore.com',
    stripe: { accountId: 'acct_1TuBx9JfgFYJrwum' }
  },
]

export const projectsByPropertyId = new Map(
  trackedProjects.map((project) => [project.propertyId, project]),
)
