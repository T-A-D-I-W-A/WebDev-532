# Web Application Development Assignment

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install express bcrypt
   ```

3. Start the server:
   ```
   node server.js
   ```
   The server will run on port 3000.

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install react react-dom react-scripts
   ```

3. Start the React development server:
   ```
   npm start
   ```
   The frontend will run on port 3001.

## API Endpoints

### POST /api/register
- Registers a new user
- Required fields: username, email, password
- Validation: email format, password length (8+ characters)

### POST /api/login
- Authenticates a user
- Required fields: email, password

### GET /api/profile
- Returns user profile data
- Required query parameter: userId
- Protected route: requires X-API-Key header

### PATCH /api/profile
- Updates a user's username
- Required fields: userId, username
- Validation: username must not be empty and contain no special characters
- Protected route: requires X-API-Key header

## Testing
Import the Postman collection (postman/exam_collection.json) to test all API endpoints.

## API Key
Use the following API key for all protected routes:
```
X-API-Key: EXAM2024-KEY-5678
```