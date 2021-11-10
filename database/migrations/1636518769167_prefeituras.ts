import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Prefeituras extends BaseSchema {
  protected tableName = 'prefeituras'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('prefeitura_nome').notNullable();
      table.string('prefeitura_logo').notNullable();
      table.string('prefeitura_status').notNullable().defaultTo('1');
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
