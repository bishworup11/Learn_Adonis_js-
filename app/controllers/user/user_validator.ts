import vine from '@vinejs/vine'

/**
 * Validates fetching users by their post count
 */
export const getUsersByPostCountValidator = vine.compile(
  vine.object({
    limit: vine.number().positive().optional(),
    page: vine.number().positive().optional(),
    minPosts: vine.number().positive().optional(),
  })
)

/**
 * Validates user registration
 */
export const registerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2),
    lastName: vine.string().trim().minLength(2),
    email: vine
      .string()
      .email()
      .exists(async (db, value, field) => {
        const user = await db.from('users').where('email', value).first()
        return !user // Return true if no user exists with this email, otherwise false
      }),
    password: vine.string().minLength(8),
  })
)

/**
 * Validates user login
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
