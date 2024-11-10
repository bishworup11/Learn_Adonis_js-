import router from '@adonisjs/core/services/router'

import User from '#models/user'
import '../app/controllers/post/post_routes.js'
import '../app/controllers/user/user_routes.js'
import '../app/controllers/comment/comment_routes.js'
import '../app/controllers/reply/reply_routes.js'

router.on('/').render('pages/home').as('home')

// User routes
// router.post('/register', [UserController, 'register'])
// router.post('login', [UserController, 'login'])
// router.post('/logout', [UserController, 'logout']).use(middleware.auth())
// router.get('/user', [UserController, 'getUser']).use(middleware.auth())
// router.get('users-by-post-count', [UserController, 'getUsersByPostCount'])

// router.get('tokens', [UserController, 'getUserTokens']).use(
//   middleware.auth({
//     guards: ['api'],
//   })
// )

// Post routes
// router.get('get-limited-post-catergory', [PostsController, 'getLimitedPostsByCategory'])
// router.get('get-post', [PostsController, 'getPosts']).use(middleware.auth())
// router.get('get-post-user', [PostsController, 'getPostsByUser']).use(middleware.auth())
// router.post('create-post', [PostsController, 'createPost']).use(middleware.auth())
// router.post('update-post', [PostsController, 'updatePost']).use(middleware.auth())
// router.post('delete-post', [PostsController, 'deletePost']).use(middleware.auth())
// router.post('post-react', [PostsController, 'postReaction']).use(middleware.auth())
// router.post('post-visibility', [PostsController, 'postHide']).use(middleware.auth())

// Comment routes
// router.post('create-comment', [CommentController, 'createComment']).use(middleware.auth())
// router.get('get-comment', [CommentController, 'getComment']).use(middleware.auth())
// router.post('update-comment', [CommentController, 'updateComment']).use(middleware.auth())
// router.delete('delete-comment', [CommentController, 'deleteComment']).use(middleware.auth())
// router.post('comment-react', [CommentController, 'commentReaction']).use(middleware.auth())

// Reply routes
// router.post('create-reply', [ReplyController, 'createReply']).use(middleware.auth())
// router.get('get-replies', [ReplyController, 'getReplies'])
// router.post('update-reply', [ReplyController, 'updateReply'])
// router.delete('delete-reply', [ReplyController, 'deleteReply'])
// router.post('reply-react', [ReplyController, 'replyReaction']).use(middleware.auth())

router.post('users/:id/tokens', async ({ params }) => {
  const user = await User.findOrFail(params.id)
  const token = await User.accessTokens.create(user)

  return token
})

/**
 * response: {
 *   type: 'bearer',
 *   value: 'oat_MTA.aWFQUmo2WkQzd3M5cW0zeG5JeHdiaV9rOFQzUWM1aTZSR2xJaDZXYzM5MDE4MzA3NTU',
 *   expiresAt: null,
 * }
 */
