# API Documentation

This document provides comprehensive documentation for the Rent Management System Backend API.

## 📌 Base Information

- **Base URL:** `https://api-rms.onrender.com`
- **API Version:** v1
- **Content-Type:** `application/json`
- **Authentication:** Bearer token in Authorization header
- **📚 Documentation Hub:** [https://api-rms.onrender.com/api/docs](https://api-rms.onrender.com/api/docs)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login, you'll receive a token that must be included in subsequent requests.

### Authentication Header Format
```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration
- Tokens expire after 7 days by default
- Use the `/user/l/isLogedin` endpoint to check token validity

## 📚 API Endpoints

### 🏠 Health Check

#### GET `/`
Check if the API is running and get welcome message.

**Request:**
```http
GET https://api-rms.onrender.com/
```

**Response:**
```json
{
  "page": "home",
  "message": "Welcome to Rent Management System API",
  "version": "1.0.0",
  "author": "Saroj Dhakal",
  "documentation": {
    "docs_hub": "/api/docs",
    "readme": "/api/docs/readme",
    "readme_html": "/api/docs/readme/html",
    "api_docs": "/api/docs/api",
    "api_docs_html": "/api/docs/api/html",
    "github": "https://github.com/Sarojdhakal307/Rent-Management-System-Backend"
  },
  "endpoints": {
    "landlord": "/api/user/l/*",
    "tenant": "/api/user/t/*",
    "test": "/api/test/*"
  },
  "status": "🟢 Online"
}
```

#### GET `/api`
Get API home information with documentation links.

**Request:**
```http
GET https://api-rms.onrender.com/api
```

**Response:**
```json
{
  "page": "home",
  "message": "Welcome to Rent Management System API",
  "version": "1.0.0",
  "author": "Saroj Dhakal",
  "documentation": {
    "docs_hub": "/api/docs",
    "readme": "/api/docs/readme",
    "readme_html": "/api/docs/readme/html",
    "api_docs": "/api/docs/api",
    "api_docs_html": "/api/docs/api/html",
    "github": "https://github.com/Sarojdhakal307/Rent-Management-System-Backend"
  },
  "endpoints": {
    "landlord": "/api/user/l/*",
    "tenant": "/api/user/t/*",
    "test": "/api/test/*"
  },
  "status": "🟢 Online"
}
```

---

## 📚 Documentation Endpoints

The API now includes a dedicated documentation system with multiple access methods:

### 📖 Documentation Hub

#### GET `/api/docs`
Beautiful landing page with links to all documentation.

**Request:**
```http
GET https://api-rms.onrender.com/api/docs
```

**Response:** 
Renders a beautiful HTML landing page with:
- Links to all documentation sections
- Project information and live API status
- Navigation to README and API documentation
- Direct links to GitHub repository

### 📄 Raw Markdown Documentation

#### GET `/api/docs/readme`
Get README.md content as plain text.

**Request:**
```http
GET https://api-rms.onrender.com/api/docs/readme
```

**Response:**
Returns the raw markdown content of README.md file.

#### GET `/api/docs/api`
Get API documentation as plain text.

**Request:**
```http
GET https://api-rms.onrender.com/api/docs/api
```

**Response:**
Returns the raw markdown content of docs.md file.

### 🌐 HTML Rendered Documentation

#### GET `/api/docs/readme/html`
Get beautifully rendered README with GitHub styling.

**Request:**
```http
GET https://api-rms.onrender.com/api/docs/readme/html
```

**Response:**
Returns fully rendered HTML page with:
- GitHub-style markdown rendering
- Navigation links between documentation sections
- Mobile-responsive design
- Professional styling

#### GET `/api/docs/api/html`
Get beautifully rendered API documentation.

**Request:**
```http
GET https://api-rms.onrender.com/api/docs/api/html
```

**Response:**
Returns fully rendered HTML page with:
- Complete API documentation
- Syntax highlighting for code blocks
- Interactive navigation
- Professional GitHub-style presentation

---

## 🏗️ Project Architecture

The API follows a modular architecture with organized routing:

### Router Structure
- **Main Router** (`/api`): Central routing hub
- **User Router** (`/api/user`): All user-related endpoints (landlord & tenant)
- **Documentation Router** (`/api/docs`): Complete documentation system
- **Test Router** (`/api/test`): Testing and development endpoints

### Key Features
- **Modular Design**: Separated concerns with dedicated routers
- **Built-in Documentation**: Live documentation served by the API itself
- **Multiple Documentation Formats**: Raw markdown and rendered HTML
- **Professional UI**: GitHub-style rendering with navigation
- **Mobile Responsive**: Documentation works on all devices

---

## 🏘️ Landlord Endpoints

### 📝 Landlord Registration

#### POST `/api/user/l/signup`
Request landlord account creation (sends verification email).

**Request:**
```http
POST https://api-rms.onrender.com/api/user/l/signup
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "address": "123 Main St, City, Country"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent. Please check your email.",
  "data": {
    "email": "john@example.com"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Email already exists",
  "error": "DUPLICATE_EMAIL"
}
```

#### POST `/api/user/l/signup-verify`
Verify landlord account with verification code.

**Request:**
```http
POST https://api-rms.onrender.com/api/user/l/signup-verify
Content-Type: application/json

{
  "email": "john@example.com",
  "verificationCode": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account verified successfully",
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 🔑 Landlord Authentication

#### POST `/api/user/l/login`
Authenticate landlord and receive JWT token.

**Request:**
```http
POST https://api-rms.onrender.com/api/user/l/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "landlord": {
      "id": "uuid-here",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "address": "123 Main St, City, Country",
      "role": "landlord"
    },
    "token": "jwt-token-here"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### GET `/api/user/l/isLogedin`
Check if landlord is authenticated.

**Request:**
```http
GET https://api-rms.onrender.com/api/user/l/isLogedin
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "authenticated": true,
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "landlord"
  }
}
```

### 🔒 Change Password

#### PUT `/api/user/l/changepassword`
Change landlord password.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```http
PUT https://api-rms.onrender.com/api/user/l/changepassword
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## 👥 Tenant Management Endpoints

