# Precommit Hooks and Build Automation

This repository now includes precommit hooks and automatic build processes

## Setup

The following tools have been configured:

- **Husky**: Git hooks management
- **lint-staged**: Run linters on staged files
- **Biome**: Unified linter and formatter
- **tsup**: Build tool for packages

## Available Scripts

### Root Level Scripts
- `pnpm build` - Build all packages using the root tsup config
- `pnpm build:packages` - Build all packages individually
- `pnpm lint` - Lint all files with Biome
- `pnpm lint:fix` - Fix linting issues with Biome
- `pnpm format` - Format all files with Biome
- `pnpm format:check` - Check formatting with Biome
- `pnpm version:patch` - Bump patch version and trigger build
- `pnpm version:minor` - Bump minor version and trigger build
- `pnpm version:major` - Bump major version and trigger build

### Package Level Scripts
Each package (`web`, `sanity`, `sitemap`) has its own `build` script that uses tsup.

## Git Hooks

### Pre-commit Hook
- Runs `lint-staged` to check and fix code quality issues
- Runs Biome check/format on staged files

### Post-version Hook
- Automatically builds all packages when a new version is published
- Commits the built files to the version commit
- Ensures published packages include the latest build artifacts

## Usage

### Normal Development
1. Make your changes
2. Stage files with `git add`
3. Commit with `git commit` - precommit hooks will run automatically

### Publishing New Versions
1. Use `pnpm version:patch`, `pnpm version:minor`, or `pnpm version:major`
2. The postversion hook will automatically build and commit the built files
3. Push the changes to publish

### Manual Builds
- Run `pnpm build:packages` to build all packages
- Run `pnpm build` in individual package directories to build specific packages

## Configuration Files

- `.husky/pre-commit` - Precommit hook script
- `.husky/post-version` - Postversion hook script
- `biome.json` - Biome configuration
- `tsup.config.ts` - Root build configuration
- `packages/*/tsup.config.ts` - Individual package build configurations
