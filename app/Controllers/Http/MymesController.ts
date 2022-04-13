import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QrData from 'App/Models/QrCode';
import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios';
import sharp from 'sharp'

var fs = require('fs')

const VCard = require('vcard-creator').default


export default class MymesController {
  public async mymeManager({view, request, response, params }: HttpContextContract) {
    let body = params;

    let data = await QrData.findBy('qr_id', body.id);

    return view.render('myme/index', {
      data: data, 
      qr_id: body.id,
      meu_emergencia: (data?.qr_emergencia ? JSON.parse(data?.qr_emergencia) : []),
      qr_cliente_social: (data?.qr_cliente_social ? JSON.parse(data?.qr_cliente_social) : []),
      meus: (data?.qr_meus ? JSON.parse(data?.qr_meus) : []),
    });
  }

  private async uploadFile(request, name){
    const file = request.file(name);
    const fileName = `myme_${Math.floor(Math.random() * 99999999) + 1}.${file.extname}`
    await file.move(Application.publicPath('uploads'), {
      name: fileName,
    });

    return `/uploads/${fileName}`;
  }

  public async mymeSend({view, request, response }: HttpContextContract) {
    const { 
      field_eu_nome,
      field_eu_nascimento,
      field_eu_email,
      field_eu_escola,
      field_eu_serie,
      field_eu_endereco,
      field_eu_numero,
      field_eu_cidade,

      field_eu_telefone,
      field_eu_pix,
      field_eu_soc_facebook,
      field_eu_soc_twitter,
      field_eu_soc_insta,
      field_eu_soc_linkedin,
      field_eu_soc_whatsappp,

      field_eu_doenca,
      field_eu_medicamento,
      field_eu_peso,
      field_eu_alergia,
      field_eu_sangue,
      field_sus_numero,
      field_plano_nome,
      field_plano_numero,
      field_meu_obs,
      field_eu_e_nome1,
      field_eu_e_contato1,
      field_eu_e_nome2,
      field_eu_e_contato2,
      qr_meus,
      qr_id,
      qr_password
    } = request.all();

    const qr_cliente_social = [
      {
        "name": "facebook",
        "value": field_eu_soc_facebook
      },
      {
        "name": "twitter",
        "value": field_eu_soc_twitter
      },
      {
        "name": "instagram",
        "value": field_eu_soc_insta
      },
      {
        "name": "linkedin",
        "value": field_eu_soc_linkedin
      },
      {
        "name": "whatsapp",
        "value": field_eu_soc_whatsappp
      }
    ]

    const {eu, meus} = JSON.parse(qr_meus);

    let data = await QrData.findBy('qr_id', qr_id);

    let emergencia = [
      {
        nome: field_eu_e_nome1,
        contato: field_eu_e_contato1,
      },
      {
        nome: field_eu_e_nome2,
        contato: field_eu_e_contato2,
      }
    ]

    let result = await Database.rawQuery(
      `UPDATE qr_codes SET
      qr_imagem = ?,
      qr_cliente_nome = ?,
      qr_cliente_nascimento = ?,
      qr_cliente_email = ?,
      qr_cliente_anexo = ?,
      qr_cliente_escola_nome = ?,
      qr_cliente_escola_serie = ?,
      qr_cliente_endereco_rua = ?,
      qr_cliente_endereco_numero = ?,
      qr_cliente_endereco_cidade = ?,

      qr_cliente_telefone = ?,
      qr_cliente_pix = ?,
      qr_cliente_social = ?,

      qr_cliente_doenca = ?,
      qr_cliente_uso_medicamento = ?,
      qr_cliente_peso = ?,
      qr_cliente_alergia = ?,
      qr_cliente_tipo_sanguineo = ?,
      qr_cliente_sus_numero = ?,
      qr_cliente_plano_nome = ?,
      qr_cliente_plano_numero = ?,
      qr_cliente_obs = ?,
      qr_emergencia = ?,
      qr_meus = ?,
      qr_status = ?,
      qr_password = ?
      WHERE qr_id = ?
    `, [
      eu.foto,
      field_eu_nome,
      field_eu_nascimento,
      field_eu_email,
      eu.anexo,
      field_eu_escola,
      field_eu_serie,
      field_eu_endereco,
      field_eu_numero,
      field_eu_cidade,

      field_eu_telefone,
      field_eu_pix,
      JSON.stringify(qr_cliente_social),

      field_eu_doenca,
      field_eu_medicamento,
      field_eu_peso,
      field_eu_alergia,
      field_eu_sangue,
      field_sus_numero,
      field_plano_nome,
      field_plano_numero,
      field_meu_obs,
      JSON.stringify(emergencia),
      JSON.stringify(meus),
      1,
      qr_password,
      qr_id
    ]);

    return response.redirect('/myme/'+qr_id);
  }

  private async validateWithoutPassword(response, userData){
    return response.redirect('/myme/'+userData.qr_id);
  }

  public async login({ request, response, session }: HttpContextContract) {
    const { serial, password, nopass } = request.all();
    
    const userData = await QrData.findBy('qr_id', serial);
    
    if (!userData) {
      session.flash('notification', 'OPS! Serial não encontrado');
      return response.redirect('back');
    }

    if(nopass) return this.validateWithoutPassword(response, userData);
    
    if (userData.qr_password !== password) {
      session.flash('notification', 'OPS! Serial e senha não conferem');
      return response.redirect('back');
    }

    let result = await Database.rawQuery(`UPDATE qr_codes SET qr_status = ? WHERE qr_id = ? AND qr_password = ?`, ['0', serial, password]);
    
    return response.redirect('/myme/'+userData.qr_id);
  }

  public async vcfManager({ request, response }: HttpContextContract){
    const { firstname, lastname, email, phone, addressA, addressB, facebook, twitter, instagram, linkedin, id, image } = request.all();

    // return response.json([]);
    let host = request.request.headers.origin;
    
    const imageResponse = await axios({"method": "get", "url": "https://files.hardd.com.br/uploads/myme_8028711001.webp", "responseType": "stream"})
    await imageResponse.data.pipe(sharp().jpeg({"quality": 100}).
        toFile("./public/exports/"+id+".jpeg", (err, info) => {
          var myVCard = new VCard()
              myVCard
              .addName(lastname, firstname, '', '', '')
              .addEmail(email)
              .addPhoneNumber(phone, 'WORK')
              .addAddress('', '', addressA, addressB, '', '', '')
              
            if(facebook){
                myVCard.addURL(facebook, 'TYPE=Facebook')
            }
            
            if(twitter){
                myVCard.addURL(twitter, 'TYPE=Twitter')
            }
            
            if(instagram){
                myVCard.addURL(instagram, 'TYPE=Instagram')
            }
            
            if(linkedin){
                myVCard.addURL(linkedin, 'TYPE=Linkedin')
            }

            myVCard.addPhoto(`${host}/exports/${id}.jpeg`, 'JPEG')

          fs.writeFile('./public/exports/'+id+'.vcf', myVCard.toString(), function (err) {
            if (err) throw err;
            // response.json({data: `https://${host}/exports/${id}.vcf`})
          });

      }))

      response.json({data: `${host}/exports/${id}.vcf`})
  }
}

