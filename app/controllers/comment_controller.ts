import { HttpContext } from '@adonisjs/core/http'
import {
  createCommentValidator,
  deleteCommentValidator,
  UpdateCommentValidator,
  CommentReactValidator,
} from '../validators/comment.js'
import Comment from '#models/Comment'
import CommentReact, { ReactType } from '#models/CommentReact'

export default class CommentController {
  public async createComment({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await createCommentValidator.validate(request.all())
      const user = auth.use('web').user!
      const newComment = await Comment.create({
        userId: user.userId,
        postId: validatedData.postId,
        text: validatedData.text,
      })

      await newComment.refresh()
      await newComment.load('user')

      return response.status(201).send({
        message: 'Comment successfully',
        newComment: {
          ...newComment.serialize(),
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          reacts: [],
          replies: [],
        },
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
      const comments = await Comment.query()
        .preload('user')
        .withCount('reacts')
        .where('postId', postId)
        .orderBy('createdAt', 'desc')
        .paginate(prevPage, 2)

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
    const validatedData = await deleteCommentValidator.validate(request.all())
    const userId: number = validatedData.userId
    const commentId: number = validatedData.commentId

    const comment = await Comment.query()
      .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
      .where('comments.comment_id', commentId)
      .firstOrFail()

    if (!comment) {
      return response.status(404).send({
        message: ' comment not found',
      })
    }

    if (comment.userId !== userId && comment.post.userId !== userId) {
      return response.status(403).send({
        message: 'You are not authorized to delete this comment',
      })
    }
    await comment.delete()

    response.status(200).send({
      message: 'Delete post successfully',
      deletedPost: comment,
    })
  }

  public async updateComment({ request, response }: HttpContext) {
    const validatedData = await UpdateCommentValidator.validate(request.all())
    const commentId: number = validatedData.commentId
    const userId: number = validatedData.userId
    const commentText: string = validatedData.text

    const comment = await Comment.findOrFail(commentId)

    if (!comment) {
      return response.status(404).send({
        message: 'Comment not found',
      })
    }

    if (comment.userId !== userId) {
      return response.status(403).send({
        message: 'You are not authorized to update this post',
      })
    }

    comment.text = commentText
    await comment.save()
    response.status(200).send({
      message: 'Update post successfully',
      comment,
    })
  }

  public async commentReaction({ auth, request, response }: HttpContext) {
    const validatedData = await CommentReactValidator.validate(request.all())
    const commentId: number = validatedData.commentId
    const reactType: ReactType = validatedData.reactType ?? ReactType.LIKE
    const user = auth.use('web').user!
    const comment = await Comment.findOrFail(commentId)

    if (!comment) {
      return response.status(404).send({
        message: 'Comment not found',
      })
    }

    const commentReact = await CommentReact.query()
      .where('commentId', commentId)
      .andWhere('userId', user.userId)
      .first()

    if (commentReact) {
      await commentReact.delete()

      return response.status(200).send({
        message: 'Undo react successfully',
        userId: user.userId,
        commentReact,
      })
    }

    const commentReactCreated = await CommentReact.create({
      userId: user.userId,
      commentId: validatedData.commentId,
      reactType: reactType,
    })

    await commentReactCreated.refresh()
    await commentReactCreated.load('user')

    return response.status(200).send({
      message: 'Reacted successfully',
      commentReact: {
        ...commentReactCreated.serialize(),
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    })
  }
}
