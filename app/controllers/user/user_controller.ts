import { HttpContext } from '@adonisjs/core/http'
import {
  getUsersByPostCountValidator,
  loginValidator,
  registerValidator,
} from './user_validator.js'
import UserService from './user_service.js'

export default class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  public async register({ request, response }: HttpContext) {
    try {
      const validatedData = await registerValidator.validate(request.all())
      const user = await this.userService.register(validatedData)

      return response.status(201).send({
        message: 'Registration successful',
        user,
      })
    } catch (error) {
      const status = error.message.includes('already exists') ? 400 : 500
      return response.status(status).send({
        message: 'Failed to register',
        errors: error.messages || error.message,
      })
    }
  }

  public async login({ request, response, auth }: HttpContext) {
    try {
      const validatedData = await loginValidator.validate(request.all())
      const user = await this.userService.login(validatedData)
      await auth.use('web').login(user)

      return response.status(200).send({
        message: 'Login successful',
        user,
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Failed to login',
        errors: error.messages || error.message,
      })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    try {
      await this.userService.logout(auth)
      return response.status(200).send({
        message: 'Logged out successfully',
      })
    } catch (error) {
      return response.status(500).send({
        message: 'Failed to logout',
        error: error.message,
      })
    }
  }

  public async getUserTokens({ auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user
      const tokens = await this.userService.getUserTokens(user)

      return response.ok({
        tokens,
      })
    } catch (error) {
      const status = error.message === 'Not authenticated' ? 401 : 500
      return response.status(status).send({
        message: 'Failed to get tokens',
        error: error.message,
      })
    }
  }

  public async getUser({ auth, response }: HttpContext) {
    try {
      const user = auth.use('web').user!
      const authenticatedUser = await this.userService.getAuthenticatedUser(user)

      return response.status(200).send({
        user: authenticatedUser,
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
      const result = await this.userService.getUsersByPostCount(validatedData)

      return response.status(200).send({
        message: 'Users retrieved successfully',
        ...result,
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Failed to retrieve users',
        errors: error.messages || error.message,
      })
    }
  }
}
