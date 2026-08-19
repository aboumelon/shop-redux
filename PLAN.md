# MultiShop modernization plan

## Purpose and guardrails

This document records the Phase 0 audit performed on 2026-08-19. Phase 0 changes
documentation only; no application source, dependency, configuration, or asset was
changed. The existing visual design and the three working route shapes are the
baseline to preserve during the first migration.

## Verified current state

### Repository and tooling

- The application is a Create React App project using React 18.2, TypeScript 4.9,
  React Router 6.6, and `react-scripts` 4.0.3. Redux and Redux Toolkit are not
  installed.
- The package scripts expose CRA `start`, `build`, `test`, and `eject` commands.
  There are no separate lint, formatting, or type-check scripts.
- TypeScript is in strict mode, but its target is ES5, JavaScript input is allowed,
  library checking is skipped, and the configuration otherwise reflects the CRA
  defaults rather than a modern Vite application.
- No `AGENTS.md` exists in the repository or its parent workspace.
- IDE metadata under `.idea/` is tracked. This is not needed by the application and
  should be removed from version control in Phase 1, then ignored.

### Application structure and routing

- `src/index.tsx` mounts one `BrowserRouter`; `src/App.tsx` defines a shared
  `Layout` with `/`, `/shop`, and `/shop/:id` routes.
- There is no catch-all/404 route. Any value in the product `:id` segment renders
  the same static detail screen because the route parameter is never read.
- The source contains about 2,096 lines across 70 tracked files. Components are
  separated by visual element, but page-specific and globally reusable concerns
  are mixed in one broad `components/` directory. The current size does not justify
  a sweeping rewrite.
- Confirmed misspellings include `tamplate/`, `components/prouduct-info/`, and
  `components/multy-shop-icon/`. These should become `template/`, `product-info/`,
  and `multi-shop-icon/` only where the retained files remain useful.

### Data and state

- Home and shop product arrays are hard-coded in page data modules. Items have no
  stable product identifier, category, description, inventory, variant model, or
  API provenance; most names and prices are repeated placeholder values.
- Product detail content, gallery, reviews, sizes, and colors are static and are not
  selected from the route parameter.
- There is no Redux store, Context-based domain store, API client, or persistence.
  The only meaningful state found is local presentation state for dropdowns and the
  hero carousel.
- Search, filtering, sorting, pagination, view toggles, product actions, quantity
  controls, review submission, newsletter signup, and add-to-cart are visual-only.
  Many use empty or root links, so activating them can navigate or reload instead
  of completing an action.

### Styling, assets, and template duplication

- The interface is derived from the MultiShop Bootstrap template. Global compiled
  Bootstrap/custom CSS and Owl Carousel/animation assets are served from `public/`;
  Font Awesome and Google Fonts are loaded from third-party CDNs.
- The same 28 image files exist in `src/assets/img`, `public/assets/img`, and
  `tamplate/img` (three byte-identical copies each). At least 115 relative file paths
  overlap between `public/` and `tamplate/`. The complete original static template,
  Bootstrap SCSS source, compiled CSS, and JavaScript libraries are retained even
  though React owns the rendered UI.
- Asset paths are written as relative strings such as `../assets/...`; they resolve
  through the public copy rather than type-checked module imports and can be brittle
  on nested routes or non-root deployments.
- The legacy `public/js/main.js` is not loaded by `public/index.html`; Bootstrap and
  Owl behavior represented by its data attributes/classes therefore cannot be
  assumed to work. Some carousel-like components render repeated markup without an
  initialized carousel library.

### Current behavior, responsiveness, and accessibility

- The existing CSS contains Bootstrap responsive utilities and grid breakpoints, so
  the layout has a responsive foundation. This audit did not certify every viewport
  visually; responsive route smoke tests should be captured before and after Phase
  1.
- Numerous images have empty alternative text, including product images that convey
  product identity. Icon-only links and buttons lack accessible names.
- Several interactive elements use anchors for actions, `href="#"`, empty `href`,
  or root navigation. Buttons frequently omit `type="button"`; search has no label;
  filter groups lack semantic fieldsets/legends; and status feedback is absent.
