import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Operarios extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public owner_id: string;
  
  @column()
  public ficha_matricula: string;

  @column()
  public ficha_ccu: string;

  @column()
  public ficha_descricao: string;

  @column()
  public ficha_adm: string;

  @column()
  public ficha_categoria: string;

  @column()
  public ficha_codigo: string;

  @column()
  public ficha_descricao2: string;

  @column()
  public ficha_turno: string;

  @column()
  public ficha_situacao: string;

  @column()
  public ficha_status: string;

  @column()
  public operario_foto: string;

  @column()
  public operario_nome: string;

  @column()
  public operario_nascimento: string;

  @column()
  public operario_endereco: string;

  @column()
  public operario_numero: string;

  @column()
  public operario_cidade: string;

  @column()
  public operario_doenca: string;
  
  @column()
  public operario_medicamento: string;
  
  @column()
  public operario_peso: string;
  
  @column()
  public operario_alergia: string;
  
  @column()
  public operario_sangue: string;
  
  @column()
  public operario_sus_numero: string;
  
  @column()
  public operario_plano_numero: string;
  
  @column()
  public operario_contatos_emergencia: string;
  
  @column()
  public operario_qualificacoes: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
