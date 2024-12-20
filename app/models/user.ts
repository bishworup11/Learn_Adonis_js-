// app/Models/User.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'
import Comment from './Comment.js'
import Reply from './Reply.js'
import PostReact from './PostReact.js'
import CommentReact from './CommentReact.js'
import ReplyReact from './ReplyReact.js'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class User extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  declare userId: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

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

  @hasMany(() => PostReact, {
    foreignKey: 'userId',
  })
  declare postLikes: HasMany<typeof PostReact>

  @hasMany(() => CommentReact, {
    foreignKey: 'userId',
  })
  declare commentLikes: HasMany<typeof CommentReact>

  @hasMany(() => ReplyReact, {
    foreignKey: 'userId',
  })
  declare replyReacts: HasMany<typeof ReplyReact>


  
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
