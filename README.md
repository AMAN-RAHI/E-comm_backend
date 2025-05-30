# E-Comm Backend

## Overview
This project is the backend for an e-commerce application. It is built using Node.js and Express.js, and provides APIs for managing users, products, categories, orders, and more.

## Features
- User authentication and management
- Product and category management
- Shopping cart functionality
- Address management
- Order processing
- Home slider management
- My List feature for personalized items

## Technologies Used
- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for creating APIs.
- **MongoDB**: Database for storing application data.
- **dotenv**: For environment variable management.
- **Helmet**: For securing HTTP headers.
- **Morgan**: For logging HTTP requests.
- **Cors**: For handling cross-origin requests.
- **Cookie-Parser**: For parsing cookies.

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project directory:
    ```bash
    cd E-comm_backend
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=3000
    MONGO_URI=<your-mongodb-uri>
    ```

5. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

### User Routes
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create a new user

### Category Routes
- `GET /api/category` - Fetch all categories
- `POST /api/category` - Create a new category

### Product Routes
- `GET /api/product` - Fetch all products
- `POST /api/product` - Create a new product

### Cart Routes
- `GET /api/cart` - Fetch cart items
- `POST /api/cart` - Add item to cart

### My List Routes
- `GET /api/myList` - Fetch items in My List
- `POST /api/myList` - Add item to My List

### Address Routes
- `GET /api/address` - Fetch addresses
- `POST /api/address` - Add a new address

### Slider Routes
- `GET /api/homeslider` - Fetch slider items
- `POST /api/homeslider` - Add slider item

### Order Routes
- `GET /api/orders` - Fetch orders
- `POST /api/orders` - Create a new order

## License
This project is licensed under the MIT License.