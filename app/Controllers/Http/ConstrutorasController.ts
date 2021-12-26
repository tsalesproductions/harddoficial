import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Operarios from 'App/Models/Operarios';
const reader = require('xlsx')

export default class ConstrutorasController {
    public async showIndex({ request, view, auth, response }: HttpContextContract) {
      const page = request.input('page', 1)
      const limit = 100

      const posts = await Database.from('operarios').orderBy('ficha_matricula', 'asc').whereRaw("owner_id = "+auth.user?.id).paginate(page, limit)
            posts.baseUrl('/construtora')

      return view.render('construtora/lista_funcionarios', {
        posts
      });
    }

    public async upload({ request, response, auth }: HttpContextContract) {
      const uploadConfig = {
        check: async function(data){
          let result = await Operarios.findBy('ficha_matricula', data.Matricula);
          if(!result){
            await uploadConfig.add(data)
          }else{
            await uploadConfig.update(data)
          }
        },
        add: async function(data){
          try{
            await Database
              .insertQuery()
              .table('operarios')
              .insert({ 
                owner_id: auth.user?.id,
                ficha_matricula: data.Matricula,
                operario_nome: data.Nome,
                ficha_ccu: data['Cod CCU'], 
                ficha_descricao: data['Descrição'], 
                ficha_adm: data['Data Adm'], 
                ficha_categoria: data.Categoria, 
                ficha_codigo: data['Código'], 
                ficha_descricao2: data['Descrição_1'], 
                ficha_turno: data.Turno, 
                ficha_situacao: data['Situacao do Colaborador'],
              })
          }catch(e){
            console.log("Houve um erro ao adicionar:", e);
          }
        },
        update: async function(data){
          try{
            await Database.rawQuery(`UPDATE operarios SET ficha_ccu = '${data['Cod CCU']}', operario_nome = '${data.Nome}', ficha_descricao = "${data['Descrição']}", ficha_adm = '${data['Data Adm']}', ficha_categoria = '${data.Categoria}', ficha_codigo = '${data['Código']}', ficha_descricao2 = "${data['Descrição_1']}", ficha_turno = '${data.Turno}', ficha_situacao = '${data['Situacao do Colaborador']}' WHERE ficha_matricula = '${data.Matricula}' AND owner_id = ${auth.user?.id}`)
          }catch(e){
            console.log("Houve um erro ao atualizar:", e);
          }
        },
        processList : async function(arr){
          for(let item of arr){
            await uploadConfig.check(item);
          }

          return {status: true, msg: "Todos os registros foram processados com sucesso!"}
        }
      }
      const { files } = request.all();
      
      if(!files) return response.json({status: false, msg: "Nenhum arquivo foi enviado, ou houve algum erro, atualize a página e tente novamente."})

      let filess = JSON.parse(files);
      
      let status = await uploadConfig.processList(filess)

      return response.json(status)
    }

    public async deleteConstructor({ request, response, auth }: HttpContextContract) {
      const { id } = request.ctx?.params;
      if(!id) return response.redirect("/construtora/");

      let operario = await Operarios.findBy('id', id);
      if(!operario) return response.redirect("/construtora/");
      if(parseInt(operario.owner_id) !== auth.user?.id) return response.redirect("/construtora/");
      await operario.delete()
      response.redirect("/construtora/?deleted=true");
      
    }
}
