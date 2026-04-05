# _create-alistt69-kit_

> **One command. Zero config fatigue.**  
> Bootstrap a **React + TypeScript + Webpack** app with a solid starter setup and optional tooling you can enable when you need it.

[![npm version](https://img.shields.io/npm/v/create-alistt69-kit.svg)](https://www.npmjs.com/package/create-alistt69-kit)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.18-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

---

## ✨ Overview

`create-alistt69-kit` is a project scaffolding tool for quickly creating a modern frontend app without burning time on repetitive setup.

It generates a ready-to-run **React + TypeScript + Webpack** starter with a practical baseline and optional extras you can turn on when needed.

## 🔧  What’s inside

| Tool | Purpose                          | Included |
|------|----------------------------------|----------|
| [React](https://react.dev/) | Web framework                    | Default  |
| [TypeScript](https://www.typescriptlang.org/) | Static typing                    | Default  |
| [Webpack](https://webpack.js.org/) | Bundling and build pipeline      | Default  |
| [SCSS Modules](https://github.com/css-modules/css-modules) | Scoped styling                   | Default  |
| [SVGR](https://react-svgr.com/) | Import SVGs as React components  | Default  |
| [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) | Bundle size inspection           | Default  |
| [ESLint](https://eslint.org/) + [eslint-stylistic](https://eslint.style/) | Code quality and stylistic rules | Optional |
| [Stylelint](https://stylelint.io/) | Stylesheet linting               | Optional |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | Automatic CSS vendor prefixes    | Optional |
| [React Router](https://reactrouter.com/) | Client-side routing              | Optional |

---

## 🎯 Why use it?

Setting up a frontend project from scratch usually means repeating the same stuff every time:

- webpack config
- TypeScript config
- style handling
- routing
- linters
- folder structure

This starter removes that boilerplate so you can get straight to building.

---

## 📦 Requirements

- **Node.js** `18.18` or higher
- **npm**, **pnpm**, or **yarn**

---

## 🔥 Quick start

Create a new app interactively:

```bash
npm create alistt69-kit@latest
```

Follow the prompts — or skip them entirely:

```bash
npm create alistt69-kit@latest my-app -- -- --defaults
```

## 🛠️  Usage examples

```bash
# Interactive setup
npm create alistt69-kit@latest my-app

# All defaults, no prompts
npm create alistt69-kit@latest my-app -- -- --defaults

# Skip dependency installation
npm create alistt69-kit@latest my-app -- -- --no-install

# Enable only selected features
npm create alistt69-kit@latest my-app -- -- --features=eslint,react-router

# Enable all optional features
npm create alistt69-kit@latest my-app -- -- --features=all

# Use pnpm as package manager
npm create alistt69-kit@latest my-app -- -- --pm pnpm

# Overwrite existing directory
npm create alistt69-kit@latest my-app -- -- --defaults --overwrite
```

## ⚙️ CLI options

| Option | Alias  | Description |
|--------|--------|-------------|
| `--defaults` | `-def` | Skip prompts, use defaults |
| `--overwrite` | —      | Overwrite target directory if it exists |
| `--no-install` | —      | Skip dependency installation |
| `--features <list>` | —      | Enable specific features (`eslint`, `react-router`, `all`) |
| `--pm <name>` | —      | Choose package manager (`npm`, `pnpm`, `yarn`) |
| `--help` | `-h`   | Show help |

## 🧪 Default behavior

- All features are enabled by default
- Package manager: `npm` (can be overridden with `--pm`)
- Dependencies are installed automatically (skip with `--no-install`)

## 📄 License

MIT — free and open for everyone.
