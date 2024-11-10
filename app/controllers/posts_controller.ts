import { HttpContext } from '@adonisjs/core/http'
import {
  createPostValidator,
  updatePostValidator,
  deletePostValidator,
  getAllPostsValidator,
  PostReactValidator,
} from '../validators/post.js'
import Post from '#models/post'
import PostReact from '#models/PostReact'
import { ReactType } from '#models/ReplyReact'

export default class PostsController {
  public async getPosts({ auth, response, request }: HttpContext) {
    try {
      const validatedData = await getAllPostsValidator.validate(request.all())
      const limit = validatedData.limit ? validatedData.limit : 5
      const page = validatedData.page ? validatedData.page : 1
      const postId = validatedData.postId ? validatedData.postId : null
      const user = auth.use('web').user!

      if (postId) {
        const posts = await Post.query()
          .where((builder) => {
            builder.where('visibility', true).orWhere('user_id', user.userId)
          })
          .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
          .preload('postCategory', (q) => q.select('type'))
          .preload('comments', (q) =>
            q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
          )
          .preload('postReacts', (q) =>
            q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
          )
          .withCount('comments', (q) => q.as('comment_count'))
          .withCount('postReacts', (q) => q.as('reaction_count'))
          .join('post_categories', 'posts.post_category_id', 'post_categories.post_category_id')
          .where('posts.post_id', postId)
          .orderBy('postId', 'desc')

        response.status(200).send(posts)
      } else {
        const posts = await Post.query()
          .where((builder) => {
            builder.where('visibility', true).orWhere('user_id', user.userId)
          })
          .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
          .preload('comments', (q) =>
            q
              .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
              .preload('reacts', (q) =>
                q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
              )
              .preload('replies', (q1) =>
                q1
                  .preload('user', (q2) => q2.select(['userId', 'firstName', 'lastName']))
                  .preload('replyReact', (q) =>
                    q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
                  )
              )
          )
          .preload('postReacts', (q) =>
            q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
          )
          .orderBy('postId', 'desc')
          .paginate(page, Number(limit))

        //.orderBy('postId', 'desc')
        // .paginate(page, Number(limit))
        //.preload('postCategory', (q) => q.select('type'))
        response.status(200).send(posts)
      }
    } catch (error) {
      response.status(500).send({
        message: 'Failed to fetch posts',
        error: error.message.response,
      })
    }
  }

  public async getPostsByUser({ auth, response, request }: HttpContext) {
    try {
      const validatedData = await getAllPostsValidator.validate(request.all())
      const limit = validatedData.limit ? validatedData.limit : 5
      const page = validatedData.page ? validatedData.page : 1
      const userId = validatedData.userId
      const user = auth.use('web').user!

      // Check if userId is provided
      if (!userId) {
        return response.status(400).send({
          message: 'User ID is required to fetch posts for a specific user',
        })
      }

      // Fetch posts for the specified user
      const posts = await Post.query()
        .where('user_id', userId)
        .where((builder) => {
          builder.where('visibility', true).orWhere('user_id', user.userId)
        })
        .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
        .preload('postCategory', (q) => q.select('type'))
        .preload('comments', (q) =>
          q
            .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
            .preload('reacts', (reactsQuery) =>
              reactsQuery.preload('user', (query) =>
                query.select(['userId', 'firstName', 'lastName'])
              )
            )
            .preload('replies', (replyQuery) =>
              replyQuery
                .preload('user', (userQuery) =>
                  userQuery.select(['userId', 'firstName', 'lastName'])
                )
                .preload('replyReact', (reactQuery) =>
                  reactQuery.preload('user', (query) =>
                    query.select(['userId', 'firstName', 'lastName'])
                  )
                )
            )
        )
        .preload('postReacts', (q) =>
          q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
        )
        .withCount('comments', (q) => q.as('comment_count'))
        .withCount('postReacts', (q) => q.as('reaction_count'))
        .orderBy('postId', 'desc')
        .paginate(page, Number(limit))

      response.status(200).send(posts)
    } catch (error) {
      response.status(500).send({
        message: 'Failed to fetch posts for the specified user',
        error: error.message,
      })
    }
  }

