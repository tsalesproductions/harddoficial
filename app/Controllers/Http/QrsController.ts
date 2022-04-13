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

    let q = request.qs();
    
    let posts;
    if(q.search && q.search !== ''){
      posts = await Database.from('qr_codes').whereRaw(`qr_id LIKE '%${q.search}%'`).orderBy('qr_status', 'asc').paginate(page, limit)
    }else{
      posts = await Database.from('qr_codes').orderBy('qr_status', 'asc').paginate(page, limit)
    }
    
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
    if(modo === "prefeitura" || modo === "bottom"){
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
          qr_prefeitura: (modo === "prefeitura" || modo === "bottom" ? prefeituraId : "NULL"),
          qr_cliente_social: JSON.stringify([{"name":"facebook","value":""},{"name":"twitter","value":""},{"name":"instagram","value":""},{"name":"linkedin","value":""},{"name":"whatsapp","value":""}])});

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
      	
      r.qr_imagem = ''
      r.qr_cliente_nome = ''
      r.qr_cliente_nascimento = ''
      r.qr_cliente_endereco_rua = ''
      r.qr_cliente_endereco_numero = ''
      r.qr_cliente_endereco_cidade = ''
      r.qr_cliente_tipo_sanguineo = ''
      r.qr_cliente_alergia = ''
      r.qr_cliente_peso = ''
      r.qr_cliente_uso_medicamento = ''
      r.qr_cliente_email = ''
      r.qr_cliente_escola_nome = ''
      r.qr_cliente_escola_serie = ''
      r.qr_emergencia = ''
      r.qr_cliente_doenca = ''
      r.qr_cliente_anexo = ''
      r.qr_cliente_obs = ''
      r.qr_cliente_sus_numero = ''
      r.qr_cliente_plano_nome = ''
      r.qr_cliente_plano_numero = ''
      r.qr_meus = ''
      r.qr_status = '0';
      r.qr_password = ''

      await r.save();
      response.json([{status: "success", msg: "Código resetado com sucesso"}]);
    }else{
      response.json([{status: "error", msg: "O parâmetro id está vazio"}]);
    }

    
  }
}
