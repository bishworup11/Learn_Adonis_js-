// app/Models/PostReact.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Post from './post.js'

// Enum for reaction types
export enum ReactType {
  LIKE = 'like',
  LOVE = 'love',
  ANGRY = 'angry',
}

export default class PostReact extends BaseModel {
  @column({ isPrimary: true })
  declare postReactId: number

  @column()
  declare postId: number

  @column()
  declare userId: number

  // Use the enum type here
  @column()
  declare reactType: ReactType

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Post, {
    foreignKey: 'postId',
  })
  declare post: BelongsTo<typeof Post>
}
