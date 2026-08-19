# Phase 2A product API and domain-model evaluation

**Status:** Research and architecture only

**Evaluated:** 2026-08-19

**Implementation:** Not started

## Decision summary

Use **DummyJSON Products** as the primary read-only catalog provider in Phase 2B,
but keep its transport schema behind application-owned mapping functions. Add a
small, version-controlled domain fixture as a transparent runtime fallback and as
the source for deterministic tests; add MSW with the Phase 2B test tooling so tests
never depend on the live service.

DummyJSON has the best verified fit: 194 products across 24 categories, stable IDs,
descriptions, prices and discounts, ratings, stock and availability, reviews,
thumbnails, galleries, search, category endpoints, sorting, offset pagination with
totals, structured missing-product errors, and working CORS. It does not supply
color or size variants. Those controls must be hidden or postponed rather than
populated with invented values.

Fake Store API is substantially smaller and less capable. A fully local catalog is
the most deterministic option, but using it as the only source would demonstrate
less real transport and server-cache integration. No credentials-free public API
examined was clearly superior to DummyJSON for this portfolio's current scope.

## 1. Verified current UI data requirements

The requirements below come from the current repository, not from a desired future
schema.

| Surface                | Current data or behavior                                                               | Phase 2 implication                                                                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home product grids     | Image, title, current price, struck-through price, five decorative stars, review count | Cards need a stable ID and route link in addition to mapped display data. Rating must become data-driven.                                                                                      |
| Shop grid              | Same product-card shape as home                                                        | One domain product/card projection should serve both grids.                                                                                                                                    |
| Home categories        | Category image, name, product count                                                    | Category name/slug is required. Count and image can remain optional because neither live category endpoint supplies both.                                                                      |
| Product detail route   | `/shop/:id` exists, but the ID is not read                                             | Phase 2B must normalize the route ID and perform a single-product query.                                                                                                                       |
| Product detail summary | Title, rating/review count, price, description, size choices, color choices, quantity  | Title, rating, review count, price, and description map to product data. Size/color controls require genuine variants and must not render for DummyJSON data. Quantity remains local UI state. |
| Product gallery        | Four static images                                                                     | Domain products need a primary thumbnail plus zero or more gallery images.                                                                                                                     |
| Product tabs           | Description, additional information, static review                                     | Description and provider reviews can be shown. Arbitrary additional-information claims and review submission are not provider-backed.                                                          |
| Search                 | Decorative top-bar text input                                                          | Search belongs in URL query parameters and should drive the list endpoint in Phase 3.                                                                                                          |
| Filters                | Price, color, and size checkboxes with static counts                                   | Price can be implemented only with a correct all-result strategy. Color and size are unsupported. Counts must be computed, fetched, or omitted.                                                |
| Sorting                | Latest, Popularity, Best Rating                                                        | Rating is supported. Latest and popularity are not honestly supported by either provider.                                                                                                      |
| Page size              | 10, 20, or 30                                                                          | DummyJSON supports `limit`; normalize this as `pageSize`.                                                                                                                                      |
| Pagination             | Previous, pages 1–3, Next                                                              | Requires total, page, and page-size metadata, not hard-coded links.                                                                                                                            |

Definitive product requirements:

- Required for Phase 2B: stable ID, title, description, current price, category,
  primary image, gallery list, availability, list pagination metadata, and detail
  lookup.
- Optional because providers may omit them: original/compare-at price, discount,
  brand, rating, review count, review details, stock quantity, and variants.
- Required query capabilities: page and page size. Search, category, and sorting are
  designed now but become user-facing URL behavior in Phase 3.
- A missing image must resolve to an application-owned placeholder before reaching a
  presentation component.

## 2. Actual endpoints tested

All requests below were harmless `GET` or CORS `OPTIONS` requests made on
2026-08-19. One successful response is evidence of current behavior, not an uptime
guarantee.

### DummyJSON

