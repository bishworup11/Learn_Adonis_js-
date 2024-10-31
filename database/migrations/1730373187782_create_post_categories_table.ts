import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('post_category_id').primary()
      table.string('type').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
