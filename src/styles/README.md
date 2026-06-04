# CSS Structure

All React CSS is still imported globally from `src/main.tsx`. This keeps the current app behavior stable while making the cascade order and ownership clearer.

## Import Order

1. Base and shared layout
   - `../styles.css`
   - `layout.css`
2. Shared components
   - `movie-card.css`
3. Page styles
   - `home.css`
   - `movie-list.css`
   - `movie-detail.css`
   - `booking.css`
   - `payment.css`
   - `complete.css`
   - `history.css`
   - `support.css`
   - `admin.css`
   - `auth.css`
4. Legacy compatibility
   - `legacy-overrides.css`

`legacy-overrides.css` must stay last so React page styles can safely correct conflicts from `/public/css/style.css` and `/public/css/home-cinema.css`.

## File Roles

- `styles.css`: global tokens, common buttons, PageHero, and base UI rules.
- `layout.css`: Header, Footer, account nav, and layout chrome.
- `movie-card.css`: shared MovieCard/card metadata styles used by home and catalog views.
- `home.css`: home page styles.
- `movie-list.css`: movie catalog/list page styles.
- `movie-detail.css`: movie detail page styles.
- `booking.css`: quick booking page styles.
- `payment.css`: payment page styles.
- `complete.css`: booking completion page styles.
- `history.css`: booking history page styles.
- `support.css`: support/customer center page styles.
- `admin.css`: admin page styles.
- `auth.css`: login and signup page styles.
- `legacy-overrides.css`: conflict fixes only for public legacy CSS. This file must be imported last.

## Rules For Future CSS Changes

- Put page-only rules in that page's CSS file.
- Put shared component rules in the component-specific CSS file.
- Scope page rules under the page root class where possible.
- Use `legacy-overrides.css` only to correct conflicts from public legacy CSS.
- Do not add new product design work to `legacy-overrides.css`.
- Use `!important` only when it is needed to beat existing legacy CSS, and keep it minimal.
- Do not remove or rewrite `public/css/style.css` or `public/css/home-cinema.css` as part of routine React CSS cleanup.
- Keep `legacy-overrides.css` as the final CSS import in `src/main.tsx`.
