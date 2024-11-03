import { BaseSchema } from '@adonisjs/lucid/schema'
import { ReactType } from '../../app/models/PostReact.js'
export default class extends BaseSchema {
  protected tableName = 'post_reacts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('post_react_id') // Primary key

      table
        .integer('post_id')
        .unsigned()
        .notNullable()
        .references('post_id')
        .inTable('posts')
        .onDelete('CASCADE')

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE')

      table.enum('react_type', Object.values(ReactType)).notNullable().defaultTo(ReactType.LIKE)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
