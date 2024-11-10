import router from '@adonisjs/core/services/router'
import { middleware } from '../../../start/kernel.js'
const UserController = () => import('./user_controller.js')
router
  .group(() => {
    // Routes that don't require authentication
    router.post('/register', [UserController, 'register'])
    router.post('/login', [UserController, 'login'])

    // Routes that require authentication
    router.post('/logout', [UserController, 'logout']).middleware([middleware.auth()])
    router.get('/', [UserController, 'getUser']).middleware([middleware.auth()])
  })
  .prefix('user')

// Separate route for users-by-post-count
router.get('users-by-post-count', [UserController, 'getUsersByPostCount'])

router.get('tokens', [UserController, 'getUserTokens']).use(
  middleware.auth({
    guards: ['api'],
  })
)
