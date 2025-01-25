# Restaurant Management System API Documentation

## Authentication

### User Registration
- **Endpoint**: `/api/register/`
- **Method**: `POST`
- **Permissions**: Allow Any
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "password2": "string"
  }
  ```
- **Responses**:
  - `201`: User registered successfully
  - `400`: Validation errors

### Token Authentication
- **Obtain Token**: `/api/auth/token`
- **Refresh Token**: `/api/auth/token/refresh`
- **Verify Token**: `/api/auth/token/verify`

## Categories

### List Categories
- **Endpoint**: `/api/categories/`
- **Method**: `GET`
- **Permissions**: Allow Any
- **Response**: Array of category objects
  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string"
  }
  ```

### Create Category
- **Endpoint**: `/api/categories/`
- **Method**: `POST`
- **Permissions**: Authenticated
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```

## Dishes

### List Dishes
- **Endpoint**: `/api/dishes/`
- **Method**: `GET`
- **Permissions**: Allow Any
- **Response**: Array of dish objects
  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "decimal",
    "ingredients": [...],
    "add_ons": [...],
    "category": {...}
  }
  ```

### Get Dishes by Category
- **Endpoint**: `/api/dishes/category/{category_id}/dishes/`
- **Method**: `GET`
- **Permissions**: Allow Any
- **Response**: Array of dishes in specified category

### Create Dish
- **Endpoint**: `/api/dishes/`
- **Method**: `POST`
- **Permissions**: Authenticated
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "decimal",
    "ingredients": ["ingredient_ids"],
    "add_ons": ["addon_ids"],
    "category": "category_id"
  }
  ```

## Tables

### List Tables
- **Endpoint**: `/api/tables/`
- **Method**: `GET`
- **Permissions**: Authenticated
- **Response**: Array of table objects
  ```json
  {
    "id": "integer",
    "name": "string",
    "qr_code": "url"
  }
  ```

### Create Table
- **Endpoint**: `/api/tables/`
- **Method**: `POST`
- **Permissions**: Authenticated
- **Response**: Table details with QR code URL

## Orders

### Create Order
- **Endpoint**: `/api/orders/`
- **Method**: `POST`
- **Permissions**: Allow Any
- **Request Body**:
  ```json
  {
    "table": "table_id",
    "items": [
      {
        "dish": "dish_id",
        "add_ons": ["addon_ids"],
        "quantity": "integer"
      },
    "remarks":"optional",
    ]
  }
  ```

### Update Order Status
- **Endpoint**: `/api/orders/{order_id}/update_status/`
- **Method**: `PATCH`
- **Permissions**: Authenticated
- **Request Body**:
  ```json
  {
    "status": "Pending|Preparing|Completed"
  }
  ```

### Checkout Order
- **Endpoint**: `/api/orders/{order_id}/checkout/`
- **Method**: `PATCH`
- **Request Body**:
  ```json
  {
    "customer_name": "string",
    "customer_email": "string",
    "customer_phone": "string",
    "payment_method": "string"
  }
  ```

## Payment Integration (Khalti)

### Initiate Payment
- **Endpoint**: `/api/initiate-payment/`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "amount": "integer",
    "purchase_order_id": "string",
    "purchase_order_name": "string",
    "customer_name": "string",
    "customer_email": "string",
    "customer_phone": "string"
  }
  ```

### Verify Payment
- **Endpoint**: `/api/verify-payment/`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "pidx": "string"
  }
  ```

## Transactions

### List Transactions
- **Endpoint**: `/api/transactions/`
- **Method**: `GET`
- **Permissions**: Authenticated
- **Response**: List of completed and checked-out orders

## Additional Endpoints

- Ingredient Management: `/api/ingredients/`
- Add-On Management: `/api/add-ons/`

## Authentication Requirements
- Most endpoints require authentication
- `GET` endpoints for dishes, categories, and order creation are public
- Other endpoints require valid JWT token