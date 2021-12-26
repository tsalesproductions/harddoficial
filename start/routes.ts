import Env from '@ioc:Adonis/Core/Env';
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

//liga dc

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view, response }) => {
  // return view.render('welcome')
  return response.redirect('/dashboard');
})

Route.get('/login', 'AuthController.showLogin')
Route.post('/login', 'AuthController.login')

Route.get('/register', 'AuthController.showRegister')
Route.post('/register', 'AuthController.register')

Route.group(() => {
  Route.get('/dashboard', 'DashboardController.showIndex');
  // Route.get('/dashboard/categories', 'DashboardController.showCategories');
}).middleware(['auth']);

Route.group(() => {
  Route.get('/qrcode/criar', 'QrsController.showIndex');
  Route.post('/qrcode/criar', 'QrsController.generate');
  Route.get('/qrcode/listar', 'QrsController.showList');
  Route.post('/qrcode/resetar', 'QrsController.reset');
}).middleware(['auth']);

Route.group(() => {
  Route.get('/prefeituras', 'PrefeiturasController.index');
  Route.get('/prefeituras/criar', 'PrefeiturasController.createView');
  Route.post('/prefeituras/criar', 'PrefeiturasController.create');
  Route.get('/prefeitura/editar/:id', 'PrefeiturasController.edit');
  Route.post('/prefeitura/editar', 'PrefeiturasController.editList');
  Route.get('/prefeitura/:id', 'PrefeiturasController.list');


  Route.get('/construtora/', 'ConstrutorasController.showIndex');
  Route.post('/construtora/upload', 'ConstrutorasController.upload');
  Route.get('/construtora/deletar-operario/:id', 'ConstrutorasController.deleteConstructor');
}).middleware(['auth']);

Route.group(() => {
  Route.get('/ecommerce/get/:id', 'ApisController.getList')
  Route.post('/ecommerce/set/:id', 'ApisController.setList')

});


Route.get('/myme', 'QrsController.identify');
Route.get('/myme/auth', 'MymesController.login');
Route.get('/myme/:id', 'MymesController.mymeManager')
Route.post('/myme', 'MymesController.mymeSend')


Route.get('/logout', 'AuthController.logout')

