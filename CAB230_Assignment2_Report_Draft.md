# CAB230 Assignment 2 - Client Side React Application Report Draft

Student name: `<student name>`
Student number: `<student number>`
Application: CAB230 Rentals API - Client Side Application

## Introduction

### Purpose and Description

This application is a client-side React single-page application for exploring the CAB230 Rentals API. It allows users to search rental properties, inspect individual property details, view rental locations on a map, register and log in, submit ratings, and review the rentals they have previously rated.

The implementation focuses on the Assignment 2 high functionality requirements. The rental search page exposes all documented search filters, uses server-side sorting and pagination, and includes a map view for the currently loaded result window. The detail page combines property information, location data, nearby rentals, and authenticated rating functionality. The authentication flow stores the JWT token in browser local storage and protects the rated rentals page from unauthenticated access.

Screenshot placeholders:

- Home page with hero and navigation.
- Rental search page with filters, table results, and map.
- Rental detail page with property details and rating controls.

### Completeness and Limitations

The implemented application uses every endpoint required by the Assignment 2 specification: rentals lookup endpoints, rental search, rental detail, authentication, rating retrieval, and rating submission. The main user workflows are complete: public users can search and view rentals; authenticated users can rate rentals and view their rated rentals.

The main limitation is that the report screenshots must still be inserted into the provided DOCX template before exporting to PDF. The application also depends on the remote CAB230 API being available. If the API is offline or returns an error, the UI displays a user-facing error message rather than silently failing.

## Use of Endpoints

### GET `/rentals/states`

Used on the Rental Search page to populate the State dropdown. The API returns an object with a `value` array, so the application normalises this response before rendering the options.

Relevant code: `src/api/rentalsApi.js`, `src/pages/RentalSearch.jsx`

Screenshot placeholder: State dropdown in the Rental Search form.

### GET `/rentals/property-types`

Used on the Rental Search page to populate the Property Types multi-select filter. Multiple selected property types are sent to the search API as repeated query parameters.

Relevant code: `src/api/rentalsApi.js`, `src/pages/RentalSearch.jsx`

Screenshot placeholder: Property Types multi-select.

### GET `/rentals/search`

Used for the main search workflow. The UI supports suburb, state, postcode, rent range, bedroom range, bathroom range, parking range, property types, rating range, sort field, sort order, and pagination. The results table shows 15 rows per UI page and maps those UI pages to the API's 10-row backend pages.

Relevant code: `src/pages/RentalSearch.jsx`

Screenshot placeholder: Search page showing filters, sorted results, and map.

### GET `/rentals/{id}`

Used on the Rental Detail page and on the Rated Rentals page. The detail page shows full property information, amenities, agency, rating summary, description, location map, and nearby rentals from the same postcode.

Relevant code: `src/pages/RentalDetail.jsx`, `src/pages/RatedRentals.jsx`

Screenshot placeholder: Rental detail page.

### GET `/ratings`

Used on the protected Rated Rentals page after login. The page lists the authenticated user's ratings, then fetches the corresponding rental details for each rating so the table is meaningful to the user.

Relevant code: `src/api/ratingsApi.js`, `src/pages/RatedRentals.jsx`

Screenshot placeholder: Rated Rentals page after logging in.

### GET `/ratings/rentals/{id}`

Used on the Rental Detail page to load the current user's existing rating for the selected rental. If no rating exists, the UI leaves the rating controls unselected.

Relevant code: `src/pages/RentalDetail.jsx`

Screenshot placeholder: Detail page showing an existing selected rating.

### POST `/ratings/rentals/{id}`

Used on the Rental Detail page to submit or update the authenticated user's rating. After a successful submission, the application reloads the rental detail so the rating summary is refreshed.

Relevant code: `src/api/ratingsApi.js`, `src/pages/RentalDetail.jsx`

Screenshot placeholder: Rating success message.

### POST `/user/register`

Used on the Register page. The form validates email, password length, and password confirmation before calling the API.

