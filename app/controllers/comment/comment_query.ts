import Comment from '#models/Comment'
import CommentReact, { ReactType } from '#models/CommentReact'

export class CommentQueries {
  public static async createComment(userId: number, postId: number, text: string) {
    const newComment = await Comment.create({
      userId,
      postId,
      text,
    })

    await newComment.refresh()
    await newComment.load('user')

    return newComment
  }

  public static async fetchComments(postId: number, page: number = 1, limit: number = 2) {
    return await Comment.query()
      .preload('user')
      .withCount('reacts')
      .where('postId', postId)
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  public static async findCommentById(commentId: number) {
    return await Comment.findOrFail(commentId)
  }

  public static async findCommentWithUser(commentId: number) {
    return await Comment.query()
      .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
      .where('comments.comment_id', commentId)
      .firstOrFail()
  }

  public static async deleteCommentById(commentId: number) {
    const comment = await this.findCommentById(commentId)
    await comment.delete()
    return comment
  }

  public static async updateCommentText(commentId: number, text: string) {
    const comment = await this.findCommentById(commentId)
    comment.text = text
    await comment.save()
    return comment
  }

  public static async findExistingReact(commentId: number, userId: number) {
    return await CommentReact.query()
      .where('commentId', commentId)
      .andWhere('userId', userId)
      .first()
  }

  public static async createReact(userId: number, commentId: number, reactType: ReactType) {
    const newReact = await CommentReact.create({
      userId,
      commentId,
      reactType,
    })

    await newReact.refresh()
    await newReact.load('user')

    return newReact
  }

  public static async deleteReact(react: CommentReact) {
    await react.delete()
    return react
  }
}