### ➕ Add Tenant

#### POST `/api/user/l/addtenant`
Add a new tenant (landlord only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```http
POST https://api-rms.onrender.com/api/user/l/addtenant
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "fullname": "Jane Smith",
  "permanentaddress": "456 Oak Ave, Town, Country",
  "document": "citizen",
  "documentnumber": "DOC123456789",
  "livingspacetype": "flat",
  "livingspacenumber": "A-101"
}
```

**Document Types:**
- `passport`
- `citizen`
- `id`

**Living Space Types:**
- `flat`
- `room`

**Response:**
```json
{
  "success": true,
  "message": "Tenant added successfully",
  "data": {
    "tenant": {
      "id": "tenant-uuid-here",
      "fullname": "Jane Smith",
      "permanentaddress": "456 Oak Ave, Town, Country",
      "document": "citizen",
      "documentnumber": "DOC123456789",
      "livingspacetype": "flat",
      "livingspacenumber": "A-101",
      "generatedspaceid": "flat-A-101",
      "generateddocid": "generated-doc-id-here",
      "landlordid": "landlord-uuid-here",
      "role": "tenant"
    },
    "credentials": {
      "spaceid": "flat-A-101",
      "docid": "generated-doc-id-here"
    }
  }
}
```

### 📋 Get All Tenants

#### GET `/api/user/l/alltenant`
Get all tenants for the authenticated landlord.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```http
GET https://api-rms.onrender.com/api/user/l/alltenant
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Tenants retrieved successfully",
  "data": {
    "tenants": [
      {
        "id": "tenant-uuid-1",
        "fullname": "Jane Smith",
        "permanentaddress": "456 Oak Ave, Town, Country",
        "document": "citizen",
        "documentnumber": "DOC123456789",
        "livingspacetype": "flat",
        "livingspacenumber": "A-101",
        "generatedspaceid": "flat-A-101",
        "generateddocid": "generated-doc-id-1",
        "createdAt": "2025-01-15T10:30:00Z"
      },
      {
        "id": "tenant-uuid-2",
        "fullname": "Bob Johnson",
        "permanentaddress": "789 Pine St, Village, Country",
        "document": "passport",
        "documentnumber": "PASS987654321",
        "livingspacetype": "room",
        "livingspacenumber": "R-205",
        "generatedspaceid": "room-R-205",
        "generateddocid": "generated-doc-id-2",
        "createdAt": "2025-01-14T15:45:00Z"
      }
    ],
    "total": 2
  }
}
```

### 👤 Get Specific Tenant

#### GET `/api/user/l/tenant/:id`
Get details of a specific tenant.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```http
GET https://api-rms.onrender.com/api/user/l/tenant/tenant-uuid-here
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Tenant retrieved successfully",
  "data": {
    "tenant": {
      "id": "tenant-uuid-here",
      "fullname": "Jane Smith",
      "permanentaddress": "456 Oak Ave, Town, Country",
      "document": "citizen",
      "documentnumber": "DOC123456789",
      "livingspacetype": "flat",
      "livingspacenumber": "A-101",
      "generatedspaceid": "flat-A-101",
      "generateddocid": "generated-doc-id-here",
      "landlordid": "landlord-uuid-here",
      "role": "tenant",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Tenant not found"
}
```

### ❌ Delete Tenant

#### DELETE `/api/user/l/deletetenant/:id`
Delete a specific tenant.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```http
DELETE https://api-rms.onrender.com/api/user/l/deletetenant/tenant-uuid-here
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Tenant deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Tenant not found or unauthorized"
}
```

---

## 🏠 Tenant Endpoints

### 🔑 Tenant Authentication

#### POST `/api/user/t/login`
Authenticate tenant using generated credentials.

**Request:**
```http
POST https://api-rms.onrender.com/api/user/t/login
Content-Type: application/json

{
  "spaceid": "flat-A-101",
  "docid": "generated-doc-id-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "tenant": {
      "id": "tenant-uuid-here",
      "fullname": "Jane Smith",
      "permanentaddress": "456 Oak Ave, Town, Country",
      "document": "citizen",
      "documentnumber": "DOC123456789",
      "livingspacetype": "flat",
      "livingspacenumber": "A-101",
      "generatedspaceid": "flat-A-101",
      "role": "tenant"
    },
    "token": "jwt-token-here"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 👤 Tenant Profile

#### GET `/api/user/t/myprofile`
Get tenant's own profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```http
GET https://api-rms.onrender.com/api/user/t/myprofile
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "tenant": {
      "id": "tenant-uuid-here",
      "fullname": "Jane Smith",
      "permanentaddress": "456 Oak Ave, Town, Country",
      "document": "citizen",
      "documentnumber": "DOC123456789",
      "livingspacetype": "flat",
      "livingspacenumber": "A-101",
      "generatedspaceid": "flat-A-101",
      "role": "tenant",
      "createdAt": "2025-01-15T10:30:00Z"
    },
    "landlord": {
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Main St, City, Country"
    }
  }
}
```

---

## 🧪 Test Endpoints

### 🔧 Test Routes

#### GET `/api/test`
Test endpoint (requires tenant authentication).

**Headers:**
```
Authorization: Bearer <tenant-jwt-token>
```

**Request:**
```http
GET https://api-rms.onrender.com/api/test
Authorization: Bearer <tenant-jwt-token>
```

**Response:**
```json
{
  "Route": "test"
}
```

#### GET `/api/test/s`
Simple test endpoint (no authentication required).

**Request:**
```http
GET https://api-rms.onrender.com/api/test/s
```

**Response:**
```json
{
  "Route": "test/s"
}
```

---

## ❌ Error Handling

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": "Additional error details (optional)"
}
```

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `INVALID_CREDENTIALS` | Wrong email/password or spaceid/docid |
| `DUPLICATE_EMAIL` | Email already exists |
| `INVALID_TOKEN` | JWT token is invalid or expired |
| `UNAUTHORIZED` | Access denied for this resource |
| `VALIDATION_ERROR` | Request data validation failed |
| `NOT_FOUND` | Resource not found |
| `SERVER_ERROR` | Internal server error |

