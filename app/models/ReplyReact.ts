// app/Models/ReplyReact.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Reply from './Reply.js'
export enum ReactType {
  LIKE = 'like',
  LOVE = 'love',
  ANGRY = 'angry',
}
export default class ReplyReact extends BaseModel {
  @column({ isPrimary: true })
  declare replyReactId: number

  @column()
  declare replyId: number

  @column()
  declare userId: number
  // Use the enum type here
  @column()
  declare reactType: ReactType

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Reply, {
    foreignKey: 'replyId',
  })
  declare reply: BelongsTo<typeof Reply>
}
