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

// // Get all posts
router.get('get-posts', [PostsController, 'getPosts'])
router.get('get-limited-post-catergory', [PostsController, 'getLimitedPostsByCategory'])
// // Create post

router.post('create-post', [PostsController, 'createPost'])

// // Update post

router.post('update-post', [PostsController, 'updatePost'])

// // Delete post

router.delete('delete-post', [PostsController, 'deletePost'])

// Post Reactions
router.post('post-react', [PostsController, 'postReaction'])

// Post Comment create

router.post('create-comment', [PostsController, 'createComment'])

// // Update comment

router.post('update-comment', [PostsController, 'updateComment'])

// // Delete comment

router.delete('delete-comment', [PostsController, 'deletecomment'])
