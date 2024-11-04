// app/Models/Reply.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Comment from './Comment.js'
import ReplyReact from './ReplyReact.js'

export default class Reply extends BaseModel {
  @column({ isPrimary: true })
  declare replyId: number

  @column()
  declare text: string

  @column()
  declare commentId: number

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

  @belongsTo(() => Comment, {
    foreignKey: 'commentId',
  })
  declare comment: BelongsTo<typeof Comment>

  @hasMany(() => ReplyReact, {
    foreignKey: 'replyId',
  })
  declare replyReact: HasMany<typeof ReplyReact>
}
