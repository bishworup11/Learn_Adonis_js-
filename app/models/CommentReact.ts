// app/Models/CommentReact.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Comment from './Comment.js'

export enum ReactType {
  LIKE = 'like',
  LOVE = 'love',
  ANGRY = 'angry',
}

export default class CommentReact extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  declare commentReactId: number

  @column()
  declare commentId: number

  @column()
  declare userId: number

  @column()
  declare reactType: ReactType

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Comment, {
    foreignKey: 'commentId',
  })
  declare comment: BelongsTo<typeof Comment>
}
