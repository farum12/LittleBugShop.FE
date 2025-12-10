# 🐛 LittleBugShop Frontend

> Wake up, samurai — we have bugs to catch!

A **vibe coded** React frontend for a bookstore application, purpose-built as a sandbox for test automation practice.

## 🎯 Purpose

This project was created as a **test automation training ground**. It's designed to be:

- **Test-friendly** — Every interactive element has `data-testid` attributes
- **Realistic** — Full e-commerce functionality (products, cart, orders, wishlist, reviews)
- **Predictable** — Consistent patterns for easy selector targeting

### Data-TestID Convention

```
data-testid="page-name"           → e.g., "cart-page"
data-testid="element-name"        → e.g., "search-input"
data-testid="element-name-{id}"   → e.g., "product-card-123"
data-testid="action-button"       → e.g., "add-to-cart-button"
```

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.6.3 | Type Safety |
| Vite | 6.0.3 | Build Tool & Dev Server |
| Tailwind CSS | 3.4.15 | Styling |
| React Router | 6.28.0 | Client-side Routing |
| Axios | 1.7.7 | HTTP Client |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- [LittleBugShop Backend](https://github.com/farum12/LittleBugShop) running on `localhost:5052`

### Installation

```bash
# Clone the repository
git clone https://github.com/farum12/LittleBugShop.FE.git
cd LittleBugShop.FE

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:3000**

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Page footer
│   ├── Layout.tsx       # Main layout wrapper
│   ├── ProductCard.tsx  # Product display card
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── pages/               # Route pages
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrdersPage.tsx
│   ├── WishlistPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProfilePage.tsx
│   └── NotFoundPage.tsx
├── services/            # API service layer
│   ├── api.ts           # Axios instance + interceptors
│   ├── authService.ts
│   ├── productService.ts
│   ├── cartService.ts
│   ├── orderService.ts
│   ├── reviewService.ts
│   └── wishlistService.ts
├── types/               # TypeScript interfaces
│   └── index.ts
├── App.tsx              # Router configuration
├── main.tsx             # Entry point
└── index.css            # Tailwind imports
```

## 🎨 Theme

Custom bug-themed color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Bug Primary | `#2d5a27` | Main green |
| Bug Secondary | `#8b4513` | Brown accents |
| Bug Accent | `#ffd700` | Gold highlights |

## 📖 Pages & Features

| Page | Route | Features |
|------|-------|----------|
| Home | `/` | Hero, featured products |
| Products | `/products` | Search, filter, pagination |
| Product Detail | `/products/:id` | Details, reviews, add to cart |
| Cart | `/cart` | View/edit cart, apply coupons |
| Checkout | `/checkout` | Shipping address, payment |
| Orders | `/orders` | Order history |
| Wishlist | `/wishlist` | Saved products |
| Login | `/login` | Authentication |
| Register | `/register` | New account |
| Profile | `/profile` | User settings |

## 🔌 API Integration

The frontend proxies API requests to the backend:

- **Dev proxy:** `localhost:3000/api/*` → `localhost:5052/api/*`
- **Auth:** JWT tokens stored in localStorage
- **Interceptors:** Auto-attach auth headers, handle 401 redirects

## 🧪 For Test Automation Engineers

This app is your playground! Here's what you can practice:

- **E2E Testing** — Full user flows (browse → cart → checkout)
- **Component Testing** — Isolated component behavior
- **API Testing** — Mock or intercept service calls
- **Visual Regression** — Consistent UI with Tailwind
- **Accessibility Testing** — Semantic HTML structure

### Selector Strategy

Recommended priority:
1. `data-testid` attributes (most stable)
2. Semantic roles (`button`, `link`, `textbox`)
3. Text content (for assertions)
4. CSS classes (Tailwind utilities are stable)

## ⚠️ Disclaimer

This is a **vibe coded** project — built with AI assistance (GitHub Copilot) in a single session. It's meant for learning and testing, not production use.

## 📄 License

MIT

---

*Built with 🐛 and ☕ for the QA community*
