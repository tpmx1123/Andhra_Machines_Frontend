# Murthy Sewing Machines - API Documentation

## Base URL
```
Production: https://api.murthysewingmachines.com
Development: http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents
1. [Authentication & Users](#authentication--users)
2. [Products](#products)
3. [Brands](#brands)
4. [Cart](#cart)
5. [Favorites/Wishlist](#favoriteswishlist)
6. [Reviews](#reviews)
7. [Orders](#orders)
8. [Blog](#blog)
9. [Search](#search)
10. [Contact & Inquiries](#contact--inquiries)
11. [Categories](#categories)

---

## Authentication & Users

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "phone": "+91 9876543210",
  "address": {
    "street": "123 Main Street",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 9876543210",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "address": {
      "street": "123 Main Street",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "pincode": "600001"
    },
    "ordersCount": 5,
    "wishlistCount": 3,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update User Profile
**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+91 9876543211",
  "address": {
    "street": "456 New Street",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600002"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_123",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "+91 9876543211",
    "address": { ... }
  }
}
```

---

## Products

### Get All Products
**GET** `/products`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 16)
- `category` (optional): Filter by category (domestic, industrial, embroidery, overlock, accessories)
- `brand` (optional): Filter by brand ID
- `minPrice` (optional): Minimum price in INR
- `maxPrice` (optional): Maximum price in INR
- `sort` (optional): Sort by (featured, price-low-high, price-high-low, top-rated, newest)
- `search` (optional): Search query
- `inStock` (optional): Filter by stock availability (true/false)
- `isNew` (optional): Filter new products (true/false)
- `isOnSale` (optional): Filter sale products (true/false)

**Example:**
```
GET /products?category=domestic&sort=price-low-high&page=1&limit=16
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123",
        "name": "Usha Excel Automatic Sewing Machine",
        "brand": {
          "id": "brand_usha",
          "name": "Usha",
          "logo": "https://..."
        },
        "price": 20749,
        "originalPrice": 24999,
        "currency": "INR",
        "images": [
          "https://res.cloudinary.com/.../image1.jpg",
          "https://res.cloudinary.com/.../image2.jpg"
        ],
        "category": "domestic",
        "rating": 4.5,
        "reviewCount": 128,
        "inStock": true,
        "stock": 15,
        "isNew": true,
        "isOnSale": true,
        "sku": "USHA-EXCEL-2024",
        "warranty": "2 Years",
        "description": "Experience smooth and efficient sewing...",
        "features": [
          "23 Built-in Stitches",
          "4-Step Buttonhole",
          "Free Arm"
        ],
        "specifications": {
          "Stitch Types": "23",
          "Buttonhole Styles": "4-step",
          "Max Stitch Length": "5mm",
          "Max Stitch Width": "5mm",
          "Weight": "6.5 kg"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 78,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Single Product
**GET** `/products/:productId`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "Usha Excel Automatic Sewing Machine",
    "brand": {
      "id": "brand_usha",
      "name": "Usha",
      "logo": "https://...",
      "image": "https://..."
    },
    "price": 20749,
    "originalPrice": 24999,
    "currency": "INR",
    "images": [...],
    "category": "domestic",
    "rating": 4.5,
    "reviewCount": 128,
    "inStock": true,
    "stock": 15,
    "isNew": true,
    "isOnSale": true,
    "sku": "USHA-EXCEL-2024",
    "warranty": "2 Years",
    "description": "Full description...",
    "features": [...],
    "specifications": {...},
    "accessories": [
      {
        "id": "acc_1",
        "name": "Extra Bobbins Set",
        "description": "Set of 5 bobbins",
        "price": 299,
        "image": "https://...",
        "rating": 4.3
      }
    ],
    "relatedProducts": [...],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Featured Products
**GET** `/products/featured`

**Query Parameters:**
- `limit` (optional): Number of products (default: 8)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...]
  }
}
```

### Get New Products
**GET** `/products/new`

**Query Parameters:**
- `limit` (optional): Number of products (default: 8)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...]
  }
}
```

### Get Sale Products
**GET** `/products/sale`

**Query Parameters:**
- `limit` (optional): Number of products (default: 8)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...]
  }
}
```

### Create Product (Admin Only)
**POST** `/products`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "New Sewing Machine",
  "brandId": "brand_usha",
  "price": 20000,
  "originalPrice": 25000,
  "category": "domestic",
  "description": "Product description...",
  "features": ["Feature 1", "Feature 2"],
  "specifications": {
    "Stitch Types": "23",
    "Weight": "6.5 kg"
  },
  "images": ["https://..."],
  "stock": 10,
  "sku": "NEW-SKU-001",
  "warranty": "2 Years",
  "isNew": true,
  "isOnSale": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": { ... }
  }
}
```

### Update Product (Admin Only)
**PUT** `/products/:productId`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:** (Same as create, all fields optional)

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": { ... }
  }
}
```

### Delete Product (Admin Only)
**DELETE** `/products/:productId`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Brands

### Get All Brands
**GET** `/brands`

