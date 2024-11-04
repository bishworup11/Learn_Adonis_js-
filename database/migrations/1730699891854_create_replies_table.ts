import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'replies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('reply_id') // Primary key
      table.text('text').notNullable() // Text content of the reply
      table
        .integer('comment_id')
        .unsigned()
        .notNullable()
        .references('comment_id')
        .inTable('comments')
        .onDelete('CASCADE') // Foreign key to comments table
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE') // Foreign key to users table
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now()) 
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now()) 
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}