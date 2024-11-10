import { ReplyQueries } from './reply_query.js'
import { ReactType } from '#models/ReplyReact'

export default class ReplyService {
  public async createReply(user: any, data: { commentId: number; text: string }) {
    const newReply = await ReplyQueries.createReply(user.userId, data.commentId, data.text)

    return {
      ...newReply.serialize(),
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      replyReact: [],
    }
  }

  public async getReplies(commentId: number, prevPage: number = 1) {
    return await ReplyQueries.fetchReplies(commentId, prevPage)
  }

  public async deleteReply(userId: number, replyId: number) {
    const reply = await ReplyQueries.findReplyWithComment(replyId)

    if (!reply) {
      throw new Error('Reply not found')
    }

    if (reply.userId !== userId && reply.comment.userId !== userId) {
      throw new Error('You are not authorized to delete this reply')
    }

    return await ReplyQueries.deleteReplyById(replyId)
  }

  public async updateReply(userId: number, replyId: number, text: string) {
    const reply = await ReplyQueries.findReplyById(replyId)

    if (!reply) {
      throw new Error('Reply not found')
    }

    if (reply.userId !== userId) {
      throw new Error('You are not authorized to update this reply')
    }

    return await ReplyQueries.updateReplyText(replyId, text)
  }

  public async handleReplyReaction(
    user: any,
    replyId: number,
    reactType: ReactType = ReactType.LIKE
  ) {
    const reply = await ReplyQueries.findReplyById(replyId)

    if (!reply) {
      throw new Error('Reply not found')
    }

    const existingReact = await ReplyQueries.findExistingReact(replyId, user.userId)

    if (existingReact) {
      const deletedReact = await ReplyQueries.deleteReact(existingReact)
      return {
        action: 'deleted',
        replyReact: deletedReact,
      }
    }

    const newReact = await ReplyQueries.createReact(user.userId, replyId, reactType)

    return {
      action: 'created',
      replyReact: {
        ...newReact.serialize(),
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    }
  }
}
