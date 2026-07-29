const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// The git root is one level up; ensure Metro watches this app folder (including node_modules).
config.watchFolders = [projectRoot];

// Avoid stale/incorrect file maps when Watchman watches the parent repo instead of this app.
config.watcher = {
  ...config.watcher,
  useWatchman: false,
};

module.exports = config;
