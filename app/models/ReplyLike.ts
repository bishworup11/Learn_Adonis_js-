// app/Models/ReplyLike.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Reply from './Reply.js'

export default class ReplyLike extends BaseModel {
  @column({ isPrimary: true })
  declare replyLikeId: number

  @column()
  declare replyId: number

  @column()
  declare userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Reply, {
    foreignKey: 'replyId',
  })
  declare reply: BelongsTo<typeof Reply>
}
