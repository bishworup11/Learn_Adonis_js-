# Lucid ORM Guide for AdonisJS 6
A comprehensive guide to working with Lucid ORM, the database toolkit for AdonisJS

## Table of Contents
- [Introduction to Lucid ORM](#introduction-to-lucid-orm)
- [Basic Operations](#basic-operations)
- [Model Relationships](#model-relationships)
- [Querying](#querying)
- [Advanced Features](#advanced-features)
- [Best Practices](#best-practices)

## Introduction to Lucid ORM

### What is Lucid ORM?
Lucid ORM is AdonisJS's elegant database toolkit that makes it easy to:
- Work with database records using JavaScript/TypeScript objects
- Define relationships between different tables
- Write complex queries using a simple API
- Handle database migrations and seeding

### Setup

```typescript
// config/database.ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

export default defineConfig({
  connection: env.get('DB_CONNECTION'),
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('MYSQL_HOST'),
        port: env.get('MYSQL_PORT'),
        user: env.get('MYSQL_USER'),
        password: env.get('MYSQL_PASSWORD'),
        database: env.get('MYSQL_DB_NAME')
      }
    },
    // Add other database configurations as needed
  }
})
```

## Basic Operations

### 1. Defining Models

```typescript
// app/models/user.ts
import { BaseModel, column, beforeSave } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'

export default class User extends BaseModel {
  // Define table name (optional - will use lowercase plural of class name)
  static table = 'users'

  // Primary key
  @column({ isPrimary: true })
  declare id: number

  // Regular columns
  @column()
  declare email: string

  @column()
  declare password: string

  // Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Hooks
  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}
```

### 2. CRUD Operations

```typescript
// Create
const user = await User.create({
  email: 'user@example.com',
  password: 'secret'
})

// Read
const user = await User.find(1)  // Find by primary key
const users = await User.all()    // Get all records

// Update
user.email = 'new@example.com'
await user.save()

// Delete
await user.delete()

// Bulk operations
await User.createMany([
  { email: 'user1@example.com', password: 'secret1' },
  { email: 'user2@example.com', password: 'secret2' }
])
```

## Model Relationships

### 1. One-to-One Relationship

```typescript
// app/models/user.ts
import { hasOne } from '@adonisjs/lucid/orm'
import Profile from './profile.js'

export default class User extends BaseModel {
  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>
}

// app/models/profile.ts
import { belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'

export default class Profile extends BaseModel {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}

// Usage
const user = await User.query().preload('profile').first()
console.log(user.profile.bio)
```

### 2. One-to-Many Relationship

```typescript
// app/models/user.ts
import { hasMany } from '@adonisjs/lucid/orm'
import Post from './post.js'

export default class User extends BaseModel {
  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>
}

// app/models/post.ts
import { belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'

export default class Post extends BaseModel {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}

// Usage
const user = await User.query().preload('posts').first()
user.posts.forEach(post => console.log(post.title))
```

### 3. Many-to-Many Relationship

```typescript
// app/models/post.ts
import { manyToMany } from '@adonisjs/lucid/orm'
import Tag from './tag.js'

export default class Post extends BaseModel {
  @manyToMany(() => Tag)
  declare tags: ManyToMany<typeof Tag>
}

// Usage
const post = await Post.query().preload('tags').first()

// Attach tags
await post.related('tags').attach([1, 2, 3])

// Detach tags
await post.related('tags').detach([1])

// Sync tags (remove all existing and attach new ones)
await post.related('tags').sync([1, 2])
```

## Querying

### 1. Basic Queries

```typescript
// Find by ID
const user = await User.find(1)

// Find with conditions
const users = await User.query()
  .where('age', '>', 18)
  .where('status', 'active')
  .orderBy('created_at', 'desc')
  .limit(10)

// First matching record
const user = await User.query()
  .where('email', 'user@example.com')
  .first()

// Count records
const count = await User.query()
  .where('status', 'active')
  .count('* as total')
```

### 2. Advanced Queries

```typescript
// Complex conditions
const users = await User.query()
  .where((query) => {
    query
      .where('age', '>', 18)
      .orWhere('parental_consent', true)
  })
  .whereNotNull('email_verified_at')

// Joins
const posts = await Post.query()
  .join('users', 'posts.user_id', 'users.id')
  .where('users.status', 'active')
  .select('posts.*', 'users.name as author_name')

// Raw queries
const results = await User.query()
  .whereRaw('DATE(created_at) = CURDATE()')
```

### 3. Relationships Queries

```typescript
// Eager loading
const posts = await Post.query()
  .preload('author')
  .preload('comments', (query) => {
    query.orderBy('created_at', 'desc')
  })

// Nested preloading
const posts = await Post.query()
  .preload('author', (query) => {
    query.preload('profile')
  })
  .preload('comments', (query) => {
    query.preload('author')
  })

// Has relationship queries
const usersWithPosts = await User.query()
  .has('posts')
  .whereHas('posts', (query) => {
    query.where('published', true)
  })
```

## Advanced Features

### 1. Model Hooks

```typescript
import { BaseModel, beforeSave, afterFind } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  @afterFind()
  static async loadDefaultRelations(user: User) {
    await user.load('profile')
  }
}
```

### 2. Soft Deletes

```typescript
import { BaseModel, column, softDelete } from '@adonisjs/lucid/orm'

@softDelete()
export default class Post extends BaseModel {
  @column.dateTime({ name: 'deleted_at' })
  declare deletedAt: DateTime | null

  // Usage
  await post.delete() // Soft delete
  await post.forceDelete() // Permanent delete

  // Query including soft deleted
  const posts = await Post.query()
    .withTrashed()
    .where('status', 'published')

  // Query only soft deleted
  const deletedPosts = await Post.query()
    .onlyTrashed()
}
```

### 3. Query Scopes

```typescript
import { BaseModel, scope } from '@adonisjs/lucid/orm'

export default class Post extends BaseModel {
  // Named scope
  public static published = scope((query) => {
    query.where('status', 'published')
  })

  // Scope with parameters
  public static byAuthor = scope((query, authorId: number) => {
    query.where('author_id', authorId)
  })

  // Usage
  const posts = await Post.query()
    .apply((scopes) => {
      scopes.published()
      scopes.byAuthor(1)
    })
}
```

## Best Practices

### 1. Model Organization

```typescript
// app/models/user.ts
export default class User extends BaseModel {
  // 1. Column definitions
  @column({ isPrimary: true })
  declare id: number

  // 2. Relationships
  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  // 3. Query scopes
  public static active = scope(...)

  // 4. Hooks
  @beforeSave()
  static async hashPassword(user: User) {...}

  // 5. Custom methods
  public async markAsVerified() {...}
}
```

### 2. Efficient Querying

```typescript
// DO: Select specific columns
const users = await User.query()
  .select('id', 'email', 'name')
  .where('status', 'active')

// DO: Use pagination
const posts = await Post.query()
  .paginate(page, 20)

// DO: Use chunks for large datasets
await User.query()
  .chunkById(100, async (users) => {
    for (let user of users) {
      await processUser(user)
    }
  })
```

### 3. Transaction Handling

```typescript
import Database from '@adonisjs/lucid/database'

// Basic transaction
await Database.transaction(async (trx) => {
  const user = await User.create({ 
    email: 'user@example.com' 
  }, { client: trx })
  
  await Profile.create({ 
    userId: user.id,
    bio: 'New user' 
  }, { client: trx })
})

// With save points
await Database.transaction(async (trx) => {
  await trx.savePoint('before_user')
  
  try {
    await createUser(trx)
  } catch (error) {
    await trx.rollbackTo('before_user')
    // Handle error
  }
})
```

## Common Patterns

### 1. Repository Pattern

```typescript
// app/repositories/user_repository.ts
export default class UserRepository {
  async findByEmail(email: string) {
    return await User.query()
      .where('email', email)
      .preload('profile')
      .first()
  }

  async createWithProfile(userData, profileData) {
    return await Database.transaction(async (trx) => {
      const user = await User.create(userData, { client: trx })
      await user.related('profile').create(profileData, { client: trx })
      return user
    })
  }
}
```

### 2. Service Pattern

```typescript
// app/services/auth_service.ts
export default class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(data) {
    const user = await this.userRepository.createWithProfile(
      { email: data.email, password: data.password },
      { bio: data.bio }
    )
    
    // Additional logic (send welcome email, etc.)
    return user
  }
}
```

## Debugging Tips

### 1. Query Logging

```typescript
// config/database.ts
{
  connections: {
    mysql: {
      debug: true, // Enable query logging
      connection: {
        // ... connection details
      }
    }
  }
}

// Or for specific queries
const users = await User.query()
  .debug(true)
  .where('status', 'active')
```

### 2. Inspecting Models

```typescript
// Check dirty (changed) attributes
console.log(user.$dirty)

// Check original attributes
console.log(user.$original)

// Check if model is new
console.log(user.$isLocal)

// Serialize model data
console.log(user.serialize())
```

Remember:
- Always use TypeScript for better type safety
- Implement proper error handling
- Use transactions for related operations
- Keep your models clean and organized
- Write tests for your models
- Use query builders for complex queries
- Implement proper validation before saving
- Use pagination for large datasets
# Advanced Query Operations in Lucid ORM

## Exists and Not Exists Operations

### Basic Exists Queries
```typescript
// Find users who have posts
const users = await User.query()
  .whereExists((query) => {
    query
      .from('posts')
      .whereColumn('users.id', 'posts.user_id')
  })

// Find users who don't have any posts
const usersWithoutPosts = await User.query()
  .whereNotExists((query) => {
    query
      .from('posts')
      .whereColumn('users.id', 'posts.user_id')
  })

// Complex exists conditions
const activeUsersWithComments = await User.query()
  .whereExists((query) => {
    query
      .from('comments')
      .whereColumn('users.id', 'comments.user_id')
      .where('comments.status', 'approved')
  })
  .where('status', 'active')
```

### Exists with Related Models
```typescript
// Using relationship exists
const usersWithPosts = await User.query()
  .whereHas('posts', (query) => {
    query.where('published', true)
  })

// Count based exists
const popularUsers = await User.query()
  .whereHas('posts', (query) => {
    query.where('published', true)
  }, '>', 5) // Users with more than 5 published posts
```

## Having Clauses

### Basic Having Operations
```typescript
// Find users with more than 5 posts
const users = await User.query()
  .select('users.*')
  .withCount('posts')
  .having('posts_count', '>', 5)

// Complex having conditions
const activeAuthors = await User.query()
  .select('users.*')
  .withCount('posts', (query) => {
    query.where('status', 'published')
  })
  .having('posts_count', '>', 10)
  .havingRaw('MAX(posts.views) > ?', [1000])
```

### Having with Aggregates
```typescript
// Find categories with average post length > 1000
const popularCategories = await Category.query()
  .select('categories.*')
  .join('posts', 'categories.id', 'posts.category_id')
  .groupBy('categories.id')
  .havingRaw('AVG(LENGTH(posts.content)) > ?', [1000])
```

## Subqueries

### Select Subqueries
```typescript
// Add a subquery column
const users = await User.query()
  .select('users.*')
  .select((query) => {
    query
      .from('posts')
      .count('*')
      .whereColumn('user_id', 'users.id')
      .as('total_posts')
  })

// Subquery in where clause
const users = await User.query()
  .whereIn('id', (query) => {
    query
      .from('posts')
      .select('user_id')
      .where('views', '>', 1000)
  })
```

### Correlated Subqueries
```typescript
// Find users with their latest post date
const users = await User.query()
  .select('users.*')
  .select((query) => {
    query
      .from('posts')
      .select('created_at')
      .whereColumn('user_id', 'users.id')
      .orderBy('created_at', 'desc')
      .limit(1)
      .as('latest_post_date')
  })
```

## Object Functions

### Custom Model Methods
```typescript
// app/models/user.ts
export default class User extends BaseModel {
  // Instance method
  public async getTotalPosts() {
    return await Post.query()
      .where('user_id', this.id)
      .count('* as total')
  }

  // Static method
  public static async findByEmail(email: string) {
    return await this.query()
      .where('email', email)
      .first()
  }

  // Computed property
  public get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  // Custom query method
  public static async findActiveWithPosts() {
    return await this.query()
      .where('status', 'active')
      .preload('posts')
  }
}

// Usage
const user = await User.findByEmail('user@example.com')
const totalPosts = await user.getTotalPosts()
```

## Date Query Operations

### Basic Date Queries
```typescript
import { DateTime } from 'luxon'

// Find records for today
const todayPosts = await Post.query()
  .whereRaw('DATE(created_at) = CURRENT_DATE')

// Find records within date range
const posts = await Post.query()
  .whereBetween('created_at', [
    DateTime.now().minus({ days: 7 }).toSQL(),
    DateTime.now().toSQL()
  ])

// Find records by specific date parts
const posts = await Post.query()
  .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [2024])
  .whereRaw('EXTRACT(MONTH FROM created_at) = ?', [3])
```

### Advanced Date Operations
```typescript
// Find posts created last week
const lastWeekPosts = await Post.query()
  .where('created_at', '>=', DateTime.now().minus({ weeks: 1 }).toSQL())
  .where('created_at', '<=', DateTime.now().toSQL())

// Group by date
const postsByDate = await Post.query()
  .select(Database.raw('DATE(created_at) as date'))
  .count('* as total')
  .groupBy('date')
  .orderBy('date', 'desc')

// Custom date formats
const posts = await Post.query()
  .select('*')
  .selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d") as formatted_date')
```

## Scope Queries

### Basic Scopes
```typescript
// app/models/post.ts
export default class Post extends BaseModel {
  // Simple scope
  public static published = scope((query) => {
    query.where('status', 'published')
  })

  // Parameterized scope
  public static olderThan = scope((query, days: number) => {
    query.where('created_at', '<', 
      DateTime.now().minus({ days }).toSQL()
    )
  })

  // Composite scope
  public static trending = scope((query) => {
    query
      .where('views', '>', 1000)
      .where('created_at', '>=', 
        DateTime.now().minus({ days: 7 }).toSQL()
      )
  })
}

// Usage
const posts = await Post.query()
  .apply((scopes) => {
    scopes.published()
    scopes.olderThan(30)
  })
```

### Advanced Scopes
```typescript
// Scope with relationships
public static withAuthorAndComments = scope((query) => {
  query
    .preload('author')
    .preload('comments', (commentsQuery) => {
      commentsQuery.orderBy('created_at', 'desc')
    })
})

// Conditional scope
public static byPopularity = scope((query, minViews: number = 1000) => {
  query
    .where('views', '>=', minViews)
    .orderBy('views', 'desc')
})

// Using multiple scopes
const popularPosts = await Post.query()
  .apply((scopes) => {
    scopes.published()
    scopes.trending()
    scopes.byPopularity(5000)
  })
```

## Raw Queries and Query Placeholders

### Why Use Raw Queries?
Raw queries are useful when:
1. You need to perform database-specific operations
2. You want to optimize complex queries
3. You need to use functions not supported by the query builder
4. You're working with legacy databases or complex SQL

### Raw Query Examples
```typescript
// Basic raw query
const users = await Database
  .rawQuery('SELECT * FROM users WHERE status = ?', ['active'])

// Raw query in select
const posts = await Post.query()
  .select('*')
  .selectRaw('COALESCE(views, 0) as view_count')
  .whereRaw('created_at < NOW() - INTERVAL ? DAYS', [30])

// Complex raw conditions
const stats = await Database
  .rawQuery(`
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m') as month,
      COUNT(*) as total,
      AVG(views) as avg_views
    FROM posts
    WHERE user_id = ?
    GROUP BY month
    HAVING total > ?
  `, [userId, 5])
```

### Query Placeholders
```typescript
// Named bindings
const user = await Database
  .rawQuery(
    'SELECT * FROM users WHERE email = :email AND status = :status',
    {
      email: 'user@example.com',
      status: 'active'
    }
  )

// Array bindings
const posts = await Post.query()
  .whereRaw('created_at BETWEEN ? AND ?', [
    startDate.toSQL(),
    endDate.toSQL()
  ])

// Mixed bindings
const result = await Database
  .rawQuery(`
    SELECT users.*, 
           (SELECT COUNT(*) 
            FROM posts 
            WHERE user_id = users.id 
            AND created_at > ?) as recent_posts
    FROM users
    WHERE status = ?
  `, [DateTime.now().minus({ days: 30 }).toSQL(), 'active'])
```

### Why Use Query Placeholders?
1. **Security**: Prevents SQL injection attacks
2. **Clean Code**: Makes queries more readable and maintainable
3. **Type Safety**: Ensures proper data type handling
4. **Reusability**: Makes queries more flexible with parameters
5. **Performance**: Allows database query caching

### Best Practices for Raw Queries
```typescript
// DO: Use repositories for raw queries
class PostRepository {
  public async getPostStats(userId: number, days: number) {
    return await Database
      .rawQuery(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as total,
          SUM(views) as total_views
        FROM posts
        WHERE user_id = ?
        AND created_at >= NOW() - INTERVAL ? DAY
        GROUP BY date
      `, [userId, days])
  }
}

// DO: Handle errors properly
try {
  const result = await Database.rawQuery(
    'INSERT INTO logs (message, type) VALUES (?, ?)',
    [message, type]
  )
} catch (error) {
  // Handle database errors
  console.error('Database error:', error)
  throw new DatabaseException('Failed to insert log')
}

// DO: Use transactions for multiple raw queries
await Database.transaction(async (trx) => {
  await trx.rawQuery(
    'UPDATE users SET status = ? WHERE id = ?',
    ['inactive', userId]
  )
  await trx.rawQuery(
    'INSERT INTO user_logs (user_id, action) VALUES (?, ?)',
    [userId, 'deactivated']
  )
})
```

Remember:
- Always use placeholders for dynamic values
- Consider query performance implications
- Document complex raw queries
- Use transactions when necessary
- Handle errors appropriately
- Test raw queries thoroughly
- Consider using query builders when possible