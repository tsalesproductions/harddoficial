import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import QrData from 'App/Models/QrCode';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import MymeModelosController from './MymeModelosController';
import PrefeiturasController from './PrefeiturasController';

const QRCode = require('qrcode');
const url = "https://www.hardd.com.br/myme?id=";

export default class QrsController extends MymeModelosController {
  public async identify({ view, auth, response }: HttpContextContract) {
    return view.render('myme/identify');
  }

  public async showIndex({ view, auth, response }: HttpContextContract) {
    await auth.use('web').authenticate();
    // let qr = await QRCode.toDataURL('https://www.hardd.com.br/');
    // console.log(qr);
    const userData = await User.findBy('email', auth.user?.email);

    if (!userData) {
        await auth.logout();
        return response.redirect('/login');
    }
    
    const name = userData.name;

    return view.render('qrcode/new',{
      user: userData,
      name,
      prefeituras:await new PrefeiturasController().getAllPrefeituras()
    });
  }

  public async showList({ request, view, auth, response }: HttpContextContract) {
    await auth.use('web').authenticate();

    const userData = await User.findBy('email', auth.user?.email);

    if (!userData) {
        await auth.logout();
        return response.redirect('/login');
    }

    // let data = await QrData.query().select('*');

    const page = request.input('page', 1)
    const limit = 100

    const posts = await Database.from('qr_codes').orderBy('qr_status', 'asc').paginate(page, limit)
          posts.baseUrl('/qrcode/listar')

    const name = userData.name;

    return view.render('qrcode/list',{
      user: userData,
      name,
      posts
    });
  }

  private async generateQrCode(q, modo, prefeitura){
    let pref, prefeituraId;
    if(modo === "prefeitura"){
      pref = prefeitura.split("-id-");
      prefeituraId = pref[1];
      prefeitura = pref[0];
    }

    let codes = Array();

    for(let i=0;i<parseInt(q);i++){
      let response = await this.generateId();
      let qr = await this.generateCode(url+response, modo, prefeitura);
      
      try{
        const data = await QrData.create({
          qr_id: response,
          qr_code: qr,
          qr_modelo: modo,
          qr_prefeitura: (modo === "prefeitura" ? prefeituraId : "NULL")});

        codes.push({
          id: response,
          qr_id: url+response,
          qr_code: qr
        });

      }catch(e){
        console.log(e);
      }
    }

    return codes;
  }

  public async generate({view, request, auth, response }) {
    
    const { modo, prefeitura } = request.all();
    
    let data = request.body();
    let total;

    if(!data.total) return;
      total = data.total;

    let result = await this.generateQrCode(total, modo, prefeitura);

    const userData = await User.findBy('email', auth.user?.email);
    if(!userData){
      return response.redirect('/dashboard');
    }
    const name = userData.name;

    return view.render('qrcode/result', {
      results: result,
      name,
      modo: data.modo,
      prefeitura: prefeitura
    });

      
  }

  public async reset({ view, auth, response, request }: HttpContextContract) {
    let data = request.body();
    
    if(data.id){
      const r = await QrData.findBy('qr_id', data.id);

      if(!r) return response.json([{status: "error", msg: "Não foi encontrado um código com o id informado"}]);
      
      r.qr_status = "0";
      r.qr_emergencia = "";
      // r.qr_meu_emergencia = "";

      await r.save();
      response.json([{status: "success", msg: "Código resetado com sucesso"}]);
    }else{
      response.json([{status: "error", msg: "O parâmetro id está vazio"}]);
    }

    
  }
}
