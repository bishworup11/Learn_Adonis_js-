import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('user_id').primary() // Primary key
      table.string('first_name').notNullable() // First name
      table.string('last_name').notNullable() // Last name
      table.string('email').notNullable().unique() // Email, unique constraint
      table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP')) // Created at timestamp
      table
        .timestamp('updated_at')
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')) // Updated at timestamp
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
