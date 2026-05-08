# Assignment 3 - Dynamic Product Catalog

## What this includes
- Express + EJS products page with server-side pagination
- Search by name, category filter, price range filter
- Server-side sorting
- MongoDB seed script with 25 products

## Quick Start
1. Start MongoDB

```powershell
mongod --dbpath "D:\web-dev-lab\mongo-data"
```

2. Install dependencies

```powershell
cd D:\web-dev-lab\semester-project\assignment-3
npm install
```

3. Seed database (run once)

```powershell
node seed.js
```

4. Start server

```powershell
npm start
```

5. Open in browser

```
http://localhost:3000/products
```

## Query Parameters
- `page` (pagination)
- `search` (name search)
- `category` (category filter)
- `minPrice` and `maxPrice`
- `sort` (name_asc, price_asc, price_desc, rating_desc, stock_desc)
