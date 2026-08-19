# MultiShop Storefront

> A responsive e-commerce storefront implemented with React and TypeScript.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Create React App](https://img.shields.io/badge/Create_React_App-4-09D3AC?logo=createreactapp&logoColor=white)](https://create-react-app.dev/)

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

| Area | Technologies |
| --- | --- |
| UI | React 18, TypeScript |
| Routing | React Router 6 |
| Styling | Bootstrap, custom CSS/SCSS |
| Tooling | Create React App, React Scripts |
| Testing | React Testing Library, Jest DOM |

## Pages

| Route | Description |
| --- | --- |
| `/` | Storefront landing page with categories, offers, and featured products |
| `/shop` | Product catalog and filtering interface |
| `/shop/:id` | Individual product information and purchase controls |

## Getting Started

### Prerequisites

- Node.js 16 or later
- npm 8 or later

### Installation

```bash
git clone https://github.com/aboumelon/shop-redux.git
cd shop-redux
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the development server |
| `npm test` | Launch the test runner in watch mode |
| `npm run build` | Create an optimized production build |
| `npm run eject` | Expose the Create React App configuration (irreversible) |

## Project Structure

```text
src/
|-- assets/             # Product, category, vendor, and promotional images
|-- components/         # Reusable storefront UI components
|-- hooks/              # Shared interaction hooks
|-- pages/
|   |-- home/           # Landing page and presentation data
|   |-- shop/           # Catalog, filters, pagination, and product data
|   `-- product-detail/ # Product detail route and data
|-- App.tsx             # Application routes
`-- index.tsx           # React entry point
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
