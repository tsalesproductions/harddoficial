import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Prefeitura extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public prefeitura_nome: string;

  @column()
  public prefeitura_logo: string;
  
  @column()
  public prefeitura_status: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
