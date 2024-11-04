/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const PostsController = () => import('#controllers/posts_controller')

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')

// Persistent posts array for testing (normally, you'd use a database)

router.get('login', [PostsController, 'login'])
//Select users who made the most posts, sorted by post count:
router.get('users-by-post-count', [PostsController, 'getUsersByPostCount'])

// Post CRUD and all routes
router.get('get-post', [PostsController, 'getPosts'])
router.get('get-limited-post-catergory', [PostsController, 'getLimitedPostsByCategory'])
router.post('create-post', [PostsController, 'createPost'])
router.post('update-post', [PostsController, 'updatePost'])
router.delete('delete-post', [PostsController, 'deletePost'])

// Post Reactions
router.post('post-react', [PostsController, 'postReaction'])

// Comment CRUD and Comment Reactions

router.post('create-comment', [PostsController, 'createComment'])
router.get('get-comment', [PostsController, 'getComment'])
router.post('update-comment', [PostsController, 'updateComment'])
router.delete('delete-comment', [PostsController, 'deletecomment'])
router.post('comment-react', [PostsController, 'commentReaction'])

// Routes for Reply and Reply Reactions
router.post('create-reply', [PostsController, 'createReply'])
router.get('get-replies', [PostsController, 'getReplies'])
router.post('update-reply', [PostsController, 'updateReply'])
router.delete('delete-reply', [PostsController, 'deleteReply'])
router.post('reply-react', [PostsController, 'replyReaction'])
