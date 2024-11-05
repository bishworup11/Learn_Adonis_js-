const PostsController = () => import('#controllers/posts_controller')
const UserController = () => import('#controllers/user_controller')
const CommentController = () => import('#controllers/comment_controller')
const ReplyController = () => import('#controllers/reply_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.on('/').render('pages/home').as('home')

// User routes
router.post('/register', [UserController, 'register'])
router.post('login', [UserController, 'login'])
// router.post('/logout', [UserController, 'logout']).use(middleware.auth())
router.post('/logout', [UserController, 'logout'])
router.get('/user', [UserController, 'getUser']).use(middleware.auth())
router.get('users-by-post-count', [UserController, 'getUsersByPostCount'])

// Post routes
router.get('get-limited-post-catergory', [PostsController, 'getLimitedPostsByCategory'])
router.get('get-post', [PostsController, 'getPosts'])
router.post('create-post', [PostsController, 'createPost'])
router.post('update-post', [PostsController, 'updatePost'])
router.delete('delete-post', [PostsController, 'deletePost'])
router.post('post-react', [PostsController, 'postReaction'])

// Comment routes
router.post('create-comment', [CommentController, 'createComment'])
router.get('get-comment', [CommentController, 'getComment'])
router.post('update-comment', [CommentController, 'updateComment'])
router.delete('delete-comment', [CommentController, 'deleteComment'])
router.post('comment-react', [CommentController, 'commentReaction'])

// Reply routes
router.post('create-reply', [ReplyController, 'createReply'])
router.get('get-replies', [ReplyController, 'getReplies'])
router.post('update-reply', [ReplyController, 'updateReply'])
router.delete('delete-reply', [ReplyController, 'deleteReply'])
router.post('reply-react', [ReplyController, 'replyReaction'])
