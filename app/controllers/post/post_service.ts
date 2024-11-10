// posts.service.ts
import { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import PostReact from '#models/PostReact'
import { ReactType } from '#models/ReplyReact'
import PostsQuery from './post_query.js'

// Define interface for auth user
interface AuthUser {
  userId: number
  firstName: string
  lastName: string
}

export default class PostsService {
  private postsQuery: PostsQuery

  constructor() {
    this.postsQuery = new PostsQuery()
  }

  async getPosts(
    authUser: AuthUser,
    params: {
      limit?: number
      page?: number
      postId?: number
    }
  ) {
    const { limit = 5, page = 1, postId } = params

    if (postId) {
      return await this.postsQuery.getPostById(postId, authUser.userId)
    }

    return await this.postsQuery.getAllPosts(authUser.userId, page, limit)
  }

  async getPostsByUser(
    authUser: AuthUser,
    params: {
      userId: number
      limit?: number
      page?: number
    }
  ) {
    const { userId, limit = 5, page = 1 } = params

    if (!userId) {
      throw new Error('User ID is required to fetch posts for a specific user')
    }

    return await this.postsQuery.getPostsByUser(userId, authUser.userId, page, limit)
  }

  async getLimitedPostsByCategory(params: { limit?: number; page?: number; category?: string }) {
    const { limit = 5, page = 1, category = 'Travel' } = params
    return await this.postsQuery.getPostsByCategory(category, page, limit)
  }

  async createPost(authUser: AuthUser, data: { text: string }) {
    const post = await Post.create({
      userId: authUser.userId,
      text: data.text,
      postCategoryId: 1,
    })

    await post.refresh()
    await post.load('user')
    await post.load('postCategory')

    return {
      ...post.serialize(),
      user: {
        userId: authUser.userId,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
      },
      comments: [],
      postReacts: [],
    }
  }

  async updatePost(authUser: AuthUser, postId: number, text: string) {
    const post = await Post.findOrFail(postId)

    if (!post) {
      throw new Error('Post not found')
    }

    if (post.userId !== authUser.userId) {
      throw new Error('You are not authorized to update this post')
    }

    post.text = text
    await post.save()
    return post
  }

  async deletePost(authUser: AuthUser, postId: number) {
    const post = await Post.findOrFail(postId)

    if (!post) {
      throw new Error('Post not found')
    }

    if (post.userId !== authUser.userId) {
      throw new Error('You are not authorized to delete this post')
    }

    await post.delete()
    return post
  }

  async handlePostReaction(
    authUser: AuthUser,
    postId: number,
    reactType: ReactType = ReactType.LIKE
  ) {
    const post = await Post.findOrFail(postId)

    if (!post) {
      throw new Error('Post not found')
    }

    const existingReact = await PostReact.query()
      .where('postId', postId)
      .andWhere('userId', authUser.userId)
      .first()

    if (!existingReact) {
      const newReact = await PostReact.create({
        userId: authUser.userId,
        postId,
        reactType,
      })

      return {
        action: 'created',
        reaction: {
          ...newReact.serialize(),
          user: {
            userId: authUser.userId,
            firstName: authUser.firstName,
            lastName: authUser.lastName,
          },
        },
      }
    }

    await existingReact.delete()
    return {
      action: 'removed',
      userId: authUser.userId,
    }
  }

  async togglePostVisibility(authUser: AuthUser, postId: number) {
    const post = await Post.findOrFail(postId)

    if (!post) {
      throw new Error('Post not found')
    }

    if (post.userId !== authUser.userId) {
      throw new Error('You are not authorized to update this post')
    }

    post.visibility = !post.visibility
    await post.save()
    return post
  }
}