- Carousel indicators are clickable list elements rather than named buttons, and
  visible dropdown behavior depends on mouse-oriented class toggling. A keyboard and
  focus audit is required.
- The HTML head has duplicate viewport/description metadata, generic CRA/template
  metadata and title, and the no-script message language does not match the declared
  English document language.

### Tests and health checks

- No test or spec files exist. CRA reports “No tests found” and exits with status 1.
- A standalone strict TypeScript check succeeds.
- A clean `npm ci` succeeds but reports many deprecated transitive packages from the
  old CRA toolchain.
- The production build fails on Node 24.15 with Webpack 4's unsupported OpenSSL hash
  algorithm (`ERR_OSSL_EVP_UNSUPPORTED`). This is an environment/toolchain
  incompatibility and a primary reason to prioritize Vite; it must not be masked by
  permanently enabling the legacy OpenSSL provider.
- The registry security audit endpoint returned HTTP 403, so dependency vulnerability
  status could not be verified in this environment.

## Recommended architecture

Adopt a feature-oriented React application incrementally:

```text
src/
  app/                 # application entry, router, providers, later Redux store
  assets/              # one canonical set of imported static assets
  components/          # genuinely shared presentational primitives/layout
  features/
    catalog/           # catalog UI, filter model, later product API integration
    product/           # product-detail presentation
    cart/              # slice, selectors, persistence, UI (Phase 4)
    wishlist/          # slice/selectors/UI (Phase 4)
    checkout/          # form and order flow (Phase 5)
  pages/               # route-level composition only
  test/                # shared Vitest/RTL setup when tests are introduced
```

- Use Vite with a supported modern TypeScript baseline, React Router, explicit
  `typecheck`, `lint`, `format:check`, and `build` scripts.
- Keep ephemeral UI state local. Add Redux Toolkit only when server state arrives in
  Phase 2 (RTK Query requires the Redux store), then use slices only for shared
  client state in Phase 4.
- Define domain models at the feature/API boundary. Components should accept typed
  view data and should not know transport response shapes.
- Prefer a local, versioned mock API fixture during development/tests unless a public
  provider is approved and meets product/variant needs. A public API is easy to demo
  but creates availability, rate-limit, schema-change, image-host, and CORS risks.
  The final Phase 2 choice must be documented before implementation.
- Retain existing global template CSS initially to minimize visual churn. Remove only
  proven-dead assets in Phase 1, then improve semantics and accessibility alongside
  touched interactions, with the comprehensive audit reserved for Phase 6.
- Do not add path aliases until the Phase 1 move demonstrates that relative imports
  are materially impairing maintainability. If added, use one alias such as `@/`
  configured consistently in Vite, TypeScript, ESLint, and tests.

## Incremental implementation phases

### Phase 1 — Tooling modernization and safe cleanup

1. Create `phase/1-vite-tooling` from the accepted Phase 0 baseline.
2. Capture route and viewport baselines, then replace CRA with Vite and preserve the
   three current routes and visual behavior.
3. Modernize TypeScript settings and add explicit type-checking, ESLint, Prettier,
   and deterministic scripts. Do not add Redux or testing frameworks yet.
4. Correct misspelled retained component paths and imports. Introduce only modest
   feature-oriented moves whose ownership is already clear.
5. Prove which template/runtime files are unused; consolidate images into one
   canonical location and delete only confirmed duplicate/obsolete copies. Remove
   tracked IDE metadata and obsolete CRA artifacts.
6. Smoke-test direct navigation, desktop/mobile rendering, and the development and
   production builds. Compare screenshots to the baseline.

**Acceptance criteria**

- A clean install succeeds on the documented supported Node/npm versions.
- The Vite development server starts and `/`, `/shop`, and a representative
  `/shop/:id` route render on direct navigation without console-blocking errors.
- Production build, strict TypeScript check, ESLint, and Prettier check all pass.
- Existing visible controls behave no worse than the Phase 0 baseline, and there is
  no unrelated redesign.
