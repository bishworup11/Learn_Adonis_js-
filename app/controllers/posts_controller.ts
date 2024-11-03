import { HttpContext } from '@adonisjs/core/http'
import {
  createPostValidator,
  updatePostValidator,
  deletePostValidator,
  getAllPostsValidator,
  PostReactValidator,
} from '../validators/post.js'
import Post from '#models/post'
import db from '@adonisjs/lucid/services/db'
import PostReact from '#models/PostReact'
import ReactType from '../models/PostReact.js'

export default class PostsController {
  public async login(ctx: HttpContext) {
    const csrfToken = ctx.request.csrfToken
    ctx.response.status(200).send(csrfToken)
  }

  public async getPosts({ response, request }: HttpContext) {
    try {
      // const posts = await Post.all()
      const validatedData = await getAllPostsValidator.validate(request.all())
      const limit = validatedData.limit ? validatedData.limit : 5
      const page = validatedData.page ? validatedData.page : 1

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

  public async getLimitedPostsByCategory({ response, request }: HttpContext) {
    try {
      const validatedData = await getAllPostsValidator.validate(request.all())
      const limit = validatedData.limit ? validatedData.limit : 5
      const page = validatedData.page ? validatedData.page : 1
      const type = validatedData.category ? validatedData.category : 'Travel'

      // const posts = await db
      //   .from('posts')
      //   .select(
      //     'posts.*',
      //     'post_categories.type as category_type'
      //   )
      //   .join('post_categories', 'posts.post_category_id', 'post_categories.post_category_id')
      //   .where('post_categories.type', type)
      //   .paginate(page, Number(limit))

      const posts = await Post.query()
        .preload('user')
        .preload('postCategory')
        .join('post_categories', 'posts.post_category_id', 'post_categories.post_category_id')
        .where('post_categories.type', type)
        .orderBy('postId', 'desc')
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
      console.log(request.all())
      const validatedData = await createPostValidator.validate(request.all())

      const category = await db
        .from('post_categories')
        .select('post_categories.*')
        .where('post_categories.type', validatedData.category)

      // check if category exists

      if (category.length === 0) {
        return response.status(404).send({
          message: 'Category not found',
        })
      }

      const post = await Post.create({
        userId: validatedData.userId,
        text: validatedData.title,
        postCategoryId: category[0].post_category_id,
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
    const postId: number = validatedData.postId
    const userId: number = validatedData.userId
    const newPostTitle: string = validatedData.title

    const post = await Post.findOrFail(postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    if (post.userId !== userId) {
      return response.status(403).send({
        message: 'You are not authorized to update this post',
      })
    }

    post.text = newPostTitle
    await post.save()
    response.status(200).send({
      message: 'Update post successfully',
      post,
    })
  }

  public async deletePost({ request, response }: HttpContext) {
    const validatedData = await deletePostValidator.validate(request.all())
    const postId: number = validatedData.postId
    const userId: number = validatedData.userId

    const post = await Post.findOrFail(postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    if (post.userId !== userId) {
      return response.status(403).send({
        message: 'You are not authorized to delete this post',
      })
    }
    await post.delete()

    response.status(200).send({
      message: 'Delete post successfully',
      deletedPost: post,
    })
  }

  public async postReaction({ request, response }: HttpContext) {
    const validatedData = await PostReactValidator.validate(request.all())
    const postId: number = validatedData.postId
    const userId: number = validatedData.userId

    const post = await Post.findOrFail(postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    const postReact = await PostReact.query()
      .where('postId', postId)
      .andWhere('userId', userId)
      .first()

    if (!postReact) {
      const postReactCreated = await PostReact.create({
        userId: validatedData.userId,
        postId: validatedData.postId,
        reactType: validatedData.reactType,
      })

      response.status(200).send({
        message: ' React  successfully',
        postReactCreated,
      })
    } else {
      await postReact.delete()

      response.status(200).send({
        message: 'undo react  successfully',
      })
    }
  }
}
