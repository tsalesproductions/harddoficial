import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class QrCodes extends BaseSchema {
  protected tableName = 'qr_codes'

  public async up () {
    this.schema.createTable(this.tableName, table => {
        table.increments('id');
        table.string('qr_imagem').notNullable();
        table.string('qr_cliente_nome').notNullable();
        table.string('qr_cliente_nascimento').notNullable();
        table.string('qr_cliente_endereco_rua').notNullable();
        table.string('qr_cliente_endereco_numero').notNullable();
        table.string('qr_cliente_endereco_cidade').notNullable();
        table.string('qr_cliente_tipo_sanguineo').notNullable();
        table.string('qr_cliente_alergia').notNullable();
        table.string('qr_cliente_peso').notNullable();
        table.string('qr_cliente_uso_medicamento').notNullable();
        table.string('qr_cliente_email').notNullable();
        table.string('qr_cliente_escola_nome').notNullable();
        table.string('qr_cliente_escola_serie').notNullable();
        table.string('qr_emergencia').notNullable();
        table.string('qr_cliente_doenca').notNullable();
        table.string('qr_cliente_anexo').notNullable();
        table.string('qr_cliente_obs').notNullable();
        table.string('qr_cliente_sus_numero').notNullable();
        table.string('qr_cliente_plano_nome').notNullable();
        table.string('qr_cliente_plano_numero').notNullable();
        table.text('qr_meus', 'longtext').notNullable();
        table.boolean('qr_status').defaultTo(0).notNullable();
        table.string('qr_modelo').defaultTo('default').notNullable();
        table.string('qr_prefeitura').nullable();
        table.string('qr_id').notNullable();
        table.text('qr_code').notNullable();
        table.string('qr_password').notNullable();
    });
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