- Misspelled retained paths are corrected, obsolete CRA files/dependencies are gone,
  and every deleted duplicate is demonstrably unused.
- No generated build output, local environment file, secret, or IDE metadata is
  committed.

### Phase 2 — Product API and RTK Query server state

Approve an API strategy; define product/category/variant and normalized error types;
add Redux Toolkit/store solely to host RTK Query; create an isolated product API;
connect catalog and details; and implement accessible loading, skeleton, empty,
error, and retry states. Add Vitest and React Testing Library for API/state and route
behavior. Direct product URLs must fetch the requested ID and survive refresh.

**Acceptance criteria:** catalog presentation contains no embedded product records;
direct detail routes use their ID; all network states are visible without crashing;
API cache/error tests, typecheck, lint, and build pass.

### Phase 3 — Functional catalog

Implement debounced search, supported filters/sorts, pagination, and clear-all.
Treat URL search parameters as the reproducible catalog-state boundary; derive UI
state rather than duplicating it in Redux. Do not expose color/size filters unless
the approved model contains reliable variant data.

**Acceptance criteria:** each enabled control changes results; URLs reproduce state;
back/forward and route navigation behave predictably; mobile filters and empty
results are accessible; filtering, sorting, and query serialization tests pass.

### Phase 4 — Redux cart and wishlist

Add typed cart/wishlist slices for genuinely shared state, validated persistence,
derived pricing selectors, navigation counts, empty states, and announced add/remove
feedback. Never store calculated totals as competing state.

**Acceptance criteria:** add/remove/update/clear work across routes and refresh;
invalid quantities and corrupt storage are handled; totals are selector-derived;
reducers, selectors, persistence, and key UI flows have focused tests.

### Phase 5 — Checkout

Add React Hook Form and Zod only now. Build cart review, accessible shipping/contact
validation, order summary, a simulated asynchronous submission boundary, failure and
success states, duplicate-submit protection, and a confirmation route/reference.
No real payments are in scope without separate approval.

**Acceptance criteria:** Product → Cart → Checkout → Confirmation succeeds; invalid
input is rejected and focus/errors are accessible; retry and duplicate submission
are covered; an integration or E2E test proves the primary flow.

### Phase 6 — Quality, accessibility, and testing depth

Add Playwright, expand business-critical unit/component coverage, test keyboard
navigation, remediate semantics/labels/focus/contrast, add an error boundary and 404,
and address measured rendering/performance issues. Use an automated accessibility
scanner where the environment permits, backed by manual keyboard review.

**Acceptance criteria:** lint, formatting, typecheck, unit/component tests, build,
and core Playwright journey pass; no major keyboard blocker or known critical
accessibility violation remains; 404 and error recovery are tested.

### Phase 7 — CI, deployment, and portfolio presentation

Add GitHub Actions using deterministic install/cache and separate quality gates;
configure an approved static host with SPA fallback; verify direct routes; only then
update README claims, commands, architecture, screenshots, demo URL, decisions,
limitations, and suggested repository metadata.

**Acceptance criteria:** CI passes from a clean checkout; deployed direct navigation
works; every README command is executed successfully; screenshots and claims match
the delivered app; limitations and future work are explicit.

### Optional backend proposal — not authorized for implementation

After Phase 7, evaluate a separate FastAPI/PostgreSQL service with REST resources,
OpenAPI, migrations, authentication, persisted carts/orders, Docker Compose, and API
tests. It materially improves the portfolio only if backend design, data integrity,
security, and operations are presentation goals; otherwise it adds deployment and
maintenance risk without improving the frontend evidence. Produce a decision record
and API/data model before any backend code.

## Phase 1 expected file changes

Exact moves should be confirmed by the baseline and dead-file analysis. Expected
changes are:

- `package.json`, `package-lock.json` — replace CRA tooling and add only Vite,
  TypeScript, ESLint, and Prettier dependencies/scripts needed by this phase.
- `index.html` — move the entry document to Vite's root convention and correct
  baseline metadata/resource paths.
