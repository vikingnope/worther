# Changelog

## 1.1.0 (Major)

### Added

- Version history to changelog with auto-scroll functionality
- ESLint & Prettier (Ignores `pnpm-lock.yaml`)
- Workflow for milestone adder/checker
- Workflow for dependabot to auto update changelog (adjusted PR title)
- Trim to cities in weather submits
- Option to run PR check workflow with command by repo owner
- Day/night cycle layer
- A bunch of missing time zones which have slight variations of the normal ones
- React Compiler

### Enhanced

- Migrated to Vite from deprecated Create React App (CRA)
- Major design changes throughout all pages to a more modern UI (new colours, new icons, new search functionality, better error handling, etc...)
- Upgraded to `TailwindCSS` v4
- Changed branding (Changed logo and added banner)
- Updated README
- Changed light layer to be coloured
- Moved menuBar to mapElements
- Updated workflow labeller to update ui titles to ui/ux instead of ui
- Updated dependabot to run daily
- Enhanced auto-approver to not allow review again for nothing if already approved
- Moved multiple workflows into one file for better workflow organisation
- Convert issue templates to YAML from Markdown for better readability and configuration
- Updated automatic changelog to wrap package versions in backticks
- Enhanced PR checker to resolve existing issues and automatically add a detailed PR comment with status
- Changed beach recommendations logic to not be hard coded
- Changed time zone logic to not be hard coded

### Chore

- Moved weather constants to their own constants file

### Fixed

- Title labeller not recognising '/'
- Vercel 404 Page showing instead of custom 404 page
- Data inaccuracies in logic calculation in daily weather page
- Chore report template not being read due to error
- Issue with Dependabot PRs not getting status from PR Checks workflow

### Removed

- Coderabbit config (created workflow to auto-approve dependabot PRs and to approve PRs based on comment from repo owner)
- Redundant testing libraries
- All old branding
- `postcss` and `@tailwindcss/postcss` since they are not needed with Vite
- Extra memoisation due to React Compiler handling most of it now

### Dependencies

- Added `babel-plugin-react-compiler` v1.0.0
- Bump `tailwindcss` to v4.1.17
- Bump `eslint` to v9.39.1
- Bump `react-router-dom` to v7.9.6
- Bump `vite` to v7.2.2
- Bump `@vitejs/plugin-react` to v5.1.1
- Bump `eslint-config-prettier` to v10.1.8
- Bump `axios` to v1.13.2
- Bump `@emotion/styled` to v11.14.1
- Bump `react` to v19.2.0
- Bump `react-dom` to v19.2.0
- Bump `react-select` to v5.10.2
- Bump `@eslint/js` to v9.39.1
- Bump `@tailwindcss/vite` to v4.1.17
- Bump `eslint-plugin-import` to v2.32.0
- Bump `prettier` to v3.6.2
- Bump `@joergdietrich/leaflet.terminator` to v1.3.0
- Bump `eslint-plugin-react-hooks` to v7.0.1

---

## 1.0.8 (Minor)

### Added

- Smoke icon
- Dust icon
- Automated changelog checker to ensure changelog updates in pull requests
- CodeRabbit config with auto review for bot PRs
- Subdomains to main map layers (improved performance slightly)
- Dynamic changing of background colour on map page
- Separate function to calculate sunrise and sunset times
- Chore report on github

### Enhanced

- Daily Weather page to display averaged weather metrics (precipitation, humidity, wind) across all data points
- Better error handling
- Minor design changes
- Changelog checker to check for bot PRs including removal of changelog labels for bot PRs
- Automatic PR labeler to also do automatic PR title prefixing
- Removed `react-device-detect` package and started using tailwind sizing instead to make pages more seamless when resizing between large displays and smaller displays
- Changed Satellite Layer to be a Hybrid Satellite Layer
- Overhauled most of dark mode in Map section
- PR template to include linked issues
- 3-Hour Forecast layout
- Changed timezone to map instead of ternary operators
- Header button loading times
- Route loading times
- Multiple memoisation throughout to prevent unnecessary re-renders
- Optimised mobile dropdown and added animation to it
- Changed popup in map section to display useful weather data instead of just a link
- Merged advanced and normal weather display into one
- Changed fixes to resolves in PR template
- Styling changes 3-hour Forecast page
- Changed package manager to pnpm

