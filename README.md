# MARS

Meeting Area Reservation System, a web application for managing meeting rooms and reservations.
Built with [SolidStart](https://docs.solidjs.com/solid-start/) and [SolidJS](https://docs.solidjs.com/).

## Developing

Clone the project and install dependencies with `pnpm install`, start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `pnpm build` will generate a Node app that you can run with `pnpm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

## Guide

### Installing PNPM

If you don't have PNPM installed, you can install it globally using corepack:

```bash
npm install --global corepack@latest

corepack enable pnpm
```

or you can use npm:

```bash
npx pnpm@latest-10 dlx @pnpm/exe@latest-10 setup

# or
npm install -g pnpm@latest-10
```

full guide: https://pnpm.io/installation