import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Prefeitura from 'App/Models/Prefeitura'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import QrData from 'App/Models/QrCode';

export default class PrefeiturasController {
  private async uploadFile(request, name){
    const file = request.file(name);
    const fileName = `prefeitura_${Math.floor(Math.random() * 99999999) + 1}.${file.extname}`
    await file.move(Application.publicPath('uploads/prefeituras'), {
      name: fileName,
    });

    return `/uploads/prefeituras/${fileName}`;
  }

  public async index ({view}: HttpContextContract) {
    let data = await Prefeitura.query().select('*');
    return view.render('prefeituras/listar', {
      results: data
    });
  }

  public async createView ({view}: HttpContextContract) {
    return view.render('prefeituras/criar');
  }

  public async create ({response, request, session}: HttpContextContract) {
    
    const { prefeitura_nome } = request.all();

    let prefeitura_logo = await this.uploadFile(request, 'prefeitura_logo')

    let status = await Prefeitura.create({
      prefeitura_nome: prefeitura_nome,
      prefeitura_logo: prefeitura_logo,
    });
    
    if(status) return response.redirect(`../prefeitura/${status.id}`)
    session.flash('notification', 'Houve um erro ao cadastrar a prefeitura:<br>'+status);
  }

  public async edit ({response, request, view, params}: HttpContextContract) {
    let data = await Prefeitura.findBy('id', params.id);
    if(!data) return response.redirect("../../prefeituras/");
    return view.render('prefeituras/editar', {data: data});
  }

  public async editList ({response, request, session}: HttpContextContract) {
    const { prefeitura_id, prefeitura_nome, prefeitura_status } = request.all();
    let data = await this.prefeituraManager(request, prefeitura_nome, prefeitura_status);
    
    let status = await Prefeitura.query().update(data).where({id: prefeitura_id});
    
    if(status) return response.redirect(`./editar/${prefeitura_id}`)
    session.flash('notification', 'Houve um erro ao cadastrar a prefeitura:<br>'+status);
  }

  private async prefeituraManager(request, prefeitura_nome, prefeitura_status){
    let data;
    let file = request.file('prefeitura_logo');

    if(file){
      data = {
        prefeitura_nome: prefeitura_nome,
        prefeitura_logo: await this.uploadFile(request, 'prefeitura_logo'),
        prefeitura_status: prefeitura_status
      };
    }else{
      data = {
        prefeitura_nome: prefeitura_nome,
        prefeitura_status: prefeitura_status
      };
    }

    return data;
  }

  public async list ({view, params}: HttpContextContract) {
    let data = await Prefeitura.findBy('id', params.id);
    let qrs = await await QrData.query().select('*').whereRaw('qr_prefeitura = '+params.id);
    return view.render('prefeituras/visualizar', {
      prefeitura: data,
      data: qrs
    });
  }

  public async getAllPrefeituras(){
    return await Prefeitura.query().select('*').whereRaw("prefeitura_status = 1")
  }

}
