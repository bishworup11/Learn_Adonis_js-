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