| Request                                                                            | Observed result                                              |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `GET https://dummyjson.com/products?limit=2&skip=2`                                | `200`; `{ products, total: 194, skip: 2, limit: 2 }`         |
| `GET https://dummyjson.com/products?limit=0`                                       | `200`; all 194 products and 24 distinct categories           |
| `GET https://dummyjson.com/products/search?q=phone&limit=2`                        | `200`; 23 total matches with pagination metadata             |
| `GET https://dummyjson.com/products/search?q=phone&limit=5&sortBy=price&order=asc` | `200`; search and field sorting worked together              |
| `GET https://dummyjson.com/products/categories`                                    | `200`; 24 `{ slug, name, url }` records                      |
| `GET https://dummyjson.com/products/category/smartphones?limit=2`                  | `200`; 16 total matches with pagination metadata             |
| `GET https://dummyjson.com/products/category/smartphones?limit=0&q=iphone`         | `200`; `q` was ignored and all 16 category products returned |
| `GET https://dummyjson.com/products?limit=2&sortBy=price&order=asc`                | `200`; field sorting worked                                  |
| `GET https://dummyjson.com/products/1`                                             | `200`; full product record                                   |
| `GET https://dummyjson.com/products/999999`                                        | `404`; `{ "message": "Product with id '999999' not found" }` |
| `GET https://dummyjson.com/products/search?q=this-query-should-not-match-anything` | `200`; empty products array and `total: 0`                   |
| CORS preflight for `/products/1`                                                   | `204`; requesting origin echoed and `GET` allowed            |

The sampled response included rate-limit headers with `x-ratelimit-limit: 100`; the
window and contractual limit are not documented and remain unknown. Representative
thumbnail and gallery URLs on `cdn.dummyjson.com` returned `200` as WebP images.

Dataset-wide observations from the live `limit=0` response:

- 194/194 products had discounts, ratings, reviews, stock, availability, thumbnail,
  and at least one image.
- 102/194 had a brand.
- 116/194 had more than one gallery image; the observed maximum was six.
- Availability values were `In Stock`, `Low Stock`, and `Out of Stock`; four
  products had zero stock.

### Fake Store API

| Request                                                              | Observed result                                           |
| -------------------------------------------------------------------- | --------------------------------------------------------- |
| `GET https://fakestoreapi.com/products`                              | `200`; array of 20 products                               |
| `GET https://fakestoreapi.com/products?limit=2`                      | `200`; first two products, without total metadata         |
| `GET https://fakestoreapi.com/products?limit=2&skip=5`               | `200`; `skip` ignored; IDs 1 and 2 returned               |
| `GET https://fakestoreapi.com/products?q=phone&limit=2`              | `200`; search parameter ignored; IDs 1 and 2 returned     |
| `GET https://fakestoreapi.com/products/categories`                   | `200`; four category strings                              |
| `GET https://fakestoreapi.com/products/category/electronics?limit=2` | `200`; two category products                              |
| `GET https://fakestoreapi.com/products?sort=desc&limit=2`            | `200`; descending ID order within the limited result      |
| `GET https://fakestoreapi.com/products/1`                            | `200`; single product                                     |
| `GET https://fakestoreapi.com/products/999999`                       | `200`; empty response body                                |
| CORS preflight for `/products/1`                                     | `204`; `access-control-allow-origin: *` and `GET` allowed |

Representative `fakestoreapi.com/img/...` PNG images returned `200`. No rate-limit
headers or published rate-limit contract were found; limits are unknown.

## 3. Schema summaries

### DummyJSON transport shape

```text
Product: id, title, description, category, price, discountPercentage,
         rating, stock, tags, brand?, sku, availabilityStatus, reviews[],
         thumbnail, images[], and additional shipping/dimension metadata

List:    products[], total, skip, limit
Category: slug, name, url
Review:  rating, comment, date, reviewerName, reviewerEmail
```

Useful fields are rich, but these remain provider transport types. The application
should not expose `availabilityStatus`, numeric IDs, reviewer emails, or the response
envelope directly to React components.

DummyJSON cart examples distinguish list price/total from discounted total. This
supports deriving a discounted current price from product `price` and
`discountPercentage`, with integer-minor-unit rounding in the adapter.

### Fake Store API transport shape

```text
Product: id, title, price, description, category, image,
         rating: { rate, count }

List:    Product[]
Category: string
```

It has no discount/original price, brand, stock, availability, reviews, gallery,
variants, pagination totals, search, or field-based sorting.

### Deterministic local fixture

