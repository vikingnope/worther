## 1.1.0 (Major)

- Bumped version to 1.1.0
- Migrated to Vite from deprecated Create React App (CRA)
- Updated workflow labeller to update ui titles to ui/ux instead of ui
- Fixed title labeller not recognising '/'
- Fixed Vercel 404 Page showing instead of custom 404 page
- Major design changes throughout all pages to a more modern UI (new colours, new icons, new search functionality, better error handling, etc...)
- Upgraded to `TailwindCSS` v4
- Added version history to changelog with auto-scroll functionality
- Fixed data inaccuracies in logic calculation in daily weather page
- Changed branding (Changed logo and added banner)
- Updated README
- Added workflow for milestone adder/checker
- Changed light layer to be coloured
- Moved menuBar to mapElements
- Added trim to cities in weather submits
- Added ESLint & Prettier (Ignores `pnpm-lock.yaml`)
- Updated `react-router-dom` to 7.5.2 to resolve security vulnerability
- Removed coderabbit config and created workflow to auto-approve dependabot PRs and to approve PRs based on comment from repo owner
- Updated dependabot to run daily
- Removed redundant testing libraries
- Bump `TailwindCSS` v4.1.4
- Created workflow for dependabot to auto update changelog (adjusted PR title)
- Enhanced auto-approver to not allow review again for nothing if already approved
- Bump dependency `react-router-dom` from 7.5.2 to 7.5.3
- Moved multiple workflows into one file for better workflow organisation
- Convert issue templates to YAML from Markdown for better readability and configuration
- Updated automatic changelog to wrap package versions in backticks
- Fixed chore report template not being read due to error
- Fixes issue with Dependabot PRs not getting status from PR Checks workflow
- Added option to run PR check workflow with command by repo owner
- Removed all old branding
- Bump dev dependency `@eslint/js` from 9.25.1 to 9.26.0

---

## 1.0.8 (Minor)

- Enhanced the Daily Weather page to display averaged weather metrics (precipitation, humidity, wind) across all data points
- Fixed sunrise/sunset time calculations to properly handle fractional timezone offsets (e.g., UTC+5:30 for Mumbai)
- Added smoke icon
- Better error handling
- Minor design changes
- Added automated changelog checker to ensure changelog updates in pull requests
- Fixed key index errors in mobile dropdown and header
- Enhanced the changelog checker to check for bot PRs including removal of changelog labels for bot PRs
- Added CodeRabbit config with auto review for bot PRs
- Enhanced automatic PR labeler to also do automatic PR title prefixing
- Removed `react-device-detect` package and started using tailwind sizing instead to make pages more seamless when resizing between large displays and smaller displays
- Changed Satellite Layer to be a Hybrid Satellite Layer
- Added subdomains to main map layers, seems to have improved performance slightly
- Overhauled most of dark mode in Map section
- Enhanced PR template to include linked issues
- Added dynamic changing of background colour on map page
- Enhanced 3-Hour Forecast layout
- Changed timezone to map instead of ternary operators
- Added separate function to calculate sunrise and sunset times
- Added dust icon
- Fixed opacity bar not being draggable
- Improvements to header button loading times
- Improvements to route loading times
- Multiple memoisation throughout to prevent unnecessary re-renders
- Optimised mobile dropdown and added animation to it
- Changed popup in map section to display useful weather data instead of just a link
- Merged advanced and normal weather display into one
- Fixed bug with icon not showing as night on Single 3 Hour Forecast page
- Changed fixes to resolves in PR template
- Bump react & react-dom from 19.0.0 to 19.1.0
- Actually fixed bug with icon not showing as night on Single 3 Hour Forecast page
- Fixed alignment of divs in 3-Hour Forecast page
- Fixed loading not showing on Single 3-Hour forecast page
- Styling changes 3-hour Forecast page
- Changed package manager to pnpm
- Added chore report on github

---

## 1.0.7 (Minor)

- Added precipitation to 3 Hour Forecast and daily forecast
- Styling changes in multiple pages to make theme more consistent
- Linting and optimisation
- Adjusted styling for multiple pages on mobile
- Removed night layer due to its package being outdated
- Fixed issue with footer not being shown directly on some pages but needing to scroll down instead
- Updated to React 19

---

## 1.0.6 (Minor)

- Changed layout of recommendations text boxes
- Fix for data not being loaded on hard refresh in recommendations
- Workaround for opacity bar clickable issue.
- Design changes throughout
- Security updates

---

## 1.0.5 (Minor)

- Changed map to have a button for dark mode and light mode
- Added changelog to website (can be found at bottom right of footer)

---

## 1.0.4 (Minor)

- Updated packages for greater security

---

## 1.0.3 (Minor)

- Design changes

---

## 1.0.2 (Major)

- Added satellite layer
- Updated version in about
- Readded outline to night layer
- Added beach recommendations page
- Added border to header image
- Added max zoom for layers
- Added wind beaufort scale
- Added windy icons
- Added night icons
- Added rain info
- Added daily weather
- Changed 3 hour weather to 3 hour forecast
- Changed home page styling
- Small styling updates
- Updated dependencies for better security
- Added analytics
- Bug fixes

---

## 1.0.1 (Minor)

- Rename of some files
- Update version in about page
- Fixed marker not staying in correct location
- Fixed location of popup
- Changed marker icon
- Arranged syntax of some files
- Updated images in map file

---

## 1.0.0 (Major)

- Changed logo
- Added rain radar layer
- Added wind radar layer
- Added temperature radar layer
- Added cloud radar layer
- Added Axios to call APIs
- Updated to react version 18.2.0
- Reduced lines of code for more efficiency
- Changed index.html description
- Added Discord to readme file
- Changed structure of code to make code more efficient in javascript & html
- Made marker more efficient to be faster
- Organised files
- Changed all javascript react files to .jsx
- Different titles to different pages
- Changed .css files to .scss
- Fixed alignment of elements on pages
- Header now has custom buttons for each page
- Added weather page including dynamic weather page to run api according to city input
- Added advanced weather page to search with country as well as city
- Added loading screen in weather
- Updated about page with more information and hyperlinks for APIs and tools
- Added 3 Hour Weather Data
- Added search with location on weather
- Added menu in map, light mode and dark mode, including opacity bar, layer toggle
- Custom nav bar for mobile
- Added option to search for weather with map marker
- Added icons in header
- Added API blocked page
- Updated favicon to be rounded
- Added option to view each 3 hour weather data
- Hid Open Weather API key using environment variables

---

## 0.0.1 (Minor)

- This is the first release of the website which shows only the about page and the main page, will have new uploads in the future.
