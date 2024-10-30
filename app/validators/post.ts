import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
  })
)

/**
 * Validates the post's update action
 */
export const updatePostValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
    title: vine.string().trim().minLength(6),
    description: vine.string().trim().escape(),
  })
)

export const deletePostValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)

export const getPostValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)
