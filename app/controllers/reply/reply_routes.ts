import router from '@adonisjs/core/services/router'
import { middleware } from '../../../start/kernel.js'
const ReplyController = () => import('./reply_controller.js')
router.group(() => {
  router.get('get-replies', [ReplyController, 'getReplies'])
  router.post('update-reply', [ReplyController, 'updateReply'])
  router.delete('delete-reply', [ReplyController, 'deleteReply'])
  router.post('create-reply', [ReplyController, 'createReply']).middleware([middleware.auth()])
  router.post('reply-react', [ReplyController, 'replyReaction']).middleware([middleware.auth()])
})
