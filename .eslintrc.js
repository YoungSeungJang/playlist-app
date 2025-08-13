module.exports = {
  root: true,
  // This tells ESLint to load the config from the package directory
  extends: ['@repo/eslint-config/base.js'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
}