---

## 📝 Request/Response Examples

### Example: Complete Landlord Flow

1. **Register**
```bash
curl -X POST https://api-rms.onrender.com/api/user/l/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123",
    "address": "123 Main St, City, Country"
  }'
```

2. **Verify Account**
```bash
curl -X POST https://api-rms.onrender.com/api/user/l/signup-verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "verificationCode": "123456"
  }'
```

3. **Login**
```bash
curl -X POST https://api-rms.onrender.com/api/user/l/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

4. **Add Tenant**
```bash
curl -X POST https://api-rms.onrender.com/api/user/l/addtenant \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fullname": "Jane Smith",
    "permanentaddress": "456 Oak Ave, Town, Country",
    "document": "citizen",
    "documentnumber": "DOC123456789",
    "livingspacetype": "flat",
    "livingspacenumber": "A-101"
  }'
```

### Example: Tenant Login Flow

```bash
curl -X POST https://api-rms.onrender.com/api/user/t/login \
  -H "Content-Type: application/json" \
  -d '{
    "spaceid": "flat-A-101",
    "docid": "generated-doc-id-here"
  }'
```

---

## 🔒 Security Considerations

### Authentication
- All JWT tokens expire after 7 days
- Tokens are signed with a secure secret
- Use HTTPS in production

### Password Security
- Passwords are hashed using bcrypt
- Minimum password requirements should be enforced on frontend
- Password changes require current password verification

### CORS Configuration
- API is configured to accept requests from specific frontend origins
- Credentials are enabled for cookie-based sessions

### Input Validation
- All inputs are validated on the server side
- SQL injection protection through Drizzle ORM
- XSS protection through proper data sanitization

---

## 📊 Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing:
- Request rate limiting per IP
- Authentication attempt limiting
- API endpoint specific limits

---

## 🔄 Versioning

- Current API version: v1
- Base path includes version: `/api` (v1 is implicit)
- Breaking changes will require new version endpoints

---

## 📞 Support

For technical support or questions about this API:

1. **GitHub Issues:** [Create an issue](https://github.com/Sarojdhakal307/Rent-Management-System-Backend/issues)
2. **Email:** sarojdhakal307@gmail.com
3. **Documentation:** This file and README.md

---

**Last Updated:** July 2025
**API Version:** 1.0.0
**New Features:** Dedicated documentation router with HTML rendering and professional UI
