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
