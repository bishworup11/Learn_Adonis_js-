import vine from '@vinejs/vine'

import { ReactType } from '../models/PostReact.js'
import Comment from '#models/Comment'

/**
 * Validates the post's creation action
 */

export const createPostValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().optional(),
    text: vine.string().trim().minLength(6),
    category: vine.string().trim().minLength(3).optional(),
  })
)

/**
 * Validates the post's update action
 */
export const updatePostValidator = vine.compile(
  vine.object({
    postId: vine.number().positive(),
    userId: vine.number().positive().optional(),
    text: vine.string().trim().minLength(6),
  })
)

export const deletePostValidator = vine.compile(
  vine.object({
    postId: vine.number().positive(),
    userId: vine.number().positive().optional(),
  })
)

export const getPostValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)

export const getAllPostsValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().optional(),
    postId: vine.number().positive().optional(),
    limit: vine.number().positive().optional(),
    page: vine.number().positive().optional(),
    category: vine.string().trim().minLength(3).optional(),
  })
)

export const PostReactValidator = vine.compile(
  vine.object({
    postId: vine.number().positive(),
    reactType: vine.enum(Object.values(ReactType)).optional(),
  })
)

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
    CommentId: vine.number().positive(),
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

// Validators for Reply and Reply Reactions
export const createReplyValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().optional(),
    commentId: vine.number().positive(),
    text: vine.string().trim().minLength(1),
  })
)

export const deleteReplyValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    replyId: vine.number().positive(),
  })
)

export const UpdateReplyValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    replyId: vine.number().positive(),
    text: vine.string().trim().minLength(1),
  })
)

export const ReplyReactValidator = vine.compile(
  vine.object({
    replyId: vine.number().positive(),
    userId: vine.number().positive().optional(),
    reactType: vine.enum(Object.values(ReactType)).optional(),
  })
)

// this is user part
export const getUsersByPostCountValidator = vine.compile(
  vine.object({
    limit: vine.number().positive().optional(),
    page: vine.number().positive().optional(),
    minPosts: vine.number().positive().optional(),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2),
    lastName: vine.string().trim().minLength(2),
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
