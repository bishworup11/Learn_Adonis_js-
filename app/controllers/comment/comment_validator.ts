import vine from '@vinejs/vine'
import { ReactType } from '../../models/CommentReact.js'

export const createCommentValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().optional(),
    postId: vine.number().positive(),
    text: vine.string().trim().minLength(1),
  })
)

export const deleteCommentValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    commentId: vine.number().positive(),
  })
)

export const UpdateCommentValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    commentId: vine.number().positive(),
    text: vine.string().trim().minLength(1),
  })
)

export const CommentReactValidator = vine.compile(
  vine.object({
    commentId: vine.number().positive(),
    userId: vine.number().positive().optional(),
    reactType: vine.enum(Object.values(ReactType)).optional(),
  })
)
