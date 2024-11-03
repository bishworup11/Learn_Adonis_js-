// app/Models/Post.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Comment from './Comment.js'
import PostReact from './PostReact.js'
import PostCategory from './PostCategory.js'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare postId: number

  @column()
  declare userId: number

  @column()
  declare postCategoryId: number

  @column()
  declare text: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => PostCategory, {
    foreignKey: 'postCategoryId',
  })
  declare postCategory: BelongsTo<typeof PostCategory>

  @hasMany(() => Comment, {
    foreignKey: 'postId',
  })
  declare comments: HasMany<typeof Comment>

  @hasMany(() => PostReact, {
    foreignKey: 'postId',
  })
  declare likes: HasMany<typeof PostReact>
}