Relevant code: `src/api/authApi.js`, `src/pages/Register.jsx`

Screenshot placeholder: Register page.

### POST `/user/login`

Used on the Login page. On success, the app stores the JWT token, email, and expiry time in local storage through the auth context. Protected routes then use that auth state.

Relevant code: `src/api/authApi.js`, `src/context/AuthProvider.jsx`, `src/pages/Login.jsx`

Screenshot placeholder: Login page and authenticated navbar.

## Modules Used

### React Router

Used to implement the single-page application routes and protected authenticated pages.

Docs: https://reactrouter.com/

### React Bootstrap and Bootstrap

Used for layout, forms, buttons, cards, alerts, navigation, badges, tables, and responsive grid behaviour.

Docs: https://react-bootstrap.github.io/ and https://getbootstrap.com/

### AG Grid

Used on the Rental Search page for a high-quality data grid with infinite row loading, sorting, column resizing, and server-backed pagination.

Docs: https://www.ag-grid.com/react-data-grid/

### Pigeon Maps

Used to display rental locations without requiring a paid mapping API key.

Docs: https://github.com/mariusandra/pigeon-maps

### Vite

Used as the development server and production build tool.

Docs: https://vite.dev/

## Application Design

### Navigation and Layout

The application uses a persistent top navigation bar with links to Home, Rental Search, Register, Login, and Rated Rentals. Rated Rentals is only shown when the user is authenticated. This keeps the public workflow simple while making the authenticated workflow visible after login.

The Home page acts as a clear entry point but does not replace the actual application. The Rental Search page is the main work area, with filters at the top, a large results grid, and a map panel beside it on larger screens. The Rental Detail page uses a two-column layout for property information and rating controls, then places the map below for location inspection.

### Usability and Quality of Design

The interface is designed around repeated rental comparison rather than a marketing-style landing page. Controls match the type of data they collect: selects for state and sorting, a multi-select for property types, numeric inputs for ranges, buttons for commands, and a table/grid for dense result comparison.

The main usability strengths are:

- Search filters are grouped into basic and advanced sections so the page is not visually overloaded.
- AG Grid supports sorting, resizing, and incremental loading for large search result sets.
- Detail pages avoid raw HTML injection and present API description text as readable paragraphs.
- Error, loading, empty, and success states are visible to the user.
- Authenticated-only functionality is protected and unauthenticated users are prompted to log in.

Possible improvements:

- Add saved searches or favourite rentals.
- Add clearer map clustering if many markers are shown.
- Add automated end-to-end tests for the login and rating workflows.
- Add richer accessibility testing with a screen reader and keyboard-only test pass.

### Accessibility

The design uses semantic headings, labelled form controls, standard buttons, and standard table headers. Images include alt text, and information is not conveyed by colour alone because badges and text labels are used alongside colour changes. The app remains readable without relying on decorative images.

Accessibility strengths:

- Forms use visible labels.
- Tables include header cells.
- Loading and error states are rendered as text.
- The app uses simple language and consistent navigation.
- The application avoids flickering content and heavy animation.

Accessibility limitations and future improvements:

- The map markers should be supplemented with a fully keyboard-accessible list of mapped results.
- The AG Grid should be tested with keyboard navigation and screen reader output.
- Colour contrast should be formally checked with an accessibility audit tool.
- The application could include an Acknowledgement of Traditional Owners if the context of the deployed site makes that appropriate.
- Further consultation would be needed to ensure imagery, language, and interaction choices do not exclude or misrepresent Aboriginal and Torres Strait Islander users.

## Technical Description

### Architecture

The source code is split by responsibility:

- `src/api`: Small API wrapper functions for authentication, rentals, ratings, and shared request handling.
- `src/context`: Authentication context and provider for storing login state.
- `src/components`: Reusable UI components such as the navbar, protected route, map, loading, and error messages.
- `src/pages`: Route-level pages for home, login, registration, search, detail, and rated rentals.
- `src/utils`: Formatting helpers for money, ratings, dates, property types, and rental descriptions.

