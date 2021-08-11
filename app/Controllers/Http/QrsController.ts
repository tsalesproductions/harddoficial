import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import QrData from 'App/Models/QrCode';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
const QRCode = require('qrcode');
const url = "https://www.hardd.com.br/myme?id=";

export default class QrsController {

  public async showIndex({ view, auth, response }: HttpContextContract) {
    await auth.use('web').authenticate();

    const userData = await User.findBy('email', auth.user?.email);

    if (!userData) {
        await auth.logout();
        return response.redirect('/login');
    }
    
    const name = userData.name;

    return view.render('qrcode/new',{
      user: userData,
      name
    });
  }

  public async showList({ view, auth, response }: HttpContextContract) {
    await auth.use('web').authenticate();

    const userData = await User.findBy('email', auth.user?.email);

    if (!userData) {
        await auth.logout();
        return response.redirect('/login');
    }

    let data = await QrData.query().select('*');

    const name = userData.name;

    return view.render('qrcode/list',{
      user: userData,
      name,
      results: data,
    });
  }

  private async searchInDatabase(term, field){
    return await QrData.findBy(term, field);
  }

  private async generateId(){
    let id = Math.floor(Math.random() * 9999999) + 1;
    let search = await this.searchInDatabase('qr_id', id);
    
    if(search){
     this.generateId();
    }else{
      return id;
    }
  }

  private async generateQrCode(q){
    async function generateCode(url){
      return await QRCode.toDataURL(url);
    }

    let codes = Array();

    for(let i=0;i<parseInt(q);i++){
      let response = await this.generateId();
      let qr = await generateCode(url+response);
      
      try{
        const data = await QrData.create({
          qr_id: response,
          qr_code: qr});

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
    let data = request.body();
    let total;

    if(!data.total) return;
      total = data.total;
    

    let result = await this.generateQrCode(total);

    const userData = await User.findBy('email', auth.user?.email);
    if(!userData){
      return response.redirect('/dashboard');;
    }
    const name = userData.name;

    return view.render('qrcode/result', {
      results: result,
      name
    });

      
  }

  public async reset({ view, auth, response, request }: HttpContextContract) {
    let data = request.body();
    
    if(data.id){
      const r = await QrData.findBy('qr_id', data.id);

      if(!r) return response.json([{status: "error", msg: "Não foi encontrado um código com o id informado"}]);
      
      r.qr_status = "0";
      r.qr_emergencia = "";
      r.qr_meu_emergencia = "";

      await r.save();
      response.json([{status: "success", msg: "Código resetado com sucesso"}]);
    }else{
      response.json([{status: "error", msg: "O parâmetro id está vazio"}]);
    }

    
  }
}
