// Release Notes page constants and configurations

// API and File Paths
export const CHANGELOG_PATH = '/CHANGELOG.md';

// Regex Patterns
export const VERSION_REGEX = /## (\d+\.\d+\.\d+) \(([^)]+)\)/g;
export const VERSION_SECTION_REGEX = /(?=## \d+\.\d+\.\d+ \([^)]+\))/g;
export const VERSION_VALIDATION_REGEX = /^\d+\.\d+\.\d+$/;

// Category Configurations
export const CATEGORY_CONFIG = {
  Added: { class: 'text-green-400', emoji: '✨ ' },
  Enhanced: { class: 'text-blue-400', emoji: '🚀 ' },
  Fixed: { class: 'text-amber-400', emoji: '🔧 ' },
  Dependencies: { class: 'text-purple-400', emoji: '📦 ' },
  Removed: { class: 'text-red-400', emoji: '🗑️ ' },
  Chore: { class: 'text-gray-400', emoji: '🧹 ' },
};

export const DEFAULT_CATEGORY = { class: 'text-cyan-400', emoji: '' };

// Release Type Badge Styles
export const BADGE_STYLES = {
  Major: 'bg-amber-900/30 text-amber-300 border border-amber-800/50',
  Minor: 'bg-blue-900/30 text-blue-300 border border-blue-800/50',
};
