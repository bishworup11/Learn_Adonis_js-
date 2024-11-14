# Learn Adonis js

## Day 1

### 1. Install Adonis js

<details>
 <summary><b> 2. Create Crud in router.ts with Global variable </b></summary>

```ts
router.get('login', (ctx) => {
  const csrfToken = ctx.request.csrfToken

  // ctx.response.send({ csrfToken })
  ctx.response.status(200).send(csrfToken)
})

// all posts get

router.get('get-posts', (ctx) => {
  const posts = [
    {
      id: 1,
      title: 'Hello World',
    },
    {
      id: 2,
      title: 'Hello World 2',
    },
  ]
  ctx.response.status(200).send(posts)
})

// create post
router.post('create-posts', (ctx) => {
  const posts = [
    {
      id: 1,
      title: 'Hello World',
    },
    {
      id: 2,
      title: 'Hello World 2',
    },
  ]

  const newPostTitle = ctx.request.input('title')

  const newPost = {
    id: 3,
    title: newPostTitle,
  }

  posts.push(newPost)

  ctx.response.status(201).send({
    message: 'Create post successfully',
    posts: posts,
    newPost: newPost,
  })
})

// update post
router.post('update-posts', (ctx) => {
  const posts = [
    {
      id: 1,
      title: 'Hello World',
    },
    {
      id: 2,
      title: 'Hello World 2',
    },
    {
      id: 3,
      title: 'Post 3 2',
    },
  ]

  const postId = ctx.request.input('id')
  const newPostTitle = ctx.request.input('title')

  const post = posts.find((post) => post.id === postId)

  if (!post) {
    return ctx.response.status(404).send({
      message: 'Post not found',
    })
  }

  post.title = newPostTitle
  // update post in database
  posts.splice(posts.indexOf(post), 1, post)

  ctx.response.status(201).send({
    message: 'Update post successfully',
    posts: posts,
    post: post,
  })
})

// delete post
router.delete('delete-posts', (ctx) => {
  const posts = [
    {
      id: 1,
      title: 'Hello World',
    },
    {
      id: 2,
      title: 'Hello World 2',
    },
    {
      id: 3,
      title: 'Post 3 2',
    },
  ]

  const postId = ctx.request.input('id')

  // select post from database
  const post = posts.find((post) => post.id === postId)

  // if post not found, return error | validation
  if (!post) {
    return ctx.response.status(404).send({
      message: 'Post not found',
    })
  }

  // delete post from database
  posts.splice(posts.indexOf(post), 1)

  ctx.response.status(201).send({
    message: 'Delete post successfully',
    post: post,
  })
})
```

</details>

<details>
 <summary><b> 3. Routes Break down to controller add validation </b></summary>

- routes.ts

```ts
router.get('login', [PostsController, 'login'])

// // Get all posts
router.get('get-posts', [PostsController, 'getPosts'])

// // Create post

router.post('create-post', [PostsController, 'createPost'])

// // Update post

router.post('update-post', [PostsController, 'updatePost'])

// // Delete post

router.delete('delete-post', [PostsController, 'deletePost'])
```

- app/controller/post_controller.ts

```ts
import { Context } from 'egg'

import { HttpContext } from '@adonisjs/core/http'
import { createPostValidator, updatePostValidator } from '../validators/post.js'

const posts = [
  { id: 1, title: 'Hello World' },
  { id: 2, title: 'Hello World 2' },
]

export default class PostsController {
  public async login(ctx: HttpContext) {
    const csrfToken = ctx.request.csrfToken
    ctx.response.status(200).send(csrfToken)
  }

  public async getPosts(ctx: HttpContext) {
    ctx.response.status(200).send(posts)
  }

  public async createPost({ request, response }: HttpContext) {
    try {
      // Validate the request using the createPostValidator
      const validatedData = await createPostValidator.validate(request.all())

      // Create a new post object using the validated title
      const newPost = {
        id: posts.length + 1, // Dynamic ID generation
        title: validatedData.title, // Use the validated title
      }

      // Add the new post to the posts array
      posts.push(newPost)

      // Send a success response
      return response.status(201).send({
        message: 'Create post successfully',
        posts,
        newPost,
      })
    } catch (error) {
      // Handle validation errors
      return response.status(400).send({
        message: 'Validation failed',
        errors: error.messages, // Return the validation error messages
      })
    }
  }

  public async updatePost({ request, response }: HttpContext) {
    const postId: number = request.input('id')
    const newPostTitle: string = request.input('title')

    const post = posts.find((post) => post.id === postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    post.title = newPostTitle
    response.status(200).send({
      message: 'Update post successfully',
      posts,
      post,
    })
  }

  public async deletePost({ request, response }: HttpContext) {
    const postId: number = request.input('id')

    const postIndex = posts.findIndex((post) => post.id === postId)

    if (postIndex === -1) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    const deletedPost = posts.splice(postIndex, 1)[0] // Remove post and get the deleted post

    response.status(200).send({
      message: 'Delete post successfully',
      post: deletedPost,
    })
  }
}
```

- app/validator/post.ts

```ts
import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
  })
)

/**
 * Validates the post's update action
 */
export const updatePostValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
    title: vine.string().trim().minLength(6),
    description: vine.string().trim().escape(),
  })
)

export const deletePostValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)

export const getPostValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)
```

</details>

## Day 2

<details>
<summary>Connent MySQL database , Create Post model, User model and database migration</summary>

- app/models/post.ts

