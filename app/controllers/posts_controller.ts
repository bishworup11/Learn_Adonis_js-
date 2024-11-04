import { HttpContext } from '@adonisjs/core/http'
import {
  createPostValidator,
  updatePostValidator,
  deletePostValidator,
  getAllPostsValidator,
  PostReactValidator,
  createCommentValidator,
  deleteCommentValidator,
  UpdateCommentValidator,
  CommentReactValidator,
} from '../validators/post.js'
import Post from '#models/post'
import db from '@adonisjs/lucid/services/db'
import PostReact from '#models/PostReact'
import Comment from '#models/Comment'
import CommentReact from '#models/CommentReact'

export default class PostsController {
  public async login(ctx: HttpContext) {
    const csrfToken = ctx.request.csrfToken
    ctx.response.status(200).send(csrfToken)
  }

  public async getPosts({ response, request }: HttpContext) {
    try {
      const validatedData = await getAllPostsValidator.validate(request.all())
      const limit = validatedData.limit ? validatedData.limit : 5
      const page = validatedData.page ? validatedData.page : 1
      const postId = validatedData.postId ? validatedData.postId : null

      //const posts = await db.from('posts').paginate(page, limit)
      if (postId) {
        const posts = await Post.query()
          .preload('user')
          .preload('postCategory', (q) => q.select('type'))
          .withCount('comments', (q) => q.as('comment_count'))
          .withCount('postReacts', (q) => q.as('reaction_count'))
          .join('post_categories', 'posts.post_category_id', 'post_categories.post_category_id')
          .where('posts.post_id', postId)
          .orderBy('postId', 'desc')

        // console.log(posts)

        response.status(200).send(posts)
      } else {
        const posts = await Post.query()
          .preload('user')
          .preload('postCategory', (q) => q.select('type'))
          .withCount('comments', (q) => q.as('comment_count'))
          .withCount('postReacts', (q) => q.as('reaction_count'))
          .join('post_categories', 'posts.post_category_id', 'post_categories.post_category_id')
          .orderBy('postId', 'desc')
          .paginate(page, Number(limit))

        //  console.log(posts)

        response.status(200).send(posts)
      }
    } catch (error) {
      response.status(500).send({
        message: 'Failed to fetch posts',
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

  public async createPost({ request, response }: HttpContext) {
    try {
      console.log(request.all())
      const validatedData = await createPostValidator.validate(request.all())

      const category = await db
        .from('post_categories')
        .select('post_categories.*')
        .where('post_categories.type', validatedData.category)

      // check if category exists

      if (category.length === 0) {
        return response.status(404).send({
          message: 'Category not found',
        })
      }

      const post = await Post.create({
        userId: validatedData.userId,
        text: validatedData.title,
        postCategoryId: category[0].post_category_id,
      })

      return response.status(201).send({
        message: 'Create post successfully',
        post,
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Validation failed',
        errors: error.messages,
      })
    }
  }

  public async updatePost({ request, response }: HttpContext) {
    const validatedData = await updatePostValidator.validate(request.all())
    const postId: number = validatedData.postId
    const userId: number = validatedData.userId
    const newPostTitle: string = validatedData.title

    const post = await Post.findOrFail(postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    if (post.userId !== userId) {
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

  public async deletePost({ request, response }: HttpContext) {
    const validatedData = await deletePostValidator.validate(request.all())
    const postId: number = validatedData.postId
    const userId: number = validatedData.userId

    const post = await Post.findOrFail(postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    if (post.userId !== userId) {
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

  public async postReaction({ request, response }: HttpContext) {
    const validatedData = await PostReactValidator.validate(request.all())
    const postId: number = validatedData.postId
    const userId: number = validatedData.userId

    const post = await Post.findOrFail(postId)

    if (!post) {
      return response.status(404).send({
        message: 'Post not found',
      })
    }

    const postReact = await PostReact.query()
      .where('postId', postId)
      .andWhere('userId', userId)
      .first()

    if (!postReact) {
      const postReactCreated = await PostReact.create({
        userId: validatedData.userId,
        postId: validatedData.postId,
        reactType: validatedData.reactType,
      })

      response.status(200).send({
        message: ' React  successfully',
        postReactCreated,
      })
    } else {
      await postReact.delete()

      response.status(200).send({
        message: 'undo react  successfully',
      })
    }
  }

  public async createComment({ request, response }: HttpContext) {
    try {
      console.log(request.all())
      const validatedData = await createCommentValidator.validate(request.all())

      const newComment = await Comment.create({
        userId: validatedData.userId,
        postId: validatedData.postId,
        text: validatedData.text,
      })

      return response.status(201).send({
        message: 'Comment successfully',
        newComment,
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Validation failed',
        errors: error.messages,
      })
    }
  }

  public async getComment({ request, response }: HttpContext) {
    const postId = request.input('postId')
    const prevPage = request.input('prevPage', 1)
    try {
      const comments = await Comment.query()
        .preload('user')
        .preload('post')
        .where('postId', postId)
        .orderBy('createdAt', 'desc')
        .paginate(prevPage, 2)

      response.status(200).send({
        comments,
        postId,
        prevPage,
      })
    } catch (error) {
      return response.status(400).send({
        errors: error.messages,
      })
    }
  }

  public async deletecomment({ request, response }: HttpContext) {
    const validatedData = await deleteCommentValidator.validate(request.all())
    const userId: number = validatedData.userId
    const commentId: number = validatedData.CommentId

    //const post = await Post.findOrFail(postId)
    //const comment = await Comment.findOrFail(commentId)
    const comment = await Comment.query()
      .preload('post')
      .where('comments.comment_id', commentId)
      .firstOrFail()

    if (!comment) {
      return response.status(404).send({
        message: ' comment not found',
      })
    }

    if (comment.userId !== userId && comment.post.userId !== userId) {
      return response.status(403).send({
        message: 'You are not authorized to delete this comment',
      })
    }
    await comment.delete()

    response.status(200).send({
      message: 'Delete post successfully',
      deletedPost: comment,
    })
  }

  public async updateComment({ request, response }: HttpContext) {
    const validatedData = await UpdateCommentValidator.validate(request.all())
    const commentId: number = validatedData.commentId
    const userId: number = validatedData.userId
    const commentText: string = validatedData.text

    const comment = await Comment.findOrFail(commentId)

    if (!comment) {
      return response.status(404).send({
        message: 'Comment not found',
      })
    }

    if (comment.userId !== userId) {
      return response.status(403).send({
        message: 'You are not authorized to update this post',
      })
    }

    comment.text = commentText
    await comment.save()
    response.status(200).send({
      message: 'Update post successfully',
      comment,
    })
  }

  public async commentReaction({ request, response }: HttpContext) {
    const validatedData = await CommentReactValidator.validate(request.all())
    const commentId: number = validatedData.commentId
    const userId: number = validatedData.userId

    const comment = await Comment.findOrFail(commentId)

    if (!comment) {
      return response.status(404).send({
        message: 'Comment not found',
      })
    }

    const commentReact = await CommentReact.query()
      .where('commentId', commentId)
      .andWhere('userId', userId)
      .first()

    console.log(commentReact)

    if (commentReact) {
      await commentReact.delete()

      //  const commentReact = await CommentReact.query()
      //    .delete()
      //    .where('commentId', commentId)
      //    .andWhere('userId', userId)
      //    .first()

      return response.status(200).send({
        message: 'Undo react successfully',
        commentReact,
      })
    }

    const commentReactCreated = await CommentReact.create({
      userId: validatedData.userId,
      commentId: validatedData.commentId,
      reactType: validatedData.reactType,
    })

    return response.status(200).send({
      message: 'Reacted successfully',
      commentReactCreated,
    })
  }
}
