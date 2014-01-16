
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
var fs = require('fs');

var connect = require('connect');
var RedisStore = require('connect-redis')(express);

var mongoose = require('mongoose');

//inicia uma requisição de conexão do servidor
mongoose.connect('mongodb://localhost/Users');

//pega o status da conexão requisitada por mongoose.connect
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (){
	console.log('Deu tudo certo.');
});

//Setup para usar sessions do express. É importante chamar o cookieParser antes do session. Quando coloquei esse código embaixo dos outros códigos, deu erro.
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//nesse modelo de MVC, as rotas são "ações" dos nossos controllers. Assim que uma rota chega para o app como request, nós enviamos o app para o controller e tratamos a rota em questão.

fs.readdirSync('./controllers').forEach(function(file){
	//Parece um método lento: a cada request, lê todos os arquivos da pasta "./controllers" 
	if(file.substr(-3) == ".js"){
		route = require('./controllers/'+file);
		route.controller(app);
	}
});

//app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