```ts
// app/Models/User.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'
import Comment from './Comment.js'
import Reply from './Reply.js'
import PostLike from './PostLike.js'
import CommentLike from './CommentLike.js'
import ReplyLike from './ReplyLike.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare userId: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @hasMany(() => Post, {
    foreignKey: 'userId',
  })
  declare posts: HasMany<typeof Post>

  @hasMany(() => Comment, {
    foreignKey: 'userId',
  })
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Reply, {
    foreignKey: 'userId',
  })
  declare replies: HasMany<typeof Reply>

  @hasMany(() => PostLike, {
    foreignKey: 'userId',
  })
  declare postLikes: HasMany<typeof PostLike>

  @hasMany(() => CommentLike, {
    foreignKey: 'userId',
  })
  declare commentLikes: HasMany<typeof CommentLike>

  @hasMany(() => ReplyLike, {
    foreignKey: 'userId',
  })
  declare replyLikes: HasMany<typeof ReplyLike>
}
```

- database/migrations/[timestamp]-create-user.js

```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('user_id').primary() // Primary key
      table.string('first_name').notNullable() // First name
      table.string('last_name').notNullable() // Last name
      table.string('email').notNullable().unique() // Email, unique constraint
      table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP')) // Created at timestamp
      table
        .timestamp('updated_at')
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')) // Updated at timestamp
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

- app/Models/post.ts

```ts
// app/Models/Post.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Comment from './Comment.js'
import PostLike from './PostLike.js'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare postId: number

  @column()
  declare userId: number

  @column()
  declare postCategoryId: number

  @column()
  declare text: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Comment, {
    foreignKey: 'postId',
  })
  declare comments: HasMany<typeof Comment>

  @hasMany(() => PostLike, {
    foreignKey: 'postId',
  })
  declare likes: HasMany<typeof PostLike>
}
```

-- database/migrations/[timestamp]\_create_posts_table.js

```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('post_id').primary()
      table.integer('user_id').unsigned().references('user_id').inTable('users').onDelete('CASCADE')
      table.string('text').notNullable()
      table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'))
      table
        .timestamp('updated_at')
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

#### update posts_controller.ts

```ts
import { HttpContext } from '@adonisjs/core/http'
import { createPostValidator, updatePostValidator } from '../validators/post.js'
import Post from '#models/post'
import db from '@adonisjs/lucid/services/db'

export default class PostsController {
  public async login(ctx: HttpContext) {
    const csrfToken = ctx.request.csrfToken
    ctx.response.status(200).send(csrfToken)
  }

  public async getPosts({ response, request }: HttpContext) {
    try {
      const posts = await Post.all()

      response.status(200).send(posts)
    } catch (error) {
      response.status(500).send({
        message: 'Failed to fetch posts',
        error: error.message,
      })
    }
  }

  public async createPost({ request, response }: HttpContext) {
    try {
      const validatedData = await createPostValidator.validate(request.all())

      const post = await Post.create({
        userId: 1,
        text: validatedData.title,
      })

      return response.status(201).send({
        message: 'Create post successfully',
        post,
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Validation failed',
        errors: error.messages,
      })
    }
  }

  public async updatePost({ request, response }: HttpContext) {
    const validatedData = await updatePostValidator.validate(request.all())
    const postId: number = validatedData.id
    const newPostTitle: string = validatedData.title

    const post = await Post.findOrFail(postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    post.text = newPostTitle
    response.status(200).send({
      message: 'Update post successfully',
      post,
    })
  }

  public async deletePost({ request, response }: HttpContext) {
    const postId: number = request.input('id')

    const post = await Post.findOrFail(postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    await post.delete()

    response.status(200).send({
      message: 'Delete post successfully',
      deletedPost: post,
    })
  }
}
```

</details>

<details>
<summary> Add pagination </summary>

- update posts_controller.ts

```ts

public async getPosts({ response, request }: HttpContext) {
    try {
      // const posts = await Post.all()
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const posts = await db.from('posts').paginate(page, limit)
      console.log(posts)

      response.status(200).send(posts)
    } catch (error) {
      response.status(500).send({
        message: 'Failed to fetch posts',
        error: error.message,
      })
    }
  }

```

</details>

<details>
<summary> Add Category table and relation one to many with posts table </summary>

- app/models/post.ts

add this in post,ts

```ts

  @belongsTo(() => PostCategory, {
    foreignKey: 'postCategoryId',
  })
  declare postCategory: BelongsTo<typeof PostCategory>


```

- app/models/PostCategory.ts

```ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'

export default class PostCategory extends BaseModel {
  @column({ isPrimary: true })
  declare postCategoryId: number

  @column()
  declare type: string

  @hasMany(() => Post, {
    foreignKey: 'postCategoryId',
  })
  declare posts: HasMany<typeof Post>
}
```

get all posts with category

- app/Controllers/Http/PostsController.ts

```ts

 public async getLimitedPosts({ response, request }: HttpContext) {
    try {
      // const posts = await Post.all()
      const limit = request.input('limit', 5)
      const page = request.input('page', 1)
      const type = 'Technology'

      const posts = await db
        .from('posts')
        .select(
          'posts.*', // All columns from posts table
          'post_categories.type as category_type' // Only 'type' column from post_categories
        )
        .join('post_categories', 'posts.post_category_id', 'post_categories.post_category_id')
        .where('post_categories.type', type)
        .paginate(page, Number(limit))

      response.status(200).send(posts)
    } catch (error) {
      response.status(500).send({
        message: 'Failed to fetch posts',
        error: error.message,
      })
    }
  }

```

</details>

## Day 3
