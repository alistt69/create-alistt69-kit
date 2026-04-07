# testyy

Created with `create-alistt69-kit`.

## Overview

Starter project based on React + TypeScript + Webpack with optional tooling selected during scaffolding.

## Included by default

- [React](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Static typing
- [Webpack](https://webpack.js.org/) — Bundling and build pipeline
- [SCSS Modules](https://github.com/css-modules/css-modules) — Scoped styling
- [SVGR](https://react-svgr.com/) — SVGs as React components
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) — Bundle size inspection

## Selected optional features

- Autoprefixer — PostCSS vendor prefixes
- ESLint + Stylistic — JS/TS/React linting
- Stylelint — SCSS/CSS linting

## Quick start

Install dependencies first, then start the development server.

```bash
cd testyy
npm install
npm run start
```

## Project structure

- `public/` — static assets and HTML template
- `src/` — application source code
- `src/app/` — app bootstrap, providers, entry-level setup
- `src/styles/` — global styles and shared styling layer
- `config/build/` — split webpack configuration

## Available scripts

- `npm run build` — Build for production
- `npm run build:dev` — Build in development mode
- `npm run build:prod` — Build in production mode
- `npm run dev` — Start development server
- `npm run lint` — Run ESLint
- `npm run lint:fix` — Run ESLint with autofix
- `npm run lint:styles` — Run Stylelint
- `npm run lint:styles:fix` — Run Stylelint with autofix
- `npm run start` — Start development server
- `npm run typecheck` — Run TypeScript type check
