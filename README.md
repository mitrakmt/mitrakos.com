# Spotlight

Spotlight is a [Tailwind UI](https://tailwindui.com) site template built using [Tailwind CSS](https://tailwindcss.com) and [Next.js](https://nextjs.org).

## Getting started

To get started with this template, first install the npm dependencies:

```bash
npm install
```

Next, create a `.env.local` file in the root of your project and set the `NEXT_PUBLIC_SITE_URL` variable to your site's public URL:

```
NEXT_PUBLIC_SITE_URL=https://example.com
```

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Customizing

You can start editing this template by modifying the files in the `/src` folder. The site will auto-update as you edit these files.

## Public traction stats

The home page and `/stats` publish real visitor numbers for every tracked
project, read from Google Analytics.

- **Which projects appear** — `src/lib/stats/projects.mjs`. Each entry maps a
  GA4 `propertyId` to the name, description, category, and link shown publicly.
- **The numbers** — `src/data/stats-snapshot.json`, generated from GA. This is
  what renders when no credentials are configured, so the published figures are
  always real rather than placeholder.

### Live updates (optional)

Set `GA_SERVICE_ACCOUNT_KEY` and both pages fetch from GA directly, revalidating
hourly. If the key is missing or the API call fails, they fall back to the
snapshot — a GA outage can never break a build.

1. In Google Cloud, create a service account and enable the **Google Analytics
   Data API**.
2. In GA Admin → Property access management, add the service account's email as
   a **Viewer** on each property in `projects.mjs`.
3. Download the JSON key and set it as `GA_SERVICE_ACCOUNT_KEY` — raw JSON
   locally, base64 on Vercel (`base64 -i key.json | pbcopy`) since the dashboard
   mangles multi-line values.

### Refreshing the snapshot

```bash
npm run stats:refresh
```

Rewrites `stats-snapshot.json` from GA and prints the new totals. Commit the
result. Worth running whenever you add a project, and periodically if you skip
the live setup.

## Public revenue

`/stats` also publishes net revenue per project, read from Stripe. It follows
the same shape as the traffic numbers: a committed snapshot renders by default,
and live keys upgrade it to a direct read.

- **Which projects publish revenue** — a `stripe: { accountId }` entry on the
  project in `src/lib/stats/projects.mjs`. Projects without one render as
  **not published**, never as `$0`; the two are different claims and only one
  of them would be true.
- **The numbers** — `src/data/revenue-snapshot.json`, in minor units (cents).

Revenue is attributed **per Stripe account**, so each project needs its own
account. Two projects sharing one account would each be credited with all of
it — splitting a single account across projects would need product-level
attribution, which this does not do.

### Connecting an account

1. In the Stripe Dashboard for that account, create a **restricted key** with
   read access to **Balance transactions**, **Subscriptions**, and **Account**.
   Nothing else is needed, and nothing write-scoped should be granted.
2. Add the project's `stripe.accountId` in `projects.mjs`. A key that resolves
   to any other account is rejected rather than published under the wrong
   project's name.
3. Set the keys as a JSON object keyed by project id:

```
STRIPE_RESTRICTED_KEYS='{"wanderlust":"rk_live_...","verdacert":"rk_live_..."}'
```

Raw JSON locally, base64 on Vercel (`base64 -i keys.json | pbcopy`), matching
how `GA_SERVICE_ACCOUNT_KEY` is handled. If the variable is missing or any
account fails, the page falls back to the snapshot rather than publishing a
total that silently omits an account.

> The Stripe CLI's own key in `~/.config/stripe/config.toml` is not usable
> here — it is machine-local and expires every 90 days. Use a Dashboard
> restricted key.

### Refreshing the snapshot

```bash
npm run revenue:refresh
```

Rewrites `revenue-snapshot.json` and prints lifetime net, latest month, and MRR
per account, warning if any account's history was too long to read in full.
Commit the result.

## License

This site template is a commercial product and is licensed under the [Tailwind UI license](https://tailwindui.com/license).

## Learn more

To learn more about the technologies used in this site template, see the following resources:

- [Tailwind CSS](https://tailwindcss.com/docs) - the official Tailwind CSS documentation
- [Next.js](https://nextjs.org/docs) - the official Next.js documentation
- [Headless UI](https://headlessui.dev) - the official Headless UI documentation
- [MDX](https://mdxjs.com) - the MDX documentation
