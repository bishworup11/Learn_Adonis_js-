import vine from '@vinejs/vine'
import { ReactType } from '../models/PostReact.js'

/**
 * Validates the creation of a comment
 */
export const createCommentValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().optional(),
    postId: vine.number().positive(),
    text: vine.string().trim().minLength(1),
  })
)

/**
 * Validates the deletion of a comment
 */
export const deleteCommentValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    commentId: vine.number().positive(),
  })
)

/**
 * Validates the update of a comment
 */
export const UpdateCommentValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    commentId: vine.number().positive(),
    text: vine.string().trim().minLength(1),
  })
)

/**
 * Validates reactions on a comment
 */
export const CommentReactValidator = vine.compile(
  vine.object({
    commentId: vine.number().positive(),
    userId: vine.number().positive().optional(),
    reactType: vine.enum(Object.values(ReactType)).optional(),
  })
)
