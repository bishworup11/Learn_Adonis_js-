// posts.query.ts
import Post from '#models/post'

export default class PostsQuery {
  async getPostById(postId: number, userId: number) {
    return await Post.query()
      .where((builder) => {
        builder.where('visibility', true).orWhere('user_id', userId)
      })
      .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
      .preload('postCategory', (q) => q.select('type'))
      .preload('comments', (q) =>
        q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
      )
      .preload('postReacts', (q) =>
        q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
      )
      .withCount('comments', (q) => q.as('comment_count'))
      .withCount('postReacts', (q) => q.as('reaction_count'))
      .join('post_categories', 'posts.post_category_id', 'post_categories.post_category_id')
      .where('posts.post_id', postId)
      .orderBy('postId', 'desc')
  }

  async getAllPosts(userId: number, page: number, limit: number) {
    return await Post.query()
      .where((builder) => {
        builder.where('visibility', true).orWhere('user_id', userId)
      })
      .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
      .preload('comments', (q) =>
        q
          .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
          .preload('reacts', (q) =>
            q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
          )
          .preload('replies', (q1) =>
            q1
              .preload('user', (q2) => q2.select(['userId', 'firstName', 'lastName']))
              .preload('replyReact', (q) =>
                q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
              )
          )
      )
      .preload('postReacts', (q) =>
        q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
      )
      .orderBy('postId', 'desc')
      .paginate(page, Number(limit))
  }

  async getPostsByUser(targetUserId: number, currentUserId: number, page: number, limit: number) {
    return await Post.query()
      .where('user_id', targetUserId)
      .where((builder) => {
        builder.where('visibility', true).orWhere('user_id', currentUserId)
      })
      .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
      .preload('postCategory', (q) => q.select('type'))
      .preload('comments', (q) =>
        q
          .preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
          .preload('reacts', (reactsQuery) =>
            reactsQuery.preload('user', (query) =>
              query.select(['userId', 'firstName', 'lastName'])
            )
          )
          .preload('replies', (replyQuery) =>
            replyQuery
              .preload('user', (userQuery) => userQuery.select(['userId', 'firstName', 'lastName']))
              .preload('replyReact', (reactQuery) =>
                reactQuery.preload('user', (query) =>
                  query.select(['userId', 'firstName', 'lastName'])
                )
              )
          )
      )
      .preload('postReacts', (q) =>
        q.preload('user', (query) => query.select(['userId', 'firstName', 'lastName']))
      )
      .withCount('comments', (q) => q.as('comment_count'))
      .withCount('postReacts', (q) => q.as('reaction_count'))
      .orderBy('postId', 'desc')
      .paginate(page, Number(limit))
  }

  async getPostsByCategory(category: string, page: number, limit: number) {
    return await Post.query()
      .preload('user')
      .preload('postCategory')
      .join('post_categories', 'posts.post_category_id', 'post_categories.post_category_id')
      .where('post_categories.type', category)
      .orderBy('postId', 'desc')
      .paginate(page, Number(limit))
  }
}
