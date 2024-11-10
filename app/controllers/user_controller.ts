import { HttpContext } from '@adonisjs/core/http'
import {
  getUsersByPostCountValidator,
  loginValidator,
  registerValidator,
} from '../validators/post.js'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
//import db from '@adonisjs/lucid/services/db'

export default class UserController {
  public async register({ request, response }: HttpContext) {
    try {
      const validatedData = await registerValidator.validate(request.all())
      const { firstName, lastName, email, password } = validatedData

      // Check if user already exists
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.status(400).send({
          message: 'User with this email already exists',
        })
      }

      // Hash password and create user
      const hashedPassword = await hash.make(password)
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      })

      return response.status(201).send({
        message: 'Registration successful',
        user: user,
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Failed to register',
        errors: error.messages || error.message,
      })
    }
  }

  public async login({ request, response, auth }: HttpContext) {
    try {
      const validatedData = await loginValidator.validate(request.all())
      const { email, password } = validatedData

      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(400).send({
          message: 'Invalid email or password',
        })
      }

      const passwordVerified = await hash.verify(user.password, password)
      if (!passwordVerified) {
        return response.status(400).send({
          message: 'Invalid email or password',
        })
      }

      // Login user
      await auth.use('web').login(user)
      // return true
      // //const token = await User.accessTokens.create(user)
      // // const user = await User.findOrFail(params.id)
      // const token = await User.accessTokens.create(user)
      // console.log(token)

      return response.status(200).send({
        message: 'Login successful',
        user: user,
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Failed to login',
        errors: error.messages || error.message,
      })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    //return true;

    // console.log(auth.user) // User
    // console.log(auth.authenticatedViaGuard) // 'api'
    // console.log(auth.user!.currentAccessToken)

    // if ('currentAccessToken' in auth.user!) {
    //   const token = auth.user!.currentAccessToken.identifier
    //   if (!token) {
    //     return response.badRequest({ message: 'Token not found' })
    //   }
    //   // await User.accessTokens.delete(auth.user!, token)
    // } else {
    //   return response.badRequest({ message: 'Access token not available' })
    // }

    return response.status(200).send({
      message: 'Logged out successfully',
    })
  }

  public async getUserTokens({ auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user

      if (!user) {
        return response.status(401).send({
          message: 'Not authenticated',
        })
      }

      const tokens = await User.accessTokens.all(user)
      console.log(tokens)

      return response.ok({
        tokens: tokens,
      })
    } catch (error) {
      return response.status(500).send({
        message: 'Failed to get tokens',
        error: error.message,
      })
    }
  }

  public async getUser({ auth, response }: HttpContext) {
    try {
      const user = auth.use('web').user!

      // Load relationships if needed
      // await user.load('posts')
      // await user.load('comments')
      // await user.load('replies')

      return response.status(200).send({
        user: user,
       // userId: user.userId,
      })
    } catch (error) {
      return response.status(401).send({
        message: 'Unauthorized',
      })
    }
  }

  public async getUsersByPostCount({ request, response }: HttpContext) {
    try {
      const validatedData = await getUsersByPostCountValidator.validate(request.all())

      const { limit = 10, page = 1, minPosts = 0 } = validatedData

      //   const query = User.query()
      //     .select('users.*')
      //     .withCount('posts')
      //     .havingRaw('COUNT(posts.post_id) >= ?', [minPosts])
      //     .orderBy(db.raw('COUNT(posts.post_id)'), 'desc')
      //     .join('posts', 'users.user_id', '=', 'posts.user_id')
      //     .groupBy('users.user_id')
      const query = User.query().select('users.*').withCount('posts').orderBy('posts_count', 'desc')

      const users = await query.paginate(page, limit)

      return response.status(200).send({
        message: 'Users retrieved successfully',
        users: users,
        pagination: {
          total: users.length,
          perPage: limit,
          currentPage: page,
          lastPage: Math.ceil(users.length / limit),
        },
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Failed to retrieve users',
        errors: error.messages || error.message,
      })
    }
  }
}
