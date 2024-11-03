import vine from '@vinejs/vine'

import { ReactType } from '../models/PostReact.js'

/**
 * Validates the post's creation action
 */

export const createPostValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    title: vine.string().trim().minLength(6),
    category: vine.string().trim().minLength(3),
  })
)

/**
 * Validates the post's update action
 */
export const updatePostValidator = vine.compile(
  vine.object({
    postId: vine.number().positive(),
    userId: vine.number().positive(),
    title: vine.string().trim().minLength(6),
  })
)

export const deletePostValidator = vine.compile(
  vine.object({
    postId: vine.number().positive(),
    userId: vine.number().positive(),
  })
)

export const getPostValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)

export const getAllPostsValidator = vine.compile(
  vine.object({
    limit: vine.number().positive().optional(),
    page: vine.number().positive().optional(),
    category: vine.string().trim().minLength(3).optional(),
  })
)

export const PostReactValidator = vine.compile(
  vine.object({
    postId: vine.number().positive(),
    userId: vine.number().positive(),
    reactType: vine.enum(Object.values(ReactType)),
  })
)
