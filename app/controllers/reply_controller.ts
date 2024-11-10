import { HttpContext } from '@adonisjs/core/http'
import {
  createReplyValidator,
  deleteReplyValidator,
  UpdateReplyValidator,
  ReplyReactValidator,
} from '../validators/post.js'
import Reply from '#models/Reply'
import ReplyReact, { ReactType } from '#models/ReplyReact'

export default class ReplyController {
  public async createReply({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await createReplyValidator.validate(request.all())

      const user = auth.use('web').user!

      const newReply = await Reply.create({
        userId: user.userId,
        commentId: validatedData.commentId,
        text: validatedData.text,
      })

      await newReply.refresh()
      await newReply.load('user')

      return response.status(201).send({
        message: 'Reply created successfully',
        newReply: {
          ...newReply.serialize(),
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          replyReact: [],
        },
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
      const replies = await Reply.query()
        .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
        .preload('comment')
        .where('commentId', commentId)
        .orderBy('createdAt', 'desc')
        .paginate(prevPage, 2)

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
    const validatedData = await deleteReplyValidator.validate(request.all())
    const userId: number = validatedData.userId
    const replyId: number = validatedData.replyId

    const reply = await Reply.query()
      .preload('comment')
      .where('replies.reply_id', replyId)
      .firstOrFail()

    if (!reply) {
      return response.status(404).send({
        message: 'Reply not found',
      })
    }

    if (reply.userId !== userId && reply.comment.userId !== userId) {
      return response.status(403).send({
        message: 'You are not authorized to delete this reply',
      })
    }
    await reply.delete()

    response.status(200).send({
      message: 'Delete reply successfully',
      deletedReply: reply,
    })
  }

  public async updateReply({ request, response }: HttpContext) {
    const validatedData = await UpdateReplyValidator.validate(request.all())
    const replyId: number = validatedData.replyId
    const userId: number = validatedData.userId
    const replyText: string = validatedData.text

    const reply = await Reply.findOrFail(replyId)

    if (!reply) {
      return response.status(404).send({
        message: 'Reply not found',
      })
    }

    if (reply.userId !== userId) {
      return response.status(403).send({
        message: 'You are not authorized to update this reply',
      })
    }

    reply.text = replyText
    await reply.save()
    response.status(200).send({
      message: 'Update reply successfully',
      reply,
    })
  }

  public async replyReaction({ auth, request, response }: HttpContext) {
    const validatedData = await ReplyReactValidator.validate(request.all())
    const replyId: number = validatedData.replyId
    const reactType: ReactType = validatedData.reactType ?? ReactType.LIKE
    const user = auth.use('web').user!

    const reply = await Reply.findOrFail(replyId)

    if (!reply) {
      return response.status(404).send({
        message: 'Reply not found',
      })
    }

    const replyReact = await ReplyReact.query()
      .where('replyId', replyId)
      .andWhere('userId', user.userId)
      .first()

    if (replyReact) {
      await replyReact.delete()

      return response.status(200).send({
        message: 'Undo react successfully',
        replyReactCreated: replyReact,
      })
    }

    const replyReactCreated = await ReplyReact.create({
      userId: user.userId,
      replyId: validatedData.replyId,
      reactType: reactType,
    })
    await replyReactCreated.refresh()
    await replyReactCreated.load('user')

    return response.status(200).send({
      message: 'Reacted successfully',
      replyReactCreated: {
        ...replyReactCreated.serialize(),
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    })
  }
}