**Response:**
```json
{
  "success": true,
  "data": {
    "brands": [
      {
        "id": "brand_usha",
        "name": "Usha",
        "slug": "usha",
        "logo": "https://res.cloudinary.com/.../usha_logo.png",
        "image": "https://res.cloudinary.com/.../usha_banner.jpg",
        "description": "Usha is one of India's leading...",
        "productCount": 25,
        "establishedYear": 1975,
        "website": "https://www.usha.com"
      }
    ]
  }
}
```

### Get Single Brand
**GET** `/brands/:brandId`

**Query Parameters:**
- `page` (optional): Page number for products
- `limit` (optional): Products per page

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "brand_usha",
    "name": "Usha",
    "slug": "usha",
    "logo": "https://...",
    "image": "https://...",
    "description": "Full brand description...",
    "productCount": 25,
    "establishedYear": 1975,
    "website": "https://www.usha.com",
    "products": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalProducts": 25
    }
  }
}
```

### Create Brand (Admin Only)
**POST** `/brands`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "New Brand",
  "slug": "new-brand",
  "logo": "https://...",
  "image": "https://...",
  "description": "Brand description...",
  "establishedYear": 2000,
  "website": "https://www.newbrand.com"
}
```

---

## Cart

### Get Cart
**GET** `/cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart_item_123",
        "product": {
          "id": "prod_123",
          "name": "Usha Excel Automatic",
          "image": "https://...",
          "price": 20749,
          "inStock": true
        },
        "quantity": 2,
        "accessories": [
          {
            "id": "acc_1",
            "name": "Extra Bobbins Set",
            "price": 299,
            "quantity": 1
          }
        ],
        "subtotal": 41498,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 41797,
    "itemCount": 2
  }
}
```

### Add to Cart
**POST** `/cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "prod_123",
  "quantity": 1,
  "accessories": [
    {
      "id": "acc_1",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cartItem": { ... },
    "cart": {
      "total": 21048,
      "itemCount": 1
    }
  }
}
```

### Update Cart Item
**PUT** `/cart/:cartItemId`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated",
  "data": {
    "cartItem": { ... }
  }
}
```

### Remove from Cart
**DELETE** `/cart/:cartItemId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

### Clear Cart
**DELETE** `/cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

## Favorites/Wishlist

### Get Wishlist
**GET** `/wishlist`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "wish_123",
        "product": {
          "id": "prod_123",
          "name": "Usha Excel Automatic",
          "image": "https://...",
          "price": 20749,
          "rating": 4.5
        },
        "addedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "count": 5
  }
}
```

### Add to Wishlist
**POST** `/wishlist`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "prod_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to wishlist",
  "data": {
    "wishlistItem": { ... }
  }
}
```

### Remove from Wishlist
**DELETE** `/wishlist/:productId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product removed from wishlist"
}
```

### Check if Product is in Wishlist
**GET** `/wishlist/check/:productId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorite": true
  }
}
```

---

## Reviews

### Get Product Reviews
**GET** `/products/:productId/reviews`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Reviews per page (default: 10)
- `rating` (optional): Filter by rating (1-5)

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev_123",
        "user": {
          "id": "user_123",
          "name": "John Doe"
        },
        "rating": 5,
        "comment": "Excellent sewing machine!",
        "verifiedPurchase": true,
        "helpfulCount": 12,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "summary": {
      "averageRating": 4.5,
      "totalReviews": 128,
      "ratingDistribution": {
        "5": 80,
        "4": 30,
        "3": 12,
        "2": 4,
        "1": 2
      }
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 13
    }
  }
}
```

### Create Review
**POST** `/products/:productId/reviews`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great product, highly recommended!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review added successfully",
  "data": {
    "review": { ... }
  }
}
```

### Update Review
**PUT** `/reviews/:reviewId`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated review comment"
}
```

### Delete Review
**DELETE** `/reviews/:reviewId`

**Headers:**
```
Authorization: Bearer <token>
```

### Mark Review as Helpful
**POST** `/reviews/:reviewId/helpful`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Review marked as helpful",
  "data": {
    "helpfulCount": 13
  }
}
```

---

## Orders

### Create Order
**POST** `/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod_123",
      "quantity": 1,
      "accessories": [
        {
          "id": "acc_1",
          "quantity": 1
        }
      ]
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+91 9876543210",
    "street": "123 Main Street",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600001"
  },
  "paymentMethod": "razorpay",
  "paymentId": "pay_123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "id": "order_123",
      "orderNumber": "ORD-2024-001",
      "items": [...],
      "subtotal": 21048,
      "shipping": 0,
      "tax": 3789,
      "total": 24837,
      "status": "pending",
      "paymentStatus": "paid",
      "shippingAddress": {...},
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Get User Orders
**GET** `/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Orders per page
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_123",
        "orderNumber": "ORD-2024-001",
        "items": [...],
        "total": 24837,
        "status": "delivered",
        "paymentStatus": "paid",
        "createdAt": "2024-01-15T10:30:00Z",
        "deliveredAt": "2024-01-20T14:30:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### Get Single Order
**GET** `/orders/:orderId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_123",
      "orderNumber": "ORD-2024-001",
      "items": [...],
      "subtotal": 21048,
      "shipping": 0,
      "tax": 3789,
      "total": 24837,
      "status": "delivered",
      "paymentStatus": "paid",
      "shippingAddress": {...},
      "trackingNumber": "TRACK123456",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:30:00Z"
    }
  }
}
```

### Update Order Status (Admin Only)
**PUT** `/orders/:orderId/status`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

### Cancel Order
**POST** `/orders/:orderId/cancel`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## Blog

### Get All Blog Posts
**GET** `/blog`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Posts per page (default: 10)
- `category` (optional): Filter by category
- `tag` (optional): Filter by tag

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post_123",
        "title": "How to Choose the Right Sewing Machine",
        "slug": "how-to-choose-right-sewing-machine",
        "excerpt": "A comprehensive guide...",
        "content": "Full blog post content...",
        "featuredImage": "https://...",
        "author": {
          "id": "author_1",
          "name": "Admin"
        },
        "category": "guides",
        "tags": ["sewing", "guide", "tips"],
        "publishedAt": "2024-01-15T10:30:00Z",
        "readTime": 5,
        "views": 1250
      }
    ],
    "pagination": {...}
  }
}
```

