import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.alterTable('posts', (table) => {
      table.integer('post_category_id').defaultTo('1')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
