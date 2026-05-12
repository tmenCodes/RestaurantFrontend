# Restaurant Frontend

An Angular-based restaurant web application that allows customers to browse the menu, place orders, make table reservations, and manage their account.

## Live Demo

[https://yummy.tonymdesigns.com](https://yummy.tonymdesigns.com)

## Features

- **Home** — Landing page with restaurant highlights
- **Menu** — Browse and add items to cart
- **Cart & Checkout** — Review orders and complete purchase
- **Table Booking** — Reserve a table online
- **About & Chefs** — Restaurant story and team
- **Contact** — Send a message to the restaurant
- **Authentication** — User signup, login, and profile management
- **Saved Information** — View past orders and saved details

## Tech Stack

- [Angular 20](https://angular.dev/) — Frontend framework
- [Bootstrap 5](https://getbootstrap.com/) — UI styling
- [RxJS](https://rxjs.dev/) — Reactive state and HTTP handling
- [JWT Decode](https://github.com/auth0/jwt-decode) — Token-based authentication
- TypeScript 5.8

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/tmen427/RestaurantFrontend.git
cd RestaurantFrontend
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200`. The app reloads automatically on file changes.

### Build

```bash
npm run build
```

Output is placed in the `dist/` directory.

### Run Tests

```bash
# Single run (CI mode)
npm run test:ci
```

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that:

1. Installs dependencies
2. Runs unit tests
3. Builds the app
4. Deploys the `dist/` folder to an AWS EC2 instance via SSH

Deployment secrets (`DEPLOY_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PORT`) are configured in GitHub repository settings.

## Project Structure

```
src/
├── app/
│   ├── home/           # Landing page
│   ├── menu/           # Menu listing
│   ├── cart-count/     # Cart badge component
│   ├── checkout/       # Cart review page
│   ├── complete-checkout/
│   ├── book/           # Table reservation
│   ├── booking-complete/
│   ├── about/
│   ├── chefs/
│   ├── contact/
│   ├── contact-complete/
│   ├── login/
│   ├── signup/
│   ├── user-information/
│   ├── saved-information/
│   ├── error-page/
│   ├── page-not-found/
│   ├── auth.guard.ts          # Route guard
│   ├── auth-interceptor.service.ts
│   ├── cart.service.ts
│   └── http.service.ts
├── assets/
├── environments/
│   ├── environment.ts          # Production API URLs
│   └── environment.development.ts
└── styles.css
```

## License

This project is private.
