var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	name: String,
	password: String
});


User = mongoose.model('user', userSchema); //cria um model/collection

//--Declaração de métodos do model

//autenticação de login do usuário. Não está funcionando corretamente ainda.
User.auth_login = function(name, password, callback){
	
	//por enquanto, o usuário faz login se acharmos o nome dele no banco de dados
	var usr = User.findUserByName(name, function(err, usr_obj){
		if(err){
			callback(err);
		}else{
			//se achar o usuário pelo nome, confere se a senha de input é igual à senha que consta no banco de dados.
			if(usr_obj.password == password){
				callback(null, usr_obj);
			}else{
				err = 1;
				callback(err);
			}
		}
	});
}

//acha um usuário específico no banco de dados buscando pelo nome
User.findUserByName = function(name, callback){
	User.findOne({name: name}, function(err, usr_obj) { 
		if(err){
			callback(err);
		}else{
			if(usr_obj==null){
				err = 1;
				callback(err);
			}else{
				callback(null, usr_obj);
			}
		}
	});
}

//acha um usuário específico no banco de dados buscando pela senha
User.findUserByPassword = function(password, callback){
	User.findOne({password: password}, function(err, usr_obj) { 
		if(err){
			callback(err);
		}else{
			if(usr_obj==null){
				err = 1;
				callback(err);
			}else{
				callback(null, usr_obj);
			}
		}
	});
}

//acha todos os usuários
User.findAll = function (callback){
	User.find({}, function(err, users){
		if(!err){
			//tomar cuidado para quantos parâmetros vou enviar para a função de callback. No caso, a função de callback estava recebendo apenas um parâmetro, então, esse parâmetro recebia o valor do primeiro parâmetro que eu estou mandando aqui: null
			callback(null, users);
		}else{
			callback(err);
		}
	});
}

//salva usuário
User.saveUser = function(name, password, callback){
	//chama o método .save da instância de User criada agora, e passa a função de callback para o método.
	new User({name:name, password: password}).save(callback);
}

//autentica se o usuário está logado para acessar páginas privadas/secretas
User.check_online_user = function (req, res){
	//!null = true. Se req.session.user_id == null
	if (!req.session.user_id) {
	    return false;
	} else {
		return true;
	}
}

module.exports.User = User;