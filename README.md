# Social Posts API Documentation
A RESTful API built with AdonisJS 6 for managing user posts, reactions, and authentication.

## Table of Contents
- [Requirements](#requirements)
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)

## Requirements
- Node.js >= 18.0.0
- npm >= 8.0.0

## Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/bishworup11/Learn_Adonis_js-.git
cd Learn_Adonis_js
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=<your-app-key>
DB_CONNECTION=pg
PG_HOST=localhost
PG_PORT=5432
PG_USER=<your-db-user>
PG_PASSWORD=<your-db-password>
PG_DB_NAME=<your-db-name>
```

5. Run migrations:
```bash
node ace migration:run
```

6. Start the development server:
```bash
node ace serve --watch
```


## Authentication
The API uses AdonisJS built-in authentication middleware. Two authentication guards are available:
- `web`: For session-based authentication
- `api`: For token-based authentication

## API Endpoints

### User Management

#### Register User
```
POST /user/register
```
Creates a new user account.

#### Login
```
POST /user/login
```
Authenticates a user and creates a session.

#### Logout
```
POST /user/logout
```
Ends the current user session.
**Requires Authentication**

#### Get User Profile
```
GET /user
```
Retrieves the current user's profile.
**Requires Authentication**

#### Get Users by Post Count
```
GET /users-by-post-count
```
Retrieves users sorted by their post count.

#### Get User Tokens
```
GET /tokens
```
Retrieves user API tokens.
**Requires API Authentication**

### Post Management

All post management routes require authentication.

#### Get Posts
```
GET /get-post
```
Query Parameters:
- `limit` (optional): Number of posts to retrieve
- `page` (optional): Page number for pagination
- `postId` (optional): Specific post ID to retrieve

#### Get Posts by User
```
GET /get-post-user
```
Query Parameters:
- `userId` (required): ID of the user whose posts to retrieve
- `limit` (optional): Number of posts to retrieve
- `page` (optional): Page number for pagination

#### Create Post
```
POST /create-post
```
Request Body:
- `text`: Content of the post
- Additional fields based on validator requirements

#### Update Post
```
POST /update-post
```
Request Body:
- `postId`: ID of the post to update
- `text`: Updated content

#### Delete Post
```
POST /delete-post
```
Request Body:
- `postId`: ID of the post to delete

#### React to Post
```
POST /post-react
```
Request Body:
- `postId`: ID of the post to react to
- `reactType`: Type of reaction

#### Toggle Post Visibility
```
POST /post-visibility
```
Request Body:
- `postId`: ID of the post to toggle visibility

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "message": "Error description",
  "error": "Detailed error message (if available)"
}
```

## Development Notes

1. The project uses TypeScript for better type safety and developer experience.
2. Validators are implemented for all routes to ensure data integrity.
3. Business logic is separated into service classes for better maintainability.
4. Authentication middleware is applied at both group and individual route levels.

## Testing

To run tests (assuming they are set up):
```bash
node ace test
```

## Additional Configuration

### Database Configuration
Configure your database in `config/database.ts`:
```typescript
{
  connection: Env.get('DB_CONNECTION'),
  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: Env.get('PG_HOST'),
        port: Env.get('PG_PORT'),
        user: Env.get('PG_USER'),
        password: Env.get('PG_PASSWORD'),
        database: Env.get('PG_DB_NAME'),
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: true,
      debug: false,
    },
  },
}
```

### Middleware Configuration
Ensure your middleware is properly configured in `start/kernel.ts`.

## Production Deployment

1. Build the project:
```bash
node ace build
```

2. Set environment variables for production.

3. Run migrations:
```bash
node ace migration:run --force
```

4. Start the server:
```bash
cd build
node server.js
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Security Considerations
- Always use HTTPS in production
- Implement rate limiting
- Keep dependencies updated
- Follow security best practices for AdonisJS applications