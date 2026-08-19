# MultiShop Storefront

> A responsive e-commerce storefront implemented with React and TypeScript.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

MultiShop Storefront is a front-end e-commerce project that turns a static shop template into a reusable, component-based React application. It includes a complete landing page, product catalog, filtering controls, and individual product-detail routes.

## Features

- Responsive e-commerce landing page
- Reusable product, category, offer, and navigation components
- Shop catalog with price, color, and size filter controls
- Product detail pages with route parameters
- Product image galleries and quantity controls
- Featured-product and vendor carousels
- Breadcrumb navigation and pagination UI
- Strongly typed components and page data

## Tech Stack

| Area    | Technologies               |
| ------- | -------------------------- |
| UI      | React 18, TypeScript       |
| Routing | React Router 7             |
| Styling | Bootstrap, custom CSS/SCSS |
| Tooling | Vite, ESLint, Prettier     |

## Pages

| Route       | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| `/`         | Storefront landing page with categories, offers, and featured products |
| `/shop`     | Product catalog and filtering interface                                |
| `/shop/:id` | Individual product information and purchase controls                   |

## Getting Started

### Prerequisites

- Node.js 22 LTS
- npm 8 or later

### Installation

```bash
git clone https://github.com/aboumelon/shop-redux.git
cd shop-redux
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## Available Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Run the Vite development server      |
| `npm run build`        | Create an optimized production build |
| `npm run preview`      | Preview the production build locally |
| `npm run typecheck`    | Run strict TypeScript checking       |
| `npm run lint`         | Check the source with ESLint         |
| `npm run format:check` | Check formatting with Prettier       |
| `npm run format`       | Format supported files with Prettier |

## Project Structure

```text
src/
|-- components/         # Reusable storefront UI components
|-- hooks/              # Shared interaction hooks
|-- pages/
|   |-- home/           # Landing page and presentation data
|   |-- shop/           # Catalog, filters, pagination, and product data
|   `-- product-detail/ # Product detail route and data
|-- App.tsx             # Application routes
`-- main.tsx            # Vite/React entry point
```

## Current Scope

This repository focuses on the storefront experience. Product data is currently stored locally, and actions such as search, filtering, cart updates, checkout, and account management are represented at the UI level. A production version can connect these components to an API and a centralized state layer.

## Potential Enhancements

- Connect the catalog to a REST or GraphQL API
- Add persistent cart and checkout state
- Implement functional filtering, sorting, and search
- Add authentication and order history
- Expand automated component and route tests

## License

This project is intended for portfolio and educational use.
