# ModernShop - E-commerce Platform

A modern, full-featured e-commerce application built with Next.js 14, TypeScript, and Tailwind CSS. This project provides a complete shopping experience with user authentication, product management, shopping cart, and secure checkout functionality.

## ✨ Features

### 🛍️ Customer Features
- **User Authentication** - Login/Register with secure authentication
- **Product Catalog** - Browse products with search and filtering
- **Shopping Cart** - Add/remove items, update quantities
- **Secure Checkout** - Complete order process with payment simulation
- **Order Success** - Confirmation page with order details
- **Responsive Design** - Mobile-first design with dark mode support

### 👨‍💼 Admin Features
- **Product Management** - Add, edit, and delete products
- **Category Management** - Create and manage product categories
- **Inventory Control** - Track stock levels and product information
- **Image Upload** - Upload and manage product images

### 🎨 UI/UX Features
- **Modern Design** - Clean, professional interface
- **Animations** - Smooth transitions with Framer Motion
- **Dark Mode** - Toggle between light and dark themes
- **Toast Notifications** - Real-time feedback for user actions
- **Loading States** - Skeleton loaders and loading indicators

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **API Client**: Axios with TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### 1. Clone the repository
```bash
git clone <repository-url>
cd task-ecommerce
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

### 4. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout process
│   │   ├── order-success/     # Order confirmation
│   │   ├── products/          # Product catalog & details
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── modals/           # Modal components
│   │   ├── ui/               # shadcn/ui components
│   │   └── ...
│   ├── layouts/              # Layout components
│   │   ├── Navbar.tsx        # Navigation bar
│   │   └── Footer.tsx        # Footer component
│   ├── lib/                  # API configurations
│   │   └── apis/            # API endpoint definitions
│   ├── page-sections/        # Page-specific sections
│   │   ├── home/            # Homepage sections
│   │   ├── products/        # Product page sections
│   │   └── AdminPageContent/ # Admin dashboard
│   ├── store/               # Zustand stores
│   │   ├── auth-store.ts    # Authentication state
│   │   └── cart-store.ts    # Shopping cart state
│   └── utils/               # Utility functions
├── public/                  # Static assets
└── ...config files
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com

# Optional: Enable debug mode for API requests
NEXT_PUBLIC_DEBUG_API=false
```

## 🎯 Key Features Walkthrough

### Authentication Flow
- Users can register/login through modal dialogs
- JWT-based authentication with protected routes
- Persistent login state with local storage

### Shopping Experience
- Product browsing with category filtering
- Add to cart functionality with quantity management
- Secure checkout process with form validation
- Order confirmation and success pages

### Admin Dashboard
- Product management with image upload
- Category creation and management
- Real-time inventory tracking
- Responsive admin interface

## 📱 Pages & Routes

- `/` - Homepage with featured products
- `/products` - Product catalog with search/filter
- `/products/[id]` - Individual product details
- `/cart` - Shopping cart management
- `/checkout` - Secure checkout process
- `/order-success` - Order confirmation
- `/admin` - Admin dashboard (protected)

## 🔐 API Integration

The application uses a custom API wrapper ([`requestAPI`](src/utils/request-api.ts)) that provides:
- Standardized error handling
- Toast notifications
- Request/response logging
- TypeScript type safety

## 🎨 Styling & Theming

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components for consistent UI
- **Dark mode** support with next-themes
- **Responsive design** with mobile-first approach

## 📦 Build & Deployment

### Build for production
```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### Start production server
```bash
npm start
# or
yarn start
# or
pnpm start
# or
bun start
```

### 🚀 Live Demo
The project is deployed and live on Vercel:
**[ModernShop - Live Demo](https://task-ecommerce-zeta.vercel.app/)**

### Deploy on Vercel
This project is configured for seamless deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/task-ecommerce)

#### Deployment Steps:
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
   NEXT_PUBLIC_DEBUG_API=false
   ```
3. Deploy automatically on push to main branch
4. Access your live application at the provided Vercel URL

#### Vercel Configuration:
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Other Deployment Options
- **Netlify**: Connect repository and set build command to `npm run build`
- **AWS Amplify**: Configure build settings and environment variables
- **Docker**: Create Dockerfile for containerized deployment


## 🛡️ Security Features

- Input validation with Zod schemas
- XSS protection through proper data sanitization
- CSRF protection for form submissions
- Secure API communication with proper headers

## 🔧 Development

### Available Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Code Quality
- ESLint configuration for code linting
- TypeScript for type safety
- Prettier for code formatting
- Husky for pre-commit hooks

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📞 Support

For support, email support@modernshop.com or join our Slack channel.

---

**Made with ❤️ by [Your Name]**