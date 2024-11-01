// app/Models/User.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'
import Comment from './Comment.js'
import Reply from './Reply.js'
import PostLike from './PostLike.js'
import CommentLike from './CommentLike.js'
import ReplyLike from './ReplyLike.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare userId: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @hasMany(() => Post, {
    foreignKey: 'userId',
  })
  declare posts: HasMany<typeof Post>

  @hasMany(() => Comment, {
    foreignKey: 'userId',
  })
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Reply, {
    foreignKey: 'userId',
  })
  declare replies: HasMany<typeof Reply>

  @hasMany(() => PostLike, {
    foreignKey: 'userId',
  })
  declare postLikes: HasMany<typeof PostLike>

  @hasMany(() => CommentLike, {
    foreignKey: 'userId',
  })
  declare commentLikes: HasMany<typeof CommentLike>

  @hasMany(() => ReplyLike, {
    foreignKey: 'userId',
  })
  declare replyLikes: HasMany<typeof ReplyLike>
}
