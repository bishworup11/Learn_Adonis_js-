import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UserService {
  public async register(data: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) {
    // const existingUser = await User.findBy('email', data.email)
    // if (existingUser) {
    //   throw new Error('User with this email already exists')
    // }

    const hashedPassword = await hash.make(data.password)
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    })

    return user
  }

  public async login(data: { email: string; password: string }) {
    const user = await User.findBy('email', data.email)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    const passwordVerified = await hash.verify(user.password, data.password)
    if (!passwordVerified) {
      throw new Error('Invalid email or password')
    }

    return user
  }

  public async logout(auth: any) {
    await auth.use('web').logout()
  }

  public async getUserTokens(user: any) {
    if (!user) {
      throw new Error('Not authenticated')
    }

    const tokens = await User.accessTokens.all(user)
    return tokens
  }

  public async getAuthenticatedUser(user: any) {
    if (!user) {
      throw new Error('Not authenticated')
    }
    return user
  }

  public async getUsersByPostCount(params: { limit?: number; page?: number; minPosts?: number }) {
    const { limit = 10, page = 1 } = params

    const query = User.query().select('users.*').withCount('posts').orderBy('posts_count', 'desc')

    const users = await query.paginate(page, limit)

    return {
      users,
      pagination: {
        total: users.length,
        perPage: limit,
        currentPage: page,
        lastPage: Math.ceil(users.length / limit),
      },
    }
  }
}
