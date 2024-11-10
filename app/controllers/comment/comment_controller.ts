import { HttpContext } from '@adonisjs/core/http'
import {
  createCommentValidator,
  deleteCommentValidator,
  UpdateCommentValidator,
  CommentReactValidator,
} from './comment_validator.js'
import CommentService from './comment_service.js'

export default class CommentController {
  private commentService: CommentService

  constructor() {
    this.commentService = new CommentService()
  }

  private getAuthUser(auth: any) {
    const user = auth.use('web').user!
    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }

  public async createComment({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await createCommentValidator.validate(request.all())
      const user = this.getAuthUser(auth)

      const newComment = await this.commentService.createComment(user, validatedData)

      return response.status(201).send({
        message: 'Comment successfully',
        newComment,
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Validation failed',
        errors: error.messages,
      })
    }
  }

  public async getComment({ request, response }: HttpContext) {
    const postId = request.input('postId')
    const prevPage = request.input('prevPage', 1)
    try {
      const comments = await this.commentService.getComments(postId, prevPage)

      response.status(200).send({
        comments,
      })
    } catch (error) {
      return response.status(400).send({
        errors: error.messages,
      })
    }
  }

  public async deleteComment({ request, response }: HttpContext) {
    try {
      const validatedData = await deleteCommentValidator.validate(request.all())

      const deletedComment = await this.commentService.deleteComment(
        validatedData.userId,
        validatedData.commentId
      )

      response.status(200).send({
        message: 'Delete comment successfully',
        deletedPost: deletedComment,
      })
    } catch (error) {
      if (error.message === 'Comment not found') {
        response.status(404)
      } else if (error.message.includes('not authorized')) {
        response.status(403)
      } else {
        response.status(400)
      }
      response.send({ message: error.message })
    }
  }

  public async updateComment({ request, response }: HttpContext) {
    try {
      const validatedData = await UpdateCommentValidator.validate(request.all())

      const updatedComment = await this.commentService.updateComment(
        validatedData.userId,
        validatedData.commentId,
        validatedData.text
      )

      response.status(200).send({
        message: 'Update comment successfully',
        comment: updatedComment,
      })
    } catch (error) {
      if (error.message === 'Comment not found') {
        response.status(404)
      } else if (error.message.includes('not authorized')) {
        response.status(403)
      } else {
        response.status(400)
      }
      response.send({ message: error.message })
    }
  }

  public async commentReaction({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await CommentReactValidator.validate(request.all())
      const user = this.getAuthUser(auth)

      const result = await this.commentService.handleCommentReaction(
        user,
        validatedData.commentId,
        validatedData.reactType
      )

      response.status(200).send({
        message: result.action === 'created' ? 'Reacted successfully' : 'Undo react successfully',
        ...result,
      })
    } catch (error) {
      if (error.message === 'Comment not found') {
        response.status(404)
      } else {
        response.status(400)
      }
      response.send({ message: error.message })
    }
  }
}
