// dá require no model do controller para poder fazer possíveis ações com o model aqui no controller.
var mongoose = require('mongoose');
var User = require('../models/user').User;

//utiliza module.exports na função controller, que recebe, como parâmetro, o aplicativo.

module.exports.controller = function(app){
	
	app.get('/', function(req, res){
		User.findAll(function(err, users){
			if(err){
				res.send('500. Error =P');
			}else{
				res.render('users/index', {
					title: 'Users',
					allUsers: users,
					session_name: req.session.user_name,
					session: req.session.user_id
				});
			}
		});
	});
	
	app.get('/signup', function(req, res){
		//chama o template de form de criação de usuário
		res.render('users/signup', {
			title: "Sign up",
			session: req.session.user_id
		});
	});
	
	app.post('/signup', function(req, res){
		User.saveUser(req.param('name'),
		req.param('password'),
		function(err, docs){
			res.redirect('/');
		});
	});
	
	app.get('/login', function(req, res){
		res.render('users/login', {
			title: "Log in"
		});
	});
	
	app.post('/login', function(req, res){
		//lógica pra validar usuário. Se existirem os dados que o usuário escreveu no banco de dados, setamos um id para a session do usuário. req.session.user_id=User.find(dados que o usuário colocou).id
		User.auth_login(req.param('name'), req.param('password'), function(err, user){
			if(err){
				//Chamar página de usuário ou senha estão inválidos
				res.send('Usuário ou senha estão errados');
			}else{
				req.session.user_id = user.id;//inicia a sessão com o valor da id do usuário.
				req.session.user_name = user.name;
				res.redirect('/dashboard');
			}
		});
	});
	
	app.get('/logout', function(req, res){
		req.session.destroy();
		res.redirect('/');
	});
	
	app.get('/dashboard', function(req, res){
		//autentica a sessão do usuário, para ver se ele tem uma sessão iniciada
		if(User.check_online_user(req, res)){
			res.render('users/dashboard', {
				session: req.session.user_id
			});
		}else{
			res.render('users/not_authorized');
		}
	});
}