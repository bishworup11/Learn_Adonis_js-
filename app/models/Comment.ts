// app/Models/Comment.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Post from './post.js'
import Reply from './Reply.js'
import CommentLike from './CommentLike.js'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare commentId: number

  @column()
  declare text: string

  @column()
  declare postId: number

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Post, {
    foreignKey: 'postId',
  })
  declare post: BelongsTo<typeof Post>

  @hasMany(() => Reply, {
    foreignKey: 'commentId',
  })
  declare replies: HasMany<typeof Reply>

  @hasMany(() => CommentLike, {
    foreignKey: 'commentId',
  })
  declare likes: HasMany<typeof CommentLike>
}