- `vite.config.ts`, `tsconfig.json`, likely `tsconfig.app.json` and
  `tsconfig.node.json` — Vite and modern TypeScript configuration.
- `eslint.config.*`, `.prettierrc*`, `.prettierignore` — deterministic quality tools.
- `.gitignore` — Vite output/local files and IDE metadata.
- `src/index.tsx` (likely renamed `src/main.tsx`), `src/vite-env.d.ts`, and deletion of
  `src/react-app-env.d.ts` — Vite bootstrap/types.
- Imports plus paths under `src/components/prouduct-info/` and
  `src/components/multy-shop-icon/`; potentially limited page/feature moves agreed in
  review.
- `src/assets/`, `public/assets/`, `public/css/`, `public/lib/`, `public/js/`, and the
  `tamplate/` tree — retain one verified runtime source and delete proven duplicates
  or unused original-template files. This is not blanket authorization to remove
  assets before usage checks.
- `.idea/` — remove tracked editor-specific files.
- Optional Phase 1 smoke-test files only if minimal route-render checks are needed to
  prove migration parity; otherwise formal Vitest/RTL introduction remains Phase 2.
- `README.md` is intentionally excluded in Phase 1 unless implemented script/setup
  facts make its existing instructions false; any edit must describe only verified
  delivered behavior.

## Risks, rollback, and breaking changes

- **Node/toolchain:** CRA 4 is already broken on the available Node 24 runtime.
  Pin a supported Node range and migrate without the OpenSSL legacy workaround.
- **Visual regression:** removing global template CSS/assets or changing paths can
  alter the layout silently. Capture all routes at desktop and mobile widths and
  compare before deletion.
- **Hidden template coupling:** class names/data attributes may imply Bootstrap/Owl
  JavaScript that is not currently loaded. Preserve actual observed behavior, not
  unverified template intent, and record any deliberately retired dead behavior.
- **Routing/deployment:** `BrowserRouter` needs host fallback rules. Test direct deep
  links in preview now and configure the selected host in Phase 7.
- **Large rename diff:** case/path changes can break imports on Linux and obscure
  functional edits. Keep renames in a dedicated commit and verify with a rename
  summary plus typecheck.
- **External API:** public services can fail or change. Phase 2 needs an approved
  provider, adapter boundary, deterministic fixtures, timeout/retry policy, and
  honest offline behavior.
- **Schema mismatch:** current UI promises variants that many public product APIs do
  not supply. Hide unsupported filters rather than manufacture functionality.
- **Persistence migration:** validate and version local-storage payloads so corrupt
  or old state cannot crash future releases.
- **Dependency expansion:** introduce libraries only in their owning phase and review
  the lockfile/security report each time.

Each phase should be a separately reviewable branch/PR. Roll back by reverting that
phase's focused commits; avoid mixing data, state, checkout, or redesign work into
the tooling migration. Preserve a deployable previous-phase tag or commit before
merging the next phase.

## Proposed branch and commit structure

- Phase 0 branch/current work: `docs/phase-0-audit`; commit
  `docs: add modernization audit and phased plan`.
- Phase 1: `phase/1-vite-tooling`, with focused commits for (1) baseline/Vite,
  (2) TypeScript/lint/format, (3) naming moves, and (4) proven asset/template cleanup.
- Later branches: `phase/2-product-api`, `phase/3-catalog`, `phase/4-cart-wishlist`,
  `phase/5-checkout`, `phase/6-quality`, and `phase/7-ci-deployment`.
- Each PR includes exact commands/results, screenshots for perceptible UI changes,
  dependency rationale, rollback notes, and no work from the next phase.

## Decisions requiring approval

Approval to start Phase 1 should also confirm or defer these choices:

1. **Supported runtime:** recommend current Node 22 LTS for local development/CI
   rather than Node 24 until the chosen Vite/plugin versions explicitly support it.
2. **Package manager:** recommend retaining npm and `package-lock.json` to minimize
   migration scope.
3. **Cleanup boundary:** approve deletion of `.idea/`, the original `tamplate/` tree,
   and duplicate public/source assets after runtime/import verification.
