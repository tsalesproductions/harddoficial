import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class QrCode extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
    public qr_imagem: string;

    @column()
    public qr_cliente_nome: string;

    @column()
    public qr_cliente_nascimento: string;

    @column()
    public qr_cliente_endereco_rua: string;

    @column()
    public qr_cliente_endereco_numero: string;

    @column()
    public qr_cliente_endereco_cidade: string;

    @column()
    public qr_cliente_tipo_sanguineo: string;

    @column()
    public qr_cliente_alergia: string;

    @column()
    public qr_cliente_peso: string;

    @column()
    public qr_cliente_uso_medicamento: string;

    @column()
    public qr_cliente_email: string;

    @column()
    public qr_emergencia: string;

    @column()
    public qr_meu_nome: string;

    @column()
    public qr_meu_data: string;

    @column()
    public qr_meu_endereco: string;

    @column()
    public qr_meu_numero: string;

    @column()
    public qr_meu_cidade: string;

    @column()
    public qr_meu_obs: string;

    @column()
    public qr_meu_emergencia: string;

    @column()
    public qr_status: string;

    @column()
    public qr_id: string;

    @column()
    public qr_code: string;

    @column()
    public qr_meu_foto: string;

    @column()
    public qr_password: string;
}