A local fixture can exactly match the application domain model and provide stable
errors, pagination, search, filtering, and sorting. That is excellent for tests and
fallback behavior, but using only fixtures would avoid demonstrating a real remote
transport boundary. Fixture values must be intentionally authored and sourced; they
must not invent variants solely to keep decorative controls visible.

## 4. Provider comparison matrix

| Criterion                | DummyJSON Products                                                                              | Fake Store API                                                                      | Versioned local fixture                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Schema coverage          | Strong; all core fields except variants, brand optional                                         | Basic card fields only                                                              | Complete by design, but only honestly authored fields             |
| Product count / variety  | 194 / 24 categories observed                                                                    | 20 / 4 categories observed                                                          | Chosen by repository; likely 9–20 initially                       |
| Images                   | Thumbnail plus 1–6 images; sampled CDN URLs worked                                              | One image; sampled URLs worked                                                      | Fully reliable if local assets are used                           |
| CORS                     | Verified preflight success                                                                      | Verified wildcard CORS                                                              | Same-origin; not applicable                                       |
| Rate limits              | Live header advertised 100; window/terms unknown                                                | Unknown                                                                             | None                                                              |
| Uptime/stability         | Public fake service; no verified SLA                                                            | Public fake service; no verified SLA                                                | Deterministic with repository/deployment                          |
| Pagination               | `limit`, `skip`, `total`                                                                        | `limit` only; no offset or totals                                                   | Full control                                                      |
| Search                   | Dedicated search endpoint                                                                       | Unsupported; tested query ignored                                                   | Full control                                                      |
| Categories               | Structured categories and category lists                                                        | Four strings                                                                        | Full control                                                      |
| Category filtering       | Dedicated endpoint with totals                                                                  | Dedicated endpoint, no totals                                                       | Full control                                                      |
| Sorting                  | Arbitrary field plus asc/desc; verified with price                                              | Asc/desc ID order only                                                              | Full control                                                      |
| Single lookup            | Yes; structured 404                                                                             | Yes; missing ID returned empty `200`                                                | Full control                                                      |
| Error behavior           | Predictable for tested missing product                                                          | Ambiguous for tested missing product                                                | Fully deterministic                                               |
| TypeScript mapping       | Moderate, explicit rich adapter                                                                 | Simple mapping but many missing domain fields                                       | Minimal after fixture validation                                  |
| RTK Query fit            | Strong: list envelopes, query args, detail, categories                                          | Weak for a functional catalog                                                       | Strong technically, but no real network dependency                |
| Deterministic tests / CI | Requires recorded fixtures; never call live API in CI                                           | Same, with more edge normalization                                                  | Excellent                                                         |
| External dependency risk | Medium                                                                                          | Medium-high because of limited behavior and no SLA                                  | None                                                              |
| Licensing/usage          | Repository code has an MIT license; product text/image rights are not stated and remain unknown | Repository code is MIT; product text/image rights are not stated and remain unknown | Controlled only if fixture text/images have documented provenance |
| Developer experience     | Clear docs, useful queries, coherent envelope                                                   | Very simple but too limited                                                         | Excellent, with maintenance cost                                  |
| Long-term maintenance    | Adapter and fallback contain provider changes                                                   | Likely replacement needed as features grow                                          | Application owns every schema/data update                         |

Repository maintenance is only a risk signal, not an uptime measure. The DummyJSON
repository was not archived and showed a July 2026 push when checked. Fake Store API
was not archived, but its latest reported push was April 2024. Neither service
publishes an SLA that was verified during this evaluation.

## 5. Unsupported and fabricated-field analysis

