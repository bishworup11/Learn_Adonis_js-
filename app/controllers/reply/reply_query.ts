import Reply from '#models/Reply'
import ReplyReact, { ReactType } from '#models/ReplyReact'

export class ReplyQueries {
  public static async createReply(userId: number, commentId: number, text: string) {
    const newReply = await Reply.create({
      userId,
      commentId,
      text,
    })

    await newReply.refresh()
    await newReply.load('user')

    return newReply
  }

  public static async fetchReplies(commentId: number, page: number = 1, limit: number = 2) {
    return await Reply.query()
      .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
      .preload('comment')
      .where('commentId', commentId)
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  public static async findReplyById(replyId: number) {
    return await Reply.findOrFail(replyId)
  }

  public static async findReplyWithComment(replyId: number) {
    return await Reply.query().preload('comment').where('replies.reply_id', replyId).firstOrFail()
  }

  public static async deleteReplyById(replyId: number) {
    const reply = await this.findReplyById(replyId)
    await reply.delete()
    return reply
  }

  public static async updateReplyText(replyId: number, text: string) {
    const reply = await this.findReplyById(replyId)
    reply.text = text
    await reply.save()
    return reply
  }

  public static async findExistingReact(replyId: number, userId: number) {
    return await ReplyReact.query().where('replyId', replyId).andWhere('userId', userId).first()
  }

  public static async createReact(userId: number, replyId: number, reactType: ReactType) {
    const newReact = await ReplyReact.create({
      userId,
      replyId,
      reactType,
    })

    await newReact.refresh()
    await newReact.load('user')

    return newReact
  }

  public static async deleteReact(react: ReplyReact) {
    await react.delete()
    return react
  }
}
