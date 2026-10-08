---
name: glossbeau-deploy
description: How GlossBeau deploys to Netlify (glossbeau.com) and why a pushed commit may not build. Use when pushing, deploying, triggering a Netlify build, or checking Netlify env vars.
---

# GlossBeau deploy (Netlify)

- Netlify builds from GitHub main (webhook + deploy key, Next.js runtime plugin, publish .next). Env vars live in
  Netlify (SHOPIFY_*, REVALIDATE_SECRET). Netlify's free plan only auto-builds commits authored by the Netlify account
  email (diamondprosalon@gmail.com); commits from josealbearhernand@gmail.com are "unrecognized contributor" and need
  `netlify api createSiteBuild --data '{"site_id":"3d661db8-9c7f-4143-8720-85ccbdf7f024"}'` or a local
  `git config user.email diamondprosalon@gmail.com`. The repo is public. Site visibility was set to Public in the Netlify UI.
- Local `netlify deploy --build` fails on Windows (plugin static publish); always build on Netlify.
