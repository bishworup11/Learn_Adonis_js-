import { BaseSchema } from '@adonisjs/lucid/schema'
import { ReactType } from '../../app/models/ReplyReact.js'
export default class extends BaseSchema {
  protected tableName = 'reply_reacts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('reply_react_id') // Primary key
      table
        .integer('reply_id')
        .unsigned()
        .notNullable()
        .references('reply_id')
        .inTable('replies')
        .onDelete('CASCADE') // Foreign key to replies table
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