### Fixed

- Sunrise/sunset time calculations to properly handle fractional timezone offsets (e.g., UTC+5:30 for Mumbai)
- Key index errors in mobile dropdown and header
- Opacity bar not being draggable
- Bug with icon not showing as night on Single 3 Hour Forecast page
- Alignment of divs in 3-Hour Forecast page
- Loading not showing on Single 3-Hour forecast page

### Dependencies

- Bump `react` & `react-dom` from v19.0.0 to v19.1.0

---

## 1.0.7 (Minor)

### Added

- Precipitation to 3 Hour Forecast and daily forecast

### Enhanced

- Styling changes in multiple pages to make theme more consistent
- Linting and optimisation
- Adjusted styling for multiple pages on mobile

### Fixed

- Issue with footer not being shown directly on some pages but needing to scroll down instead

### Removed

- Night layer due to its package being outdated

### Dependencies

- Updated to React 19

---

## 1.0.6 (Minor)

### Enhanced

- Changed layout of recommendations text boxes
- Design changes throughout

### Fixed

- Data not being loaded on hard refresh in recommendations
- Opacity bar clickable issue (workaround)

### Dependencies

- Security updates

---

## 1.0.5 (Minor)

### Added

- Changelog to website (can be found at bottom right of footer)

### Enhanced

- Changed map to have a button for dark mode and light mode

---

## 1.0.4 (Minor)

### Dependencies

- Updated packages for greater security

---

## 1.0.3 (Minor)

### Enhanced

- Design changes

---

## 1.0.2 (Major)

### Added

- Satellite layer
- Beach recommendations page
- Border to header image
- Max zoom for layers
- Wind beaufort scale
- Windy icons
- Night icons
- Rain info
- Daily weather
- Analytics

### Enhanced

- Updated version in about
- Readded outline to night layer
- Changed 3 hour weather to 3 hour forecast
- Changed home page styling
- Small styling updates

### Fixed

- Bug fixes

### Dependencies

- Updated dependencies for better security

---

## 1.0.1 (Minor)

### Enhanced

- Rename of some files
- Update version in about page
- Changed marker icon
- Arranged syntax of some files
- Updated images in map file

### Fixed

- Marker not staying in correct location
- Location of popup

---

## 1.0.0 (Major)

### Added

- Rain radar layer
- Wind radar layer
- Temperature radar layer
- Cloud radar layer
- Axios to call APIs
- Discord to readme file
- Weather page including dynamic weather page to run api according to city input
- Advanced weather page to search with country as well as city
- Loading screen in weather
- 3 Hour Weather Data
- Search with location on weather
- Menu in map, light mode and dark mode, including opacity bar, layer toggle
- Custom nav bar for mobile
- Option to search for weather with map marker
- Icons in header
- API blocked page
- Option to view each 3 hour weather data

### Enhanced

- Changed logo
- Reduced lines of code for more efficiency
- Changed index.html description
- Changed structure of code to make code more efficient in javascript & html
- Made marker more efficient to be faster
- Organised files
- Changed all javascript react files to .jsx
- Different titles to different pages
- Changed .css files to .scss
- Header now has custom buttons for each page
- Updated about page with more information and hyperlinks for APIs and tools
- Updated favicon to be rounded
- Hid Open Weather API key using environment variables

### Fixed

- Alignment of elements on pages

### Dependencies

- Updated to react version 18.2.0

---

## 0.0.1 (Minor)

### Added

- First release of the website which shows only the about page and the main page