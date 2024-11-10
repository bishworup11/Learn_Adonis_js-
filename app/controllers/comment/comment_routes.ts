import router from '@adonisjs/core/services/router'
import { middleware } from '../../../start/kernel.js'
const CommentController = () => import('./comment_controller.js')
// Grouped Comment Routes
router
  .group(() => {
    router.post('create-comment', [CommentController, 'createComment'])
    router.get('get-comment', [CommentController, 'getComment'])
    router.post('update-comment', [CommentController, 'updateComment'])
    router.delete('delete-comment', [CommentController, 'deleteComment'])
    router.post('comment-react', [CommentController, 'commentReaction'])
  })
  .middleware([middleware.auth()])
