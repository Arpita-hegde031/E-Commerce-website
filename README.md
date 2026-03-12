# 🛍️ VOGUEX — Modern Fashion E-Commerce

A full-stack, responsive fashion storefront built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **MySQL**.

![VOGUEX Banner](https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80)

---

## 🌟 Features

- 🎨 **Luxury dark-theme UI** with gold accents
- 🛒 **Shopping cart** with quantity management
- ❤️ **Wishlist** functionality
- 🔐 **JWT Authentication** (Register / Login)
- 📦 **Order placement** saved to MySQL database
- 💳 **Multiple payment methods** — Card, UPI, PayPal
- 🗂️ **6 product categories** — Women, Men, Kids, Shoes, Accessories, Offers
- 📱 **Fully responsive** — mobile, tablet, desktop
- 🔍 **Product filtering & sorting**
- 🗄️ **REST API backend** with full CRUD

---

## 🗂️ Project Structure

```
E-Commerce-website/
├── Frontend/
│   └── voguex-ecommerce/          # React + Vite + Tailwind
│       └── src/
│           ├── pages/             # Home, Login, Register, Cart, Checkout, etc.
│           ├── components/        # Navbar, ProductCard
│           ├── context/           # AuthContext, CartContext
│           └── data/              # Local product fallback (180 products)
└── Backend/
    └── vougex-ecommerce/          # Node.js + Express + MySQL
        ├── controllers/           # Auth, Products, Cart, Orders, Wishlist
        ├── routes/                # API route definitions
        ├── middleware/            # JWT auth middleware
        ├── config/                # MySQL connection pool
        └── sql/                   # DB schema + seed data
```

---

## 🚀 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS        |
| Routing    | React Router v6                     |
| State      | Context API (Auth + Cart)           |
| Backend    | Node.js, Express.js                 |
| Database   | MySQL + mysql2                      |
| Auth       | JWT (jsonwebtoken) + bcryptjs       |
| Icons      | Lucide React                        |
| Fonts      | Playfair Display, DM Sans           |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/Arpita-hegde031/E-Commerce-website.git
cd E-Commerce-website
```

---

### 2. Set Up the Database

1. Open **MySQL Workbench**
2. Open `Backend/vougex-ecommerce/sql/voguex_db.sql`
3. Press `Ctrl + Shift + Enter` to run all statements
4. You should see: `Setup complete! 44 products seeded.`

---

### 3. Configure Backend Environment

Create a `.env` file inside `Backend/vougex-ecommerce/`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=voguex_db
JWT_SECRET=voguex_super_secret_key
CLIENT_URL=http://localhost:5173
```

---

### 4. Start the Backend

```bash
cd Backend/vougex-ecommerce
npm install
npm run dev
```

✅ Server runs at `http://localhost:5000`

---

### 5. Start the Frontend

Open a **new terminal**:

```bash
cd Frontend/voguex-ecommerce
npm install
npm run dev
```

✅ App runs at `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | `/api/auth/register`  | Create account     |
| POST   | `/api/auth/login`     | Login → JWT token  |
| GET    | `/api/auth/me`        | Get current user   |

### Products
| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/api/products`       | All products (filter/sort/search)  |
| GET    | `/api/products/:id`   | Single product                     |

### Cart (🔐 Protected)
| Method | Endpoint                   | Description       |
|--------|----------------------------|-------------------|
| GET    | `/api/cart`                | Get cart          |
| POST   | `/api/cart`                | Add item          |
| PUT    | `/api/cart/:product_id`    | Update quantity   |
| DELETE | `/api/cart/:product_id`    | Remove item       |

### Orders (🔐 Protected)
| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| POST   | `/api/orders`    | Place order         |
| GET    | `/api/orders`    | My order history    |
| GET    | `/api/orders/:id`| Order detail        |

### Wishlist (🔐 Protected)
| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| GET    | `/api/wishlist`  | Get wishlist        |
| POST   | `/api/wishlist`  | Add to wishlist     |
| DELETE | `/api/wishlist/:product_id` | Remove  |

---

## 🗃️ Database Schema

```
users         — id, name, email, password, role
categories    — id, slug, name
products      — id, name, price, category, tag, rating, image, colors, stock
orders        — id, user_id, status, total_amount, shipping, payment_method
order_items   — id, order_id, product_id, quantity, price
cart          — id, user_id, product_id, quantity
wishlist      — id, user_id, product_id
```

---

## 📸 Pages

| Page           | Route              |
|----------------|--------------------|
| Home           | `/`                |
| Women          | `/category/women`  |
| Men            | `/category/men`    |
| Kids           | `/category/kids`   |
| Shoes          | `/category/shoes`  |
| Accessories    | `/category/accessories` |
| Offers         | `/category/offers` |
| Product Detail | `/product/:id`     |
| Cart           | `/cart`            |
| Checkout       | `/checkout`        |
| Login          | `/login`           |
| Register       | `/register`        |

---

## 📦 Product Catalog

| Category     | Items |
|--------------|-------|
| Women        | 30    |
| Men          | 30    |
| Kids         | 30    |
| Shoes        | 30    |
| Accessories  | 30    |
| Offers       | 30    |
| **Total**    | **180** |

---

## 🔒 Environment Variables

| Variable      | Description                  |
|---------------|------------------------------|
| `PORT`        | Backend server port (5000)   |
| `DB_HOST`     | MySQL host (localhost)       |
| `DB_PORT`     | MySQL port (3306)            |
| `DB_USER`     | MySQL username               |
| `DB_PASSWORD` | MySQL password               |
| `DB_NAME`     | Database name (voguex_db)    |
| `JWT_SECRET`  | Secret key for JWT tokens    |
| `CLIENT_URL`  | Frontend URL for CORS        |

> ⚠️ Never commit your `.env` file. Add it to `.gitignore`.

---

## 👩‍💻 Author

**Arpita Hegde**  
GitHub: [@Arpita-hegde031](https://github.com/Arpita-hegde031)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
