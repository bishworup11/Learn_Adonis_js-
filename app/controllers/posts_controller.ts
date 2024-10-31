import { HttpContext } from '@adonisjs/core/http'
import { createPostValidator, updatePostValidator } from '../validators/post.js'
import Post from '#models/post'
import db from '@adonisjs/lucid/services/db'
// import db from '@adonisjs/lucid/services/db'
// import { Database } from '@adonisjs/lucid/database'

export default class PostsController {
  public async login(ctx: HttpContext) {
    const csrfToken = ctx.request.csrfToken
    ctx.response.status(200).send(csrfToken)
  }

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
