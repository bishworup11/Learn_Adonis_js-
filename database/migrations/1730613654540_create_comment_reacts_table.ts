import { BaseSchema } from '@adonisjs/lucid/schema'
import { ReactType } from '../../app/models/CommentReact.js'

export default class extends BaseSchema {
  protected tableName = 'comment_reacts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('comment_react_id').primary()
      table
        .integer('comment_id')
        .unsigned()
        .notNullable()
        .references('comment_id')
        .inTable('comments')
        .onDelete('CASCADE') // Deletes reaction if associated comment is deleted

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE') // Deletes reaction if associated user is deleted

      // Enum for react type
      table.enum('react_type', Object.values(ReactType)).notNullable().defaultTo(ReactType.LIKE)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
