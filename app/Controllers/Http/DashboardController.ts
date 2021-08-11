import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';
import QrData from 'App/Models/QrCode';
import Database from '@ioc:Adonis/Lucid/Database';

export default class DashboardController {
  private async searchInDatabase(query, data){
    // return await QrData.findBy(query, field);
    return await Database.rawQuery(query, data);
  }

  private async relatory(){
    let total_geral = await this.searchInDatabase('SELECT COUNT(id) AS total_geral  FROM qr_codes', []);
    let total_disponivel = await this.searchInDatabase('SELECT COUNT(id) AS total_geral FROM qr_codes WHERE qr_status = ?', [0]);
    let total_indisponivel = await this.searchInDatabase('SELECT COUNT(id) AS total_geral FROM qr_codes WHERE qr_status = ?', [1]);

    return {
      total_geral: total_geral[0][0].total_geral,
      total_disponivel: total_disponivel[0][0].total_geral,
      total_indisponivel: total_indisponivel[0][0].total_geral,
      ganho_estimado: "Breve"
    }
  }

  public async showIndex({ view, auth, response }: HttpContextContract) {
    await auth.use('web').authenticate();

    const userData = await User.findBy('email', auth.user?.email);

    if (!userData) {
        await auth.logout();
        return response.redirect('/login');
    }
    
    const name = userData.name;

    return view.render('dashboard/home', {
      user: userData,
      name,
      relatory:  await this.relatory()
    });
  }
}
