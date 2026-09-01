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
    id: 'wanderlust-extension',
    name: 'Wanderlust Chrome Extension',
    description: 'Beautiful places on every new tab, as a browser extension.',
    category: 'Product',
    url: 'https://chromewebstore.google.com/detail/wanderlust-new-tab/eengninahgaajcfgddamfpbjhcoghdbj',
    // No GA property, deliberately: an extension runs in the browser's new tab
    // rather than on a site, so there are no page views or sessions to report
    // and no monthly series to draw. The Chrome Web Store publishes one
    // figure — weekly active users — which is a current headcount rather than
    // a cumulative total. It is shown on its own terms, sorted below the
    // measured projects, and kept out of the site-wide visitor and page-view
    // totals: adding a weekly headcount to lifetime visitors would be adding
    // two numbers that do not mean the same thing.
    external: {
      users: 12114,
      metric: 'weekly active users',
      source: 'Chrome Web Store',
      asOf: '2026-08-01',
    },
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
    name: 'Egyptian Hockey League (EHL)',
    description: 'The first ice hockey league in Egypt.',
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
    // The audience InitJS built on Medium before the site had analytics of
    // its own. A fixed historical figure: it is added once to the lifetime
    // total and never moves again — every month from July 2026 onward is GA's
    // and grows on top of it. Medium reports views rather than unique
    // readers, so it lands in page views; counting it as visitors would claim
    // 402,532 distinct people, which the source does not support.
    baseline: {
      pageViews: 402532,
      source: 'Medium',
      reason: 'published on Medium before the site had its own analytics',
    },
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

// Externally-measured projects carry no GA property. Deriving the measured set
// once is what keeps callers from mapping the whole registry and handing GA an
// `undefined` property id — which comes back as a failed read and reads as a
// project that stopped reporting.
export const gaProjects = trackedProjects.filter((project) => project.propertyId)

// Skips the same projects rather than registering them under an `undefined` key
// that would collide.
export const projectsByPropertyId = new Map(
  gaProjects.map((project) => [project.propertyId, project]),
)