| Requirement            | DummyJSON                                                 | Fake Store API             | Honest application decision                                                                                                                  |
| ---------------------- | --------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Stable ID              | Supplied number                                           | Supplied number            | Normalize to a string at the boundary.                                                                                                       |
| Current/original price | List price and discount percentage                        | One price only             | For DummyJSON, preserve list price as `originalPrice` and derive discounted current price. For Fake Store, show one price.                   |
| Review count           | Safely derived from `reviews.length`                      | Supplied as `rating.count` | Keep optional in the domain.                                                                                                                 |
| Gallery                | Supplied, sometimes one image                             | One image                  | Always expose a deduplicated array; a one-image gallery is valid.                                                                            |
| Brand                  | Present on 102/194                                        | Missing                    | Optional; do not infer from title or tags.                                                                                                   |
| Availability           | Status and stock supplied                                 | Missing                    | Map known status; use stock fallback only when status is missing.                                                                            |
| Colors                 | Missing                                                   | Missing                    | Hide/postpone color controls. Do not infer colors from image pixels, titles, or categories.                                                  |
| Sizes                  | Missing                                                   | Missing                    | Hide/postpone size controls. Do not assign generic XS–XL choices.                                                                            |
| Category count         | Not in category record                                    | Not supplied               | Optional. Derive from a complete local result or category totals only when worth the requests.                                               |
| Price filtering        | No documented server filter                               | Unsupported                | In Phase 3, fetch the complete relevant result set before local filtering or omit the filter. Never filter one page and claim global totals. |
| Search + category      | Category endpoint ignored tested `q`                      | Search unsupported         | For a combined query, fetch all search matches and then filter/category-page locally, or defer the combined control.                         |
| Latest sort            | Provider metadata is not a trustworthy merchandising date | Missing                    | Remove/postpone “Latest.”                                                                                                                    |
| Popularity sort        | No sales/view popularity signal                           | Missing                    | Remove/postpone “Popularity”; rating count is not the same concept.                                                                          |
| Best rating            | `sortBy=rating&order=desc`                                | No field sorting           | Supported for DummyJSON.                                                                                                                     |

## 6. Recommended provider

Select **DummyJSON** for Phase 2B.

Reasons:

1. It covers the current card and detail requirements without manufacturing core
   data.
2. It supports real server interactions worth demonstrating with RTK Query:
   pagination, search, categories, sorting, detail lookup, and errors.
3. Its list envelope normalizes cleanly to the application pagination model.
4. The provider's limitations are manageable behind one adapter.
5. It is materially richer and less error-prone than Fake Store API in the tested
   flows.

This is not approval to couple the application to DummyJSON. Provider URLs, response
types, field names, error bodies, and number IDs must remain inside the product API
transport boundary.

## 7. Recommended fallback strategy

| Strategy                             | Dependability                               | Cost / drawback                                                     | Decision                         |
| ------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------- | -------------------------------- |
| External API only                    | Demo fails when provider/CDN is unavailable | Smallest code, highest portfolio risk                               | Reject                           |
| External API plus test-only fixtures | CI is stable; deployed demo can still fail  | Good minimum for engineering tests                                  | Necessary but insufficient alone |
| Build-time live snapshot             | Runtime is stable after build               | Builds depend on external availability; data changes without review | Reject                           |
| Fully local mock                     | Most reliable                               | Demonstrates less real API/cache behavior                           | Keep as fallback, not primary    |
| Future first-party backend           | Best control if operated well               | Large scope and operations burden                                   | Reconsider after Phase 7 only    |

Recommended smallest dependable design:

- Use DummyJSON by default.
- Check in a small, reviewed catalog in **domain shape**, not copied provider shape.
- Reuse the repository's existing local product images for fallback records so a
  provider CDN failure does not break the fallback.
- On an initial terminal network, timeout, rate-limit, or 5xx failure, return the
  matching fallback list/detail and show a non-blocking “sample catalog” notice.
- Do not replace a genuine provider 404 with an unrelated fallback product.
- Keep stale successful RTK Query data during background refetch failures.
- Use raw-provider fixtures and MSW handlers for adapter/API tests; CI must make no
  live provider requests.

## 8. Proposed provider-independent domain model