The application starts in `src/main.jsx`, renders `App.jsx`, and uses React Router to map routes to pages. API access is centralised through `apiRequest`, which attaches the bearer token when available, builds query strings, parses JSON responses, and throws consistent errors.

Authentication is handled by `AuthProvider`. On login, the token and expiry time are saved in local storage. On app load, expired auth data is removed. `ProtectedRoute` redirects unauthenticated users to the login page.

### Test Plan

| Test case | Steps | Expected result | Result |
| --- | --- | --- | --- |
| Home page loads | Open `/` | Home page, navbar, and action buttons render | Pass |
| Search basic rentals | Open `/rentals` | Results grid loads rentals from API | Pass |
| Search with filters | Choose state, property type, rent range, and submit | Results update based on selected filters | Pass |
| Search sorting | Choose Sort By and Sort Order or sort a grid column | API results are sorted server-side | Pass |
| Detail page | Click a rental row | Rental detail, description, metrics, and map render | Pass |
| Register validation | Submit mismatched passwords | Form blocks submission and shows error | Pass |
| Register API | Submit valid new email/password | API account is created or API validation error is shown | Pass |
| Login success | Log in with valid account | Token is stored and protected navigation appears | Pass |
| Login failure | Log in with invalid credentials | Error message is shown | Pass |
| Submit rating | Log in, open rental, select rating, submit | Success message appears and rental rating refreshes | Pass |
| Rated rentals | Open `/rated` while logged in | Table displays rated rentals and pagination | Pass |
| Protected route | Open `/rated` while logged out | User is redirected to `/login` | Pass |
| API unavailable | Disable network or API unavailable | User-facing error message is shown | Pass |

Validation commands run locally:

```bash
npm run lint
npm run build
git diff --check
```

## Difficulties, Exclusions, and Unresolved Errors

The main difficulty was matching the Swagger documentation with the actual API response shapes. The lookup endpoints return `{ value: [...] }`, so the app normalises those responses before rendering dropdowns. The property type array parameter also needed to be tested against the live API; the API accepts repeated property type query values.

No unresolved runtime errors are known at the time of this draft. The production build produces a Vite chunk size warning because AG Grid is a large dependency. This is a performance warning rather than a build failure. Future work could lazy-load the Rental Search page or split AG Grid into a separate chunk.

## Extensions

Potential future improvements include:

- Saved searches for authenticated users.
- Favourite rentals separate from ratings.
- Map marker clustering and a keyboard-accessible map result list.
- End-to-end tests with Playwright.
- Lazy-loaded route chunks to reduce the initial JavaScript bundle.
- More detailed accessibility audit and remediation.

## User Guide

1. Open the app and use the navigation bar to move between pages.
2. Select Rental Search to find rental properties.
3. Use the basic filters for suburb, state, postcode, and property type.
4. Open Advanced Search to filter by rent, bedrooms, bathrooms, parking, rating, and sorting.
5. Click Search to refresh the results.
6. Scroll the grid to load more results from the server.
7. Click a result row to open the Rental Detail page.
8. Review the property information, amenities, rating summary, and map.
9. Register an account from the Register page if you do not already have one.
10. Log in to access rating functionality.
11. On a Rental Detail page, select a rating from 1 to 5 and submit it.
12. Use Rated Rentals to review properties you have previously rated.
13. Use Log Out when finished.

## References

- React Router. https://reactrouter.com/
- React Bootstrap. https://react-bootstrap.github.io/
- Bootstrap. https://getbootstrap.com/
- AG Grid React Data Grid. https://www.ag-grid.com/react-data-grid/
- Pigeon Maps. https://github.com/mariusandra/pigeon-maps
- Vite. https://vite.dev/
- W3C Web Content Accessibility Guidelines checklist. https://www.w3.org/TR/WAI-WEBCONTENT/full-checklist
