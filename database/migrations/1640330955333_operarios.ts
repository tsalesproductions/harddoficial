import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Operarios extends BaseSchema {
  protected tableName = 'operarios'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('owner_id').notNullable();

      table.string('ficha_matricula').notNullable();
      table.string('ficha_ccu').notNullable();
      table.string('ficha_descricao').notNullable();
      table.string('ficha_adm').notNullable();
      table.string('ficha_categoria').notNullable();
      table.string('ficha_codigo').notNullable();
      table.string('ficha_descricao2').notNullable();
      table.string('ficha_turno').notNullable();
      table.string('ficha_situacao').notNullable();

      table.string('operario_foto').nullable();
      table.string('operario_nome').nullable();
      table.string('operario_nascimento').nullable();
      table.string('operario_endereco').nullable();
      table.string('operario_numero').nullable();
      table.string('operario_cidade').nullable();
      table.string('operario_doenca').nullable();
      table.string('operario_medicamento').nullable();
      table.string('operario_peso').nullable();
      table.string('operario_alergia').nullable();
      table.string('operario_sangue').nullable();
      table.string('operario_sus_numero').nullable();
      table.string('operario_plano_numero').nullable();
      table.string('operario_contatos_emergencia').nullable();
      table.text('operario_qualificacoes', 'longtext').notNullable();
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
