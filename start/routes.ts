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
router.get('get-limited-posts', [PostsController, 'getLimitedPosts'])
// // Create post

router.post('create-post', [PostsController, 'createPost'])

// // Update post

router.post('update-post', [PostsController, 'updatePost'])

// // Delete post

router.delete('delete-post', [PostsController, 'deletePost'])
