import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QrData from 'App/Models/QrCode';

export default class ApisController {
  public async getList ({request, response, params }: HttpContextContract) {
    console.log(params);
    let body = params;

    if(!body.id) return response.json([{status: "error", msg: "Código não encontrado"}]);
    
    let data = await QrData.findBy('qr_id', body.id);
    if(!data) return response.json([{status: "error", msg: "Código não encontrado"}]);
    response.json([{status: "success", data: data}]);
  }

  public async setList ({request, response }: HttpContextContract) {

  }
}