```ts
type ProductId = string;
type CurrencyCode = "USD";

interface Money {
  minorUnits: number;
  currency: CurrencyCode;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

type ProductAvailability =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "unknown";

interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt?: string;
}

interface ProductVariant {
  id: string;
  color?: string;
  size?: string;
  stock?: number;
}

interface Product {
  id: ProductId;
  title: string;
  description: string;
  price: Money;
  originalPrice?: Money;
  discountPercentage?: number;
  category: ProductCategory;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  reviews: ProductReview[];
  stock?: number;
  availability: ProductAvailability;
  thumbnailUrl: string;
  imageUrls: string[];
  variants: ProductVariant[];
}

type ProductSort =
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "title-asc"
  | "title-desc";

interface ProductQuery {
  search?: string;
  category?: string;
  sort?: ProductSort;
  page: number;
  pageSize: number;
}

interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

Design decisions:

- **Required vs optional:** fields needed to identify and render every product are
  required. Provider-dependent enrichment is optional. Arrays are present but may
  be empty, which simplifies presentation code without claiming data exists.
- **Money:** use integer minor units plus an explicit currency. Convert a provider
  decimal exactly once in the adapter with documented rounding. Never perform cart
  totals with binary floating-point product prices.
- **IDs:** normalize all product IDs to strings for routes, cache tags, fixtures, and
  future providers that use UUIDs.
- **Discount:** DummyJSON's list price becomes `originalPrice`; derive `price` as
  `round(originalMinor * (1 - discountPercentage / 100))`. If the discount is
  absent or invalid, use one price and omit `originalPrice`.
- **Availability:** map known provider status strings first. If status is absent,
  map stock `0` to out of stock, `1..10` to low stock, greater values to in stock,
  and missing stock to unknown. The low-stock threshold is application policy.
- **Pagination:** convert `skip` and `limit` to one-based `page`; compute
  `totalPages = Math.ceil(total / pageSize)`. Guard zero/invalid limits.
- **Categories:** use the slug as normalized ID for DummyJSON. Category names are
  display labels; counts remain optional.
- **Images:** trim and deduplicate URLs, prefer the provider thumbnail, and ensure a
  local placeholder is used if no valid URL remains. Image load failures should
  also swap to that placeholder in the view layer.
- **Reviews:** never expose reviewer email. A deterministic review ID may be derived
  from product ID plus response position because DummyJSON supplies no review ID.
- **Variants:** map an empty array for DummyJSON. Future providers or a first-party
  backend can populate genuine variants without changing component contracts.

## 9. Provider adapter and boundary design

Only provider modules know the live response shape:

```text
provider response (unknown JSON)
  -> minimal runtime parser
  -> DummyJSON transport type
  -> dummyJsonAdapter mapping
  -> application Product / PaginatedProducts
  -> RTK Query cache
  -> page and presentation components
```

Proposed mapping functions:

```ts
parseDummyJsonProduct(value: unknown): DummyJsonProduct
parseDummyJsonProductPage(value: unknown): DummyJsonProductPage
parseDummyJsonCategories(value: unknown): DummyJsonCategory[]
mapDummyJsonProduct(value: DummyJsonProduct): Product
mapDummyJsonProductPage(value: DummyJsonProductPage): PaginatedProducts
mapDummyJsonCategory(value: DummyJsonCategory): ProductCategory
normalizeProductApiError(error: unknown): ProductApiError
```

Provider types must not be exported from a public feature barrel or accepted as
React props. URL construction should live beside the provider types so replacing
DummyJSON does not change pages.

Minimal runtime validation is worth adding in Phase 2B because this is an untrusted,
changeable public service. Validate the envelope and required field types, clamp or
reject invalid numeric values, and return `invalid-response` rather than allowing
bad JSON to reach components. Do this with focused parser/type-guard functions first;
do not add a schema library solely for this provider during Phase 2B. Reconsider a
library when a second provider or first-party backend makes schema reuse valuable.

## 10. Proposed RTK Query architecture

### Store and API ownership

- Add one store in `src/app/store.ts`.
- Add one products API slice with reducer and middleware registration.
- Wrap the app once with React Redux `Provider` in `src/main.tsx` or a small
  `AppProviders` component.
- Do not add product entities to a separate slice; RTK Query owns server data.

### Base query

- Use `fetchBaseQuery` with `https://dummyjson.com/` and an approximately eight
  second timeout.
- Wrap it with `retry` using at most two retries with backoff for network failures,
  429, and 5xx responses.
- Bail immediately for other 4xx responses, especially product 404.
- Pass all terminal errors through one normalizer.

### Endpoints

