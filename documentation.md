# AdonisJS 6 Beginner's Guide
A friendly, step-by-step guide to getting started with AdonisJS 6

## What is AdonisJS?
AdonisJS is a full-featured Node.js web framework that makes it easy to build web applications. Think of it as your trusty toolkit that helps you build websites and APIs without having to reinvent the wheel. It's similar to Ruby on Rails or Laravel, but for Node.js!

### Why Choose AdonisJS?
- 🛠️ Everything you need is included out of the box
- 📝 Great TypeScript support for fewer bugs
- 🚀 Easy to learn, especially if you're familiar with frameworks like Laravel
- 🏃‍♂️ Fast development with built-in features
- 🔒 Security features included by default

## Getting Started

### Prerequisites
Before we begin, make sure you have:
- Node.js installed (version 16.0 or higher)
- npm (Node Package Manager) installed
- Basic understanding of JavaScript/TypeScript
- A code editor (VS Code recommended)

### Creating Your First Project
Let's create your first AdonisJS project! Open your terminal and follow these steps:

```bash
# Create a new project
npm init adonisjs@latest my-first-app

# The CLI will ask you some questions:
# 1. Choose "web" for a full-stack application
# 2. Say "yes" to authentication - you'll thank yourself later!
# 3. Pick your preferred UI library (we recommend "tailwind" for beginners)

# Move into your project directory
cd my-first-app

# Start the development server
node ace serve --watch
```

Congratulations! 🎉 Visit `http://localhost:3333` to see your app running.

## Understanding the Project Structure
Let's break down what each folder does in your new project:

```
my-first-app/
├── app/               # This is where most of your code lives
│   ├── controllers/   # Handles user requests (like a traffic controller)
│   ├── models/        # Represents your database tables
│   └── middleware/    # Code that runs before requests (like security guards)
├── config/           # Your app's settings
├── database/         # Database-related files
├── resources/        # Frontend files (CSS, JavaScript, images)
├── start/           # Startup configuration
└── tests/           # Your test files
```

## Core Concepts Made Simple

### 1. Routing (URL Handling)
Think of routes as a reception desk that directs visitors to the right place in your app.

```typescript
// start/routes.ts - Your app's navigation map
import router from '@adonisjs/core/services/router'

// When someone visits the homepage
router.get('/', async () => {
  return 'Welcome to my website!'
})

// When someone visits /about
router.get('/about', async () => {
  return 'This is my first AdonisJS app!'
})

// A more complex example with parameters
router.get('/hello/:name', async ({ params }) => {
  return `Hello, ${params.name}!`
})
```

### 2. Controllers (Request Handlers)
Controllers are like department managers in your app. They handle specific types of requests.

```typescript
// app/controllers/welcome_controller.ts
import { HttpContext } from '@adonisjs/core/http'

export default class WelcomeController {
  // Show homepage
  async home({ view }: HttpContext) {
    // Get some data
    const welcomeMessage = 'Welcome to my site!'
    const features = ['Easy to use', 'Powerful', 'Fast']
    
    // Show the homepage view with our data
    return view.render('welcome', { welcomeMessage, features })
  }
}
```

### 3. Models (Database Tables)
Models are like spreadsheets that help you work with your database. Here's a simple example:

```typescript
// app/models/user.ts
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string
}
```

## Common Tasks (With Examples!)

### 1. Creating a Simple Blog Post Form
```typescript
// app/controllers/posts_controller.ts
export default class PostsController {
  // Show the form
  async create({ view }: HttpContext) {
    return view.render('posts/create')
  }

  // Handle form submission
  async store({ request, response, session }: HttpContext) {
    // Get data from the form
    const data = request.only(['title', 'content'])
    
    try {
      // Save to database
      await Post.create(data)
      
      // Show success message
      session.flash('success', 'Post created successfully!')
      return response.redirect('/posts')
    } catch (error) {
      // Show error message
      session.flash('error', 'Something went wrong!')
      return response.redirect().back()
    }
  }
}
```

### 2. Simple User Authentication
```typescript
// In your routes file
router.post('/login', async ({ auth, request, response }) => {
  const { email, password } = request.only(['email', 'password'])
  
  try {
    // Try to log in
    await auth.attempt(email, password)
    return response.redirect('/dashboard')
  } catch {
    return response.redirect().back()
  }
})
```

## Helpful Tips for Beginners

### 1. Debugging Made Easy
When something goes wrong, try these:

```typescript
// Add this to see what's happening
console.log('My data:', myVariable)

// Or use the built-in logger
import logger from '@adonisjs/core/services/logger'
logger.info('Something happened!', { details: myData })
```

### 2. Common Commands You'll Use Often
```bash
# Create new files
node ace make:controller Post    # Create a controller
node ace make:model Post        # Create a database model
node ace make:migration posts   # Create a database table

# Database stuff
node ace migration:run         # Update your database
node ace db:seed              # Add sample data

# Development
node ace serve --watch        # Start development server
```

### 3. Common Gotchas and Solutions
1. **Server won't start?**
   - Check if another app is using port 3333
   - Make sure you ran `npm install`
   - Verify your `.env` file exists

2. **Database errors?**
   - Check your database credentials in `.env`
   - Make sure your database is running
   - Run `node ace migration:run`

3. **Changes not showing up?**
   - Make sure your server is running with `--watch`
   - Clear your browser cache
   - Check for console errors

## Project Ideas to Practice
Start with these simple projects to learn AdonisJS:

1. **Todo List App**
   - Create, read, update, delete tasks
   - Add user authentication
   - Learn about forms and database

2. **Personal Blog**
   - Create blog posts
   - Add comments
   - Learn about relationships

3. **Simple Chat App**
   - User authentication
   - Real-time messages
   - Learn about WebSockets

## Getting Help
- Join the [AdonisJS Discord](https://discord.gg/vDcEjq6)
- Check the [official forums](https://forum.adonisjs.com/)
- Search [Stack Overflow](https://stackoverflow.com/questions/tagged/adonisjs)

Remember:
- Take it step by step
- Don't be afraid to ask for help
- Practice with small projects
- Read error messages carefully
- Keep the documentation handy

## Next Steps
Once you're comfortable with the basics:
1. Learn about database relationships
2. Explore middleware for adding custom logic
3. Try building an API
4. Learn about validation
5. Experiment with real-time features

Happy coding! 🚀