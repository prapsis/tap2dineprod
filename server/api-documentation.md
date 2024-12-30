# Restaurant Management API Documentation

## Authentication

All endpoints except user registration require authentication. Use JWT token authentication by including the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Base URL
```
http://localhost:8000/api/
```

## Endpoints

### User Management

#### Register User
- **URL**: `/register/`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "password2": "string"
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `400 Bad Request` if passwords don't match or validation fails

### Tables

#### List Tables
- **URL**: `/tables/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: List of all tables with their QR codes

#### Create Table
- **URL**: `/tables/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "string"
  }
  ```
- **Success Response**: `201 Created` with QR code automatically generated
- **Notes**: QR code is automatically generated linking to `/digi-menu/{table_name}`

#### Get Single Table
- **URL**: `/tables/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes

#### Update Table
- **URL**: `/tables/{id}/`
- **Method**: `PUT/PATCH`
- **Auth Required**: Yes

#### Delete Table
- **URL**: `/tables/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes

### Categories

#### List Categories
- **URL**: `/categories/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: List of all categories

#### Create Category
- **URL**: `/categories/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```

#### Get/Update/Delete Category
- **URL**: `/categories/{id}/`
- **Methods**: `GET`, `PUT`, `PATCH`, `DELETE`
- **Auth Required**: Yes

### Dishes

#### List Dishes
- **URL**: `/dishes/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: List of all dishes with ingredients and add-ons

#### Create Dish
- **URL**: `/dishes/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "decimal",
    "ingredients": [1, 2, 3],
    "add_ons": [1, 2, 3],
    "category": 1
  }
  ```

#### Get Dishes by Category
- **URL**: `/dishes/category/{category_id}/dishes/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: List of dishes in specified category

#### Get/Update/Delete Dish
- **URL**: `/dishes/{id}/`
- **Methods**: `GET`, `PUT`, `PATCH`, `DELETE`
- **Auth Required**: Yes

### Ingredients

#### List/Create Ingredients
- **URL**: `/ingredients/`
- **Methods**: `GET`, `POST`
- **Auth Required**: Yes
- **Create Request Body**:
  ```json
  {
    "name": "string",
    "quantity_available": "integer"
  }
  ```

#### Get/Update/Delete Ingredient
- **URL**: `/ingredients/{id}/`
- **Methods**: `GET`, `PUT`, `PATCH`, `DELETE`
- **Auth Required**: Yes

### Add-ons

#### List/Create Add-ons
- **URL**: `/add-ons/`
- **Methods**: `GET`, `POST`
- **Auth Required**: Yes
- **Create Request Body**:
  ```json
  {
    "name": "string",
    "price": "decimal"
  }
  ```

#### Get/Update/Delete Add-on
- **URL**: `/add-ons/{id}/`
- **Methods**: `GET`, `PUT`, `PATCH`, `DELETE`
- **Auth Required**: Yes

### Orders

#### List Orders
- **URL**: `/orders/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: List of all orders sorted by creation date

#### Create Order
- **URL**: `/orders/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "table": 1,
    "dish_ids": [1, 2, 3],
    "remarks": "string (optional)"
  }
  ```
- **Notes**: 
  - Automatically checks ingredient availability
  - Decrements ingredient quantities
  - Sends notification on order creation

#### Update Order Status
- **URL**: `/orders/{id}/update_status/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "status": "string" // "Pending", "Preparing", or "Completed"
  }
  ```

#### Checkout Order
- **URL**: `/orders/{id}/checkout/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "total_amount": "decimal",
    "payment_method": "string"
  }
  ```
- **Notes**: 
  - Order must be in "Completed" status
  - Cannot checkout already checked-out orders

#### Get/Update/Delete Order
- **URL**: `/orders/{id}/`
- **Methods**: `GET`, `PUT`, `PATCH`, `DELETE`
- **Auth Required**: Yes

## Error Responses

The API may return the following error codes:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

All error responses include a message explaining the error.
