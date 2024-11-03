import vine from '@vinejs/vine'

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
