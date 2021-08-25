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
        table.string('qr_emergencia').notNullable();
        table.string('qr_meu_nome').notNullable();
        table.string('qr_meu_data').notNullable();
        table.string('qr_meu_endereco').notNullable();
        table.string('qr_meu_numero').notNullable();
        table.string('qr_meu_cidade').notNullable();
        table.string('qr_meu_obs').notNullable();
        table.string('qr_meu_emergencia').notNullable();
        table.boolean('qr_status').defaultTo(0).notNullable();
        table.string('qr_id').notNullable().unique();
        table.string('qr_code').notNullable();
        table.string('qr_meu_foto').notNullable();
        table.string('qr_password').notNullable();
    });
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
