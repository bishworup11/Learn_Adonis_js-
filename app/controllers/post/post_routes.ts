import router from '@adonisjs/core/services/router'
import { middleware } from '../../../start/kernel.js'
const PostsController = () => import('./posts_controller.js')
// Grouped Post Routes
router
  .group(() => {
    // Routes that don't require authentication
    // router.get('get-limited-post-category', [PostsController, 'getLimitedPostsByCategory'])
    router.get('get-post', [PostsController, 'getPosts'])
    router.get('get-post-user', [PostsController, 'getPostsByUser'])

    // Routes that require authentication
    router.post('create-post', [PostsController, 'createPost'])
    router.post('update-post', [PostsController, 'updatePost'])
    router.post('delete-post', [PostsController, 'deletePost'])
    router.post('post-react', [PostsController, 'postReaction'])
    router.post('post-visibility', [PostsController, 'postHide'])
  })
  .middleware([middleware.auth()])
