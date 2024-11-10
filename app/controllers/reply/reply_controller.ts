import { HttpContext } from '@adonisjs/core/http'
import {
  createReplyValidator,
  deleteReplyValidator,
  UpdateReplyValidator,
  ReplyReactValidator,
} from './reply_validator.js'
import ReplyService from './reply_service.js'

export default class ReplyController {
  private replyService: ReplyService

  constructor() {
    this.replyService = new ReplyService()
  }

  private getAuthUser(auth: any) {
    const user = auth.use('web').user!
    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }

  public async createReply({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await createReplyValidator.validate(request.all())
      const user = this.getAuthUser(auth)

      const newReply = await this.replyService.createReply(user, validatedData)

      return response.status(201).send({
        message: 'Reply created successfully',
        newReply,
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Validation failed',
        errors: error.messages,
      })
    }
  }

  public async getReplies({ request, response }: HttpContext) {
    const commentId = request.input('commentId')
    const prevPage = request.input('prevPage', 1)
    try {
      const replies = await this.replyService.getReplies(commentId, prevPage)

      response.status(200).send({
        replies,
        commentId,
        prevPage,
      })
    } catch (error) {
      return response.status(400).send({
        errors: error.messages,
      })
    }
  }

  public async deleteReply({ request, response }: HttpContext) {
    try {
      const validatedData = await deleteReplyValidator.validate(request.all())

      const deletedReply = await this.replyService.deleteReply(
        validatedData.userId,
        validatedData.replyId
      )

      response.status(200).send({
        message: 'Delete reply successfully',
        deletedReply,
      })
    } catch (error) {
      if (error.message === 'Reply not found') {
        response.status(404)
      } else if (error.message.includes('not authorized')) {
        response.status(403)
      } else {
        response.status(400)
      }
      response.send({ message: error.message })
    }
  }

  public async updateReply({ request, response }: HttpContext) {
    try {
      const validatedData = await UpdateReplyValidator.validate(request.all())

      const updatedReply = await this.replyService.updateReply(
        validatedData.userId,
        validatedData.replyId,
        validatedData.text
      )

      response.status(200).send({
        message: 'Update reply successfully',
        reply: updatedReply,
      })
    } catch (error) {
      if (error.message === 'Reply not found') {
        response.status(404)
      } else if (error.message.includes('not authorized')) {
        response.status(403)
      } else {
        response.status(400)
      }
      response.send({ message: error.message })
    }
  }

  public async replyReaction({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await ReplyReactValidator.validate(request.all())
      const user = this.getAuthUser(auth)

      const result = await this.replyService.handleReplyReaction(
        user,
        validatedData.replyId,
        validatedData.reactType
      )

      response.status(200).send({
        message: result.action === 'created' ? 'Reacted successfully' : 'Undo react successfully',
        replyReactCreated: result.replyReact,
      })
    } catch (error) {
      if (error.message === 'Reply not found') {
        response.status(404)
      } else {
        response.status(400)
      }
      response.send({ message: error.message })
    }
  }
}
