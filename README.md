# My Clawster Website

The Clawster Website is the public docs and marketing surface for the Clawster ecosystem. It explains the product model, showcases the platform visually, and gives users a guided path through My Clawster, Clawne Me, Enterprise, Developers, and Operations.

It is built with [Docusaurus](https://docusaurus.io/) and uses a custom visual layer tailored to the Clawster brand.

## What this site is for

- Introduce the platform clearly to new users
- Document the product and operator workflows
- Give developers and operators a structured starting point
- Publish a branded static site that can be deployed easily

## Getting started

Install dependencies:

```bash
bun install
```

Start the local development server:

```bash
bun run start
```

This launches the docs site locally with live reload so content and style changes appear immediately.

## Production build

Create a static production build:

```bash
bun run build
```

The generated site is written to `build/` and can be deployed to any static hosting platform.

## Project structure

- `docs/` contains the documentation content
- `blog/` contains blog content when used
- `static/` contains images, icons, and other public assets
- `src/` contains custom theme components and CSS overrides

## Deployment

Deploy with SSH:

```bash
USE_SSH=true bun run deploy
```

Deploy without SSH:

```bash
GIT_USER=<Your GitHub username> bun run deploy
```

If the project is configured for GitHub Pages, this publishes the built site to the `gh-pages` branch.
