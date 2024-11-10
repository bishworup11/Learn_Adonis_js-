import vine from '@vinejs/vine'
import { ReactType } from '../models/PostReact.js'

/**
 * Validates the creation of a reply
 */
export const createReplyValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().optional(),
    commentId: vine.number().positive(),
    text: vine.string().trim().minLength(1),
  })
)

/**
 * Validates the deletion of a reply
 */
export const deleteReplyValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    replyId: vine.number().positive(),
  })
)

/**
 * Validates the update of a reply
 */
export const UpdateReplyValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    replyId: vine.number().positive(),
    text: vine.string().trim().minLength(1),
  })
)

/**
 * Validates reactions on a reply
 */
export const ReplyReactValidator = vine.compile(
  vine.object({
    replyId: vine.number().positive(),
    userId: vine.number().positive().optional(),
    reactType: vine.enum(Object.values(ReactType)).optional(),
  })
)
