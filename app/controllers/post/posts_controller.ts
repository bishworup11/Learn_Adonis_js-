// posts.controller.ts
import { HttpContext } from '@adonisjs/core/http'
import {
  createPostValidator,
  updatePostValidator,
  deletePostValidator,
  getAllPostsValidator,
  PostReactValidator,
} from './post_validator.js'
import PostsService from './post_service.js'

export default class PostsController {
  private postsService: PostsService

  constructor() {
    this.postsService = new PostsService()
  }

  private getAuthUser(auth: any) {
    const user = auth.use('web').user!
    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }

  public async getPosts({ auth, response, request }: HttpContext) {
    try {
      const validatedData = await getAllPostsValidator.validate(request.all())
      const authUser = this.getAuthUser(auth)

      const posts = await this.postsService.getPosts(authUser, {
        limit: validatedData.limit,
        page: validatedData.page,
        postId: validatedData.postId,
      })

      response.status(200).send(posts)
    } catch (error) {
      response.status(500).send({
        message: 'Failed to fetch posts',
        error: error.message,
      })
    }
  }

  public async getPostsByUser({ auth, response, request }: HttpContext) {
    try {
      const validatedData = await getAllPostsValidator.validate(request.all())
      const authUser = this.getAuthUser(auth)

      if (!validatedData.userId) {
        return response.status(400).send({
          message: 'User ID is required',
        })
      }

      const posts = await this.postsService.getPostsByUser(authUser, {
        userId: validatedData.userId,
        limit: validatedData.limit,
        page: validatedData.page,
      })

      response.status(200).send(posts)
    } catch (error) {
      response.status(500).send({
        message: 'Failed to fetch posts for the specified user',
        error: error.message,
      })
    }
  }

  public async createPost({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await createPostValidator.validate(request.all())
      const authUser = this.getAuthUser(auth)

      const post = await this.postsService.createPost(authUser, validatedData)
      response.status(201).send({
        message: 'Create post successfully',
        post,
      })
    } catch (error) {
      response.status(400).send({
        message: 'Validation failed',
        errors: error.messages,
      })
    }
  }

  public async updatePost({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await updatePostValidator.validate(request.all())
      const authUser = this.getAuthUser(auth)

      const post = await this.postsService.updatePost(
        authUser,
        validatedData.postId,
        validatedData.text
      )

      response.status(200).send({
        message: 'Update post successfully',
        post,
      })
    } catch (error) {
      if (error.message === 'Post not found') {
        response.status(404)
      } else if (error.message.includes('not authorized')) {
        response.status(403)
      } else {
        response.status(400)
      }
      response.send({ message: error.message })
    }
  }

  public async deletePost({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await deletePostValidator.validate(request.all())
      const authUser = this.getAuthUser(auth)

      const post = await this.postsService.deletePost(authUser, validatedData.postId)
      response.status(200).send({
        message: 'Delete post successfully',
        deletedPost: post,
      })
    } catch (error) {
      if (error.message === 'Post not found') {
        response.status(404)
      } else if (error.message.includes('not authorized')) {
        response.status(403)
      } else {
        response.status(400)
      }
      response.send({ message: error.message })
    }
  }

  public async postReaction({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await PostReactValidator.validate(request.all())
      const authUser = this.getAuthUser(auth)

      const result = await this.postsService.handlePostReaction(
        authUser,
        validatedData.postId,
        validatedData.reactType
      )

      response.status(200).send({
        message: result.action === 'created' ? 'React successfully' : 'Undo react successfully',
        ...result,
      })
    } catch (error) {
      if (error.message === 'Post not found') {
        response.status(404)
      } else {
        response.status(400)
      }
      response.send({ message: error.message })
    }
  }

  public async postHide({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await PostReactValidator.validate(request.all())
      const authUser = this.getAuthUser(auth)

      const post = await this.postsService.togglePostVisibility(authUser, validatedData.postId)
      response.status(200).send({
        message: 'Update post visibility successfully',
        post,
      })
    } catch (error) {
      if (error.message === 'Post not found') {
        response.status(404)
      } else if (error.message.includes('not authorized')) {
        response.status(403)
      } else {
        response.status(400)
      }
      response.send({ message: error.message })
    }
  }
}