  public async getLimitedPostsByCategory({ response, request }: HttpContext) {
    try {
      const validatedData = await getAllPostsValidator.validate(request.all())
      const limit = validatedData.limit ? validatedData.limit : 5
      const page = validatedData.page ? validatedData.page : 1
      const type = validatedData.category ? validatedData.category : 'Travel'

      // const posts = await db
      //   .from('posts')
      //   .select(
      //     'posts.*',
      //     'post_categories.type as category_type'
      //   )
      //   .join('post_categories', 'posts.post_category_id', 'post_categories.post_category_id')
      //   .where('post_categories.type', type)
      //   .paginate(page, Number(limit))

      const posts = await Post.query()
        .preload('user')
        .preload('postCategory')
        .join('post_categories', 'posts.post_category_id', 'post_categories.post_category_id')
        .where('post_categories.type', type)
        .orderBy('postId', 'desc')
        .paginate(page, Number(limit))

      response.status(200).send(posts)
    } catch (error) {
      response.status(500).send({
        message: 'Failed to fetch posts',
        error: error.message,
      })
    }
  }

  public async createPost({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await createPostValidator.validate(request.all())
      const user = auth.use('web').user!
      // const category = await db
      //   .from('post_categories')
      //   .select('post_categories.*')
      //   .where('post_categories.type', validatedData.category)

      // // check if category exists

      // if (category.length === 0) {
      //   return response.status(404).send({
      //     message: 'Category not found',
      //   })
      // }

      const post = await Post.create({
        userId: user.userId,
        text: validatedData.text,
        postCategoryId: 1,
      })

      // Reload the post with relationships
      await post.refresh()
      await post.load('user')
      await post.load('postCategory')

      return response.status(201).send({
        message: 'Create post successfully',
        post: {
          ...post.serialize(),
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          comments: [],
          postReacts: [],
        },
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Validation failed',
        errors: error.messages,
      })
    }
  }

  public async updatePost({ auth, request, response }: HttpContext) {
    const validatedData = await updatePostValidator.validate(request.all())
    const postId: number = validatedData.postId
    const newPostTitle: string = validatedData.text
    const user = auth.use('web').user!
    const post = await Post.findOrFail(postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    //  console.log(user, post.userId)

    if (!user || post.userId !== user.userId) {
      return response.status(403).send({
        message: 'You are not authorized to update this post',
      })
    }

    post.text = newPostTitle
    await post.save()
    response.status(200).send({
      message: 'Update post successfully',
      post,
    })
  }

  public async deletePost({ auth, request, response }: HttpContext) {
    const validatedData = await deletePostValidator.validate(request.all())
    const postId: number = validatedData.postId
    //const userId: number = validatedData.userId

    const post = await Post.findOrFail(postId)
    const user = auth.use('web').user!

    console.log(user, post.userId)
    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    if (post.userId !== user.userId) {
      return response.status(403).send({
        message: 'You are not authorized to delete this post',
      })
    }
    await post.delete()

    response.status(200).send({
      message: 'Delete post successfully',
      deletedPost: post,
    })
  }

  public async postReaction({ auth, request, response }: HttpContext) {
    const validatedData = await PostReactValidator.validate(request.all())
    const postId: number = validatedData.postId
    const reactType: ReactType = validatedData.reactType ?? ReactType.LIKE
    const user = auth.use('web').user!

    const post = await Post.findOrFail(postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    const postReact = await PostReact.query()
      .where('postId', postId)
      .andWhere('userId', user.userId)
      .first()

    if (!postReact) {
      const postReactCreated = await PostReact.create({
        userId: user.userId,
        postId: validatedData.postId,
        reactType: reactType,
      })

      response.status(200).send({
        message: ' React  successfully',
        userId: user.userId,
        postReactCreated: {
          ...postReactCreated.serialize(),
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      })
    } else {
      await postReact.delete()

      response.status(200).send({
        message: 'undo react  successfully',
        userId: user.userId,
      })
    }
  }

  public async postHide({ auth, request, response }: HttpContext) {
    const validatedData = await PostReactValidator.validate(request.all())
    const postId: number = validatedData.postId

    const user = auth.use('web').user!

    const post = await Post.findOrFail(postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    if (!user || post.userId !== user.userId) {
      return response.status(403).send({
        message: 'You are not authorized to update this post',
      })
    }

    post.visibility = !post.visibility
    await post.save()
    response.status(200).send({
      message: 'Update post Visibility successfully',
      post,
    })
  }
}