4. **Source organization:** approve modest feature-oriented moves, not a wholesale
   rewrite, during Phase 1.
5. **Phase 2 data source (decision can wait):** choose a stable public API for demo
   realism or a repository-owned mock API for deterministic models and tests. The
   recommendation is an adapter plus deterministic fixtures, with the final source
   selected after comparing schemas.
6. **Future deployment (decision can wait):** select the host before Phase 7 so SPA
   fallback and base paths can be tested against its constraints.

No Phase 1 implementation begins until this plan is approved.

## Phase 1 implementation record

Phase 1 was approved and implemented on branch
`codex/phase-1-vite-modernization` on 2026-08-19.

- Replaced the CRA entry document and bootstrap with Vite's root `index.html`,
  `src/main.tsx`, `src/vite-env.d.ts`, and a React-enabled `vite.config.ts`.
- Kept React 18 and upgraded React Router to 7. The route declarations for `/`,
  `/shop`, and `/shop/:id` were not changed.
- Added a Node 22 engine constraint and version files, strict modern TypeScript
  project configurations, ESLint flat configuration, Prettier configuration, and
  explicit development, preview, build, typecheck, lint, and formatting scripts.
- Renamed `prouduct-info` to `product-info` and `multy-shop-icon`/`MultyShopIcon` to
  `multi-shop-icon`/`MultiShopIcon`, updating every import and symbol reference.
- Removed tracked `.idea` metadata, obsolete CRA entry/manifest/logo files and
  dependencies, the standalone original `tamplate` tree, unreferenced Bootstrap
  source/compiled variants, legacy JavaScript, and duplicate source images.
- Retained `public/css/style.css`, the two CSS libraries linked by `index.html`, and
  all 27 images referenced by rendered source. Before cleanup, repository-wide
  searches accounted for HTML, TSX, CSS `url(...)`, and public-path references. The
  retained public image set exactly matches the 27 image names referenced by source;
  the removed payment image had no source, HTML, or CSS reference.
- Retained Owl Carousel's `owl.video.play.png` because the retained carousel CSS
  references it through a relative `url(...)`; a validation-pass filesystem check
  confirms that every local URL in retained public CSS resolves to an existing file.
- Updated README setup and tooling statements only where the completed migration
  made the prior CRA instructions inaccurate; no later-phase feature is claimed.

### Phase 1 local validation

Local validation on 2026-08-19 used Node 22.23.2 and npm 10.9.8 with the standard
`https://registry.npmjs.org/` registry. Registry access succeeded, the lockfile was
regenerated from `package.json`, and a clean `npm ci` installed 201 packages. The
regenerated lockfile contains no CRA, Webpack, CRA testing, or `web-vitals` package
records. Regeneration refreshed compatible transitive React 18 types and packages
within the manifest ranges and retained React Router 7.18.2; `npm audit` reports zero
vulnerabilities. No force, legacy peer-dependency, OpenSSL, or automatic audit-fix
workaround was used.

The project-local `typecheck`, `lint`, `format:check`, and `build` scripts pass, as
does `git diff --check`. One migration validation defect was fixed by replacing an
expression-only optional callback invocation in `useOutsideHandler` with an explicit
guard so the configured ESLint rules pass without suppression. Vite 7.3.6 starts on
localhost. Direct HTTP requests to `/`, `/shop`, and `/shop/1` each return the Vite
entry document with status 200, proving the development-server SPA fallback. Every
retained public image loads, as do the retained custom CSS, animation CSS, Owl
Carousel CSS and video icon. The referenced Google Fonts and Font Awesome
stylesheets also returned status 200 during direct network checks.

Actual browser inspection could not be completed because the in-app browser runtime
reported no available browser backend. Desktop and mobile viewport rendering,
client-side navigation and refresh behavior, browser-console output, and visual
parity therefore remain unverified and are not claimed. Phase 1 does not yet satisfy
every acceptance criterion despite all install, static, build, development-server,
direct-route HTTP, and asset checks passing.
