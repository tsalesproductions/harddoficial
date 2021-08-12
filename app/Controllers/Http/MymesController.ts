import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QrData from 'App/Models/QrCode';
import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'

export default class MymesController {
  public async mymeManager({view, request, response, params }: HttpContextContract) {
    let body = params;

    let data = await QrData.findBy('qr_id', body.id);

    return view.render('myme/index', {data: data});
  }

  public async mymeSend({view, request, response }: HttpContextContract) {
    const { 
      field_eu_nome, 
      field_eu_nascimento,
      field_eu_endereco,
      field_eu_numero,
      field_eu_cidade,
      field_eu_sangue,
      field_eu_alergia,
      field_eu_peso,
      field_eu_medicamento,
      field_eu_email,
      field_eu_e_nome1,
      field_eu_e_contato1,
      field_eu_e_nome2,
      field_eu_e_contato2,
      field_meu_nome,
      field_meu_dataano,
      field_meu_endereco,
      field_meu_numero,
      field_meu_cidade,
      field_meu_obs,
      field_meu_c_nome1,
      field_meu_c_contato1,
      field_meu_c_nome2,
      field_meu_c_contato2,
      field_eu_foto,
      field_meu_foto
    } 
      = request.all();

    console.log(field_eu_nome);
    const coverImage = request.file('field_eu_nome')
    if (coverImage) {
      await coverImage.move(Application.tmpPath('uploads'))
    }
    
    
  }
}