### Get Single Blog Post
**GET** `/blog/:slug`

**Response:**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "post_123",
      "title": "How to Choose the Right Sewing Machine",
      "slug": "how-to-choose-right-sewing-machine",
      "content": "Full HTML content...",
      "featuredImage": "https://...",
      "author": {...},
      "category": "guides",
      "tags": ["sewing", "guide"],
      "publishedAt": "2024-01-15T10:30:00Z",
      "readTime": 5,
      "views": 1251,
      "relatedPosts": [...]
    }
  }
}
```

### Get Featured Blog Post
**GET** `/blog/featured`

**Response:**
```json
{
  "success": true,
  "data": {
    "post": { ... }
  }
}
```

### Create Blog Post (Admin Only)
**POST** `/blog`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "New Blog Post",
  "slug": "new-blog-post",
  "content": "Blog content...",
  "excerpt": "Short excerpt...",
  "featuredImage": "https://...",
  "category": "guides",
  "tags": ["tag1", "tag2"],
  "isFeatured": false,
  "published": true
}
```

---

## Search

### Search Products
**GET** `/search`

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number
- `limit` (optional): Results per page
- `category` (optional): Filter by category
- `brand` (optional): Filter by brand

**Example:**
```
GET /search?q=sewing+machine&category=domestic
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "brands": [...],
    "query": "sewing machine",
    "totalResults": 45,
    "pagination": {...}
  }
}
```

---

## Contact & Inquiries

### Submit Contact Form
**POST** `/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "subject": "Product Inquiry",
  "message": "I would like to know more about...",
  "productId": "prod_123" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your inquiry has been submitted successfully",
  "data": {
    "inquiryId": "inq_123"
  }
}
```

### Get Inquiries (Admin Only)
**GET** `/contact/inquiries`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number
- `status` (optional): Filter by status (pending, responded, resolved)

**Response:**
```json
{
  "success": true,
  "data": {
    "inquiries": [
      {
        "id": "inq_123",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91 9876543210",
        "subject": "Product Inquiry",
        "message": "...",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

## Categories

### Get All Categories
**GET** `/categories`

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_domestic",
        "name": "Domestic Machines",
        "slug": "domestic",
        "description": "Home sewing machines...",
        "productCount": 45,
        "image": "https://..."
      },
      {
        "id": "cat_industrial",
        "name": "Industrial Machines",
        "slug": "industrial",
        "description": "Professional industrial machines...",
        "productCount": 20,
        "image": "https://..."
      }
    ]
  }
}
```

### Get Single Category
**GET** `/categories/:categoryId`

**Query Parameters:**
- `page` (optional): Page number for products
- `limit` (optional): Products per page

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "cat_domestic",
      "name": "Domestic Machines",
      "slug": "domestic",
      "description": "...",
      "productCount": 45,
      "image": "https://...",
      "products": [...],
      "pagination": {...}
    }
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please login."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

API requests are rate-limited:
- **Authenticated users**: 100 requests per minute
- **Unauthenticated users**: 20 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Pagination

All list endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Pagination response format:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## File Upload

For image uploads (products, brands, blog posts), use:

**POST** `/upload`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData with 'image' field
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "publicId": "image_123"
  }
}
```

---

## Webhooks

### Order Status Updates
When order status changes, a webhook is sent to registered endpoints:
```json
{
  "event": "order.status.updated",
  "data": {
    "orderId": "order_123",
    "orderNumber": "ORD-2024-001",
    "status": "shipped",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## Notes

1. All prices are in **Indian Rupees (INR)**
2. All timestamps are in **ISO 8601 format (UTC)**
3. Image URLs use **Cloudinary** for hosting
4. Payment integration supports **Razorpay** and **Cash on Delivery**
5. JWT tokens expire after **7 days** (refresh token available)
6. All text fields support **UTF-8** encoding
7. Maximum file upload size: **10MB** per image

---

## Support

For API support, contact:
- Email: api-support@murthysewingmachines.com
- Documentation: https://docs.murthysewingmachines.com