| Endpoint                 | Domain result       | Behavior                                                                                                                                                                                       |
| ------------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getProducts(query)`     | `PaginatedProducts` | Choose base, search, or category transport route; map sort/page to provider params; use a complete search result plus local category/page normalization when search and category are combined. |
| `getProductById(id)`     | `Product`           | Normalize ID to string, request `/products/:id`, map a 404 to domain not-found, and never substitute a different fallback product for a real 404.                                              |
| `getProductCategories()` | `ProductCategory[]` | Request `/products/categories`; omit counts initially.                                                                                                                                         |

The fallback policy can be implemented through shared endpoint `queryFn` helpers
that call `fetchWithBQ`, validate/map success, and consult the local domain fixture
only for eligible terminal availability failures.

### Query keys and tags

- Canonicalize query args: trim search, normalize empty strings to absent, validate
  page/page size, and use a stable sort union.
- Let each canonical `{ search, category, sort, page, pageSize }` represent its own
  cache entry. Do not collapse all pages into one cache key.
- Use `serializeQueryArgs` only to return that canonical object and exclude UI-only
  values; the default stable serialization is otherwise sufficient.
- Define `Product` and `ProductCategory` tag types. Lists provide `Product/LIST` plus
  item ID tags, details provide their ID, and categories provide
  `ProductCategory/LIST`. They prepare for future mutations without adding any now.

### Refetch behavior

- Keep default cache reuse and a moderate `keepUnusedDataFor` period such as five
  minutes.
- Enable refetch on reconnect and focus for the public demo.
- Preserve last good data while `isFetching`; show a subtle updating indicator.
- Avoid unconditional refetch on every mount.

## 11. State-ownership decisions

| State                                                              | Owner                                                      |
| ------------------------------------------------------------------ | ---------------------------------------------------------- |
| Product lists, details, categories, request/error status           | RTK Query server cache                                     |
| Search, category, sort, page, page size                            | URL search parameters in Phase 3                           |
| Cart, wishlist, authentication, checkout                           | Not Phase 2; future explicit slices only when authorized   |
| Filter drawer/dropdown visibility, carousel index                  | Local component state                                      |
| Selected quantity and genuine variant selection before cart action | Local component state                                      |
| Derived totals, availability labels, formatted money               | Selectors/view-model functions, not stored duplicate state |

No Redux client-state slice is needed in Phase 2B beyond the RTK Query API reducer.

## 12. Error and loading-state design

Use a small discriminated error model:

```ts
type ProductApiError =
  | { kind: "not-found"; message: string }
  | { kind: "network" | "timeout"; message: string; retryable: true }
  | { kind: "rate-limited"; message: string; retryAfterSeconds?: number }
  | { kind: "http"; status: number; message: string; retryable: boolean }
  | { kind: "invalid-response"; message: string; retryable: false };
