# NCIS403 Web Application Project: Group Assignment 2

This project includes a full-stack web application with:
- Node.js/Express backend
- React frontend
- RESTful API
- User authentication
- Profile management

## Project Structure

```
project/
│
├── backend/
│   ├── server.js         # Express server
│   ├── users.json        # User data storage
│   └── package.json      # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React application
│   │   ├── App.css       # App styling
│   │   ├── components/
│   │   │   ├── AuthForm.js   # Registration/Login component
│   │   │   ├── AuthForm.css  # AuthForm styling
│   │   │   ├── Profile.js    # User profile component
│   │   │   └── Profile.css   # Profile styling
│   │   └── index.js      # React entry point
│   │
│   └── package.json      # Frontend dependencies
│
├── exam_collection.json  # Postman collection
└── README.txt            # This file
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the server:
   ```
   npm start
   ```

The server will start on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm start
   ```

The React app will start on http://localhost:3000

## API Endpoints

- `POST /api/register` - Register a new user
  - Required fields: `username`, `email`, `password`

- `POST /api/login` - Authenticate a user
  - Required fields: `email`, `password`

- `GET /api/profile` - Get user profile (protected)
  - Required header: `X-API-Key: EXAM2024-KEY-5678`
  - Required query parameter: `userId`

- `PATCH /api/profile` - Update username (protected)
  - Required header: `X-API-Key: EXAM2024-KEY-5678`
  - Required fields: `userId`, `username`

## Testing with Postman

1. Import the `exam_collection.json` file into Postman
2. Use the collection to test all API endpoints
3. For protected routes, make sure the API key is included in the request header

## Implementation Notes

- Passwords are hashed using bcrypt with salt rounds of 10
- User data is stored in a JSON file (`users.json`)
- API key validation is implemented for protected routes
- Input validation is implemented for all user inputs
- Error handling is implemented for all API endpoints
- React components include real-time form validation