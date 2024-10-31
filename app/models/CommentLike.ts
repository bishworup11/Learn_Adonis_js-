// app/Models/CommentLike.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Comment from './Comment.js'

export default class CommentLike extends BaseModel {
  @column({ isPrimary: true })
  declare commentsLikeId: number

  @column()
  declare commentId: number

  @column()
  declare userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Comment, {
    foreignKey: 'commentId',
  })
  declare comment: BelongsTo<typeof Comment>
}