```

UI behavior:

- Initial list/detail load: layout-preserving skeletons.
- Background refetch: retain data and show a small updating state.
- Empty result: explicit message and clear-filter/search action, not an error.
- Detail 404: route-level product-not-found presentation with a shop link.
- Retryable failure without fallback: focused error state and Retry button.
- Fallback activation: render the sample data with a clear, non-alarming status
  message.
- Invalid response: do not partially render unchecked provider data.

## 13. Deterministic testing-fixture strategy

Add testing tools only in Phase 2B, when implementation begins.

- Keep small raw DummyJSON response fixtures for adapter and runtime-parser tests.
- Keep separate domain factories for component tests; components should never import
  raw provider fixtures.
- Use MSW handlers for list, search, category, detail, empty results, 404, 429, 500,
  delayed response, malformed JSON shape, and network failure.
- Reuse the same handlers in component/integration tests. MSW can intercept standard
  requests independently of the request client.
- Disable unhandled network access in tests so CI cannot silently call DummyJSON.
- Keep a small local fallback catalog deterministic and reviewed. Refresh it only by
  an explicit maintenance task, never during build or test.

## 14. Expected Phase 2B file changes

```text
package.json                         # Redux Toolkit, React Redux, and approved tests
package-lock.json
src/main.tsx                         # application Provider only
src/app/
|-- store.ts
`-- AppProviders.tsx                 # optional if main.tsx would become noisy
src/features/products/
|-- api/
|   |-- productsApi.ts
|   `-- dummy-json/
|       |-- dummyJsonAdapter.ts
|       |-- dummyJsonParser.ts
|       |-- dummyJsonRequests.ts
|       `-- dummyJsonTypes.ts
|-- fixtures/
|   |-- fallbackProducts.ts
|   `-- dummyJsonResponses.ts
|-- model/
|   |-- product.ts
|   |-- productError.ts
|   `-- productQuery.ts
`-- components/                      # only new loading/error/status primitives
src/pages/home/Home.tsx              # consume domain queries/view models
src/pages/shop/Shop.tsx
src/pages/product-detail/ProductDetail.tsx
src/components/product-card/ProductCard.tsx
src/components/product-info/ProductInfo.tsx
src/components/product-carousel/ProductCarousel.tsx
src/test/                            # approved setup and MSW server/handlers
```

Current presentational components should not be broadly moved in Phase 2B. Change
their props to domain/view-model data where needed, then consider ownership moves in
later focused work.

## 15. Proposed Phase 2B acceptance criteria

- DummyJSON, the provider-independent model, fallback policy, and RTK Query design
  are explicitly approved before implementation.
- `/shop` renders mapped API products with loading, empty, error, fallback, and
  refetch states.
- `/shop/:id` uses the route ID, survives direct refresh, renders mapped detail data,
  and shows a dedicated not-found state for an unknown ID.
- Components import application domain/view types, never DummyJSON transport types.
- Missing/invalid provider fields and images cannot crash rendering.
- Colors and sizes are hidden when variants are absent; no variants are fabricated.
- RTK Query owns server cache; no duplicate products slice is added.
- Raw adapter tests and MSW-backed list/detail/error tests pass without live network
  access.
- Clean install, typecheck, lint, format check, tests, production build, direct-route
  browser checks, and `git diff --check` pass.
- No cart, wishlist, authentication, checkout, functional catalog filtering, or
  unrelated redesign is introduced.

## 16. Risks and decisions requiring approval

Approve these before Phase 2B:

1. **Provider:** DummyJSON as primary read-only source.
2. **Domain model:** string IDs, integer-minor-unit USD money, optional enrichment,
   empty variant arrays, and normalized pagination/errors.
3. **Discount mapping:** treat DummyJSON `price` as list/original price and derive the
   discounted current price using `discountPercentage`.
4. **Unsupported controls:** hide color, size, latest, and popularity controls until
   honest data exists; defer global price filtering to Phase 3.
5. **Fallback:** include a small versioned domain fixture using local images, show a
   sample-catalog notice when it activates, and never mask a real product 404.
6. **Runtime validation:** use focused parser/type guards in Phase 2B without adding
   a schema-validation dependency yet.
7. **RTK Query:** one API slice, no products client-state slice, two retries only for
   retryable failures, canonical query keys, and normalized errors.
8. **Tests:** add Vitest, React Testing Library, and MSW in Phase 2B as already
   anticipated by the Phase 2 plan.
9. **Licensing:** provider repositories are MIT-licensed, but the usage provenance
   for sample product text/images is not explicit. Approve their portfolio-demo use
   or require locally owned/generated catalog media before public deployment.

Other risks:

- Neither public provider offers a verified SLA; the adapter and fallback are still
  necessary.
- DummyJSON's observed rate-limit header does not document a time window or durable
  contract.
- Combined search/category and global price filtering require complete-result local
  processing to keep totals honest.
- Provider data and CDN URLs can change; raw fixtures and application-owned types
  limit the blast radius but do not eliminate maintenance.

## Sources

- [DummyJSON product documentation](https://dummyjson.com/docs/products)
- [DummyJSON cart documentation](https://dummyjson.com/docs/carts)
- [DummyJSON repository](https://github.com/Ovi/DummyJSON) and
  [license](https://github.com/Ovi/DummyJSON/blob/master/LICENSE)
- [Fake Store API repository and documentation](https://github.com/keikaavousi/fake-store-api)
  and [license](https://github.com/keikaavousi/fake-store-api/blob/master/LICENSE)
- [RTK Query overview](https://redux-toolkit.js.org/rtk-query/overview),
  [queries](https://redux-toolkit.js.org/rtk-query/usage/queries),
  [cache behavior](https://redux-toolkit.js.org/rtk-query/usage/cache-behavior), and
  [customizing queries/retry](https://redux-toolkit.js.org/rtk-query/usage/customizing-queries)
- [Mock Service Worker documentation](https://mswjs.io/)
