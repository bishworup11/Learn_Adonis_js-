import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'

export default class PostCategory extends BaseModel {
  @column({ isPrimary: true })
  declare postCategoryId: number

  @column()
  declare type: string

  @hasMany(() => Post, {
    foreignKey: 'postCategoryId',
  })
  declare posts: HasMany<typeof Post>
}
