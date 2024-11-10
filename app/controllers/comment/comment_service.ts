import { CommentQueries } from './comment_query.js'
import { ReactType } from '#models/CommentReact'

export default class CommentService {
  public async createComment(user: any, data: { postId: number; text: string }) {
    const newComment = await CommentQueries.createComment(user.userId, data.postId, data.text)

    return {
      ...newComment.serialize(),
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      reacts: [],
      replies: [],
    }
  }

  public async getComments(postId: number, prevPage: number = 1) {
    return await CommentQueries.fetchComments(postId, prevPage)
  }

  public async deleteComment(userId: number, commentId: number) {
    const comment = await CommentQueries.findCommentWithUser(commentId)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (comment.userId !== userId && comment.post.userId !== userId) {
      throw new Error('You are not authorized to delete this comment')
    }

    return await CommentQueries.deleteCommentById(commentId)
  }

  public async updateComment(userId: number, commentId: number, text: string) {
    const comment = await CommentQueries.findCommentById(commentId)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (comment.userId !== userId) {
      throw new Error('You are not authorized to update this comment')
    }

    return await CommentQueries.updateCommentText(commentId, text)
  }

  public async handleCommentReaction(
    user: any,
    commentId: number,
    reactType: ReactType = ReactType.LIKE
  ) {
    const comment = await CommentQueries.findCommentById(commentId)

    if (!comment) {
      throw new Error('Comment not found')
    }

    const existingReact = await CommentQueries.findExistingReact(commentId, user.userId)

    if (existingReact) {
      const deletedReact = await CommentQueries.deleteReact(existingReact)
      return {
        action: 'deleted',
        userId: user.userId,
        commentReact: deletedReact,
      }
    }

    const newReact = await CommentQueries.createReact(user.userId, commentId, reactType)

    return {
      action: 'created',
      commentReact: {
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
