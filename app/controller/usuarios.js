// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var UsuariosModel = require('../model/usuariosModel.js');
var model = new UsuariosModel;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));

/* GET pagina de login. */
router.get('/', function(req, res, next) {
	model.SelecionarUsuarios().then(data => {
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'usuarios/index', data: data, usuario: req.session.usuario});
	});
});
router.get('/criar', function(req, res, next) {
	model.SelecionarSetores().then(data_setores => {
		data['setores'] = data_setores;
		console.log(data);
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'usuarios/usuarios_criar', data: data, usuario: req.session.usuario});
	});
});
router.get('/editar/:id', function(req, res, next) {
	model.SelecionarSetores().then(data_setores => {
		data['setores'] = data_setores;
		model.SelecionarUsuario(req.params.id).then(data_usuario => {
			data['usuario'] = data_usuario;
			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'usuarios/usuarios_editar', data: data, usuario: req.session.usuario});
		});
	});
});
router.get('/editar/perfil/:id', function(req, res, next) {
	model.SelecionarUsuario(req.params.id).then(data_usuario => {
		data['usuario'] = data_usuario;
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'usuarios/usuarios_perfil_editar', data: data, usuario: req.session.usuario});
	});
});

// POSTS
router.post('/cadastrar', function(req, res, next) {
		// Recebendo o valor do post
		POST = req.body;
		POST.senha = control.Encrypt('optima');
		model.CadastrarUsuario(POST).then(data => {
			control.SendMail(POST.email,'Você foi registrado com sucesso em Nodejs-fw',
				'Bem vindo ao sistema Nodejs-fw. Seu Login é: '+POST.login+' e sua senha é:'+POST.senha+'Acesse via o link http://www.nodejs-fw.com.br/',
				'Bem vindo ao sistema Nodejs-fw.'+
				'<br><b>Login</b>:'+POST.login+
				'<br><b>Senha</b>:'+POST.senha+
				'<br>Acesse via o link <a href="http://www.nodejs-fw.com.br" target="_blank">http://www.nodejs-fw.com.br</a>');
			res.json(data);
		});
	});

router.post('/atualizar', function(req, res, next) {
		// Recebendo o valor do post
		POST = req.body;
		model.AtualizarUsuario(POST).then(data => {
			res.json(data);
		});
	});

router.post('/desativar', function(req, res, next) {
		// Recebendo o valor do post
		POST = req.body;
		model.DesativarUsuario(POST).then(data=> {
			res.json(data);
		});
	});

router.post('/ver/perfil/', function(req, res, next) {
		// Recebendo o valor do post
		POST = req.body;
		model.LoadPerfil(POST.id).then(data => {
			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'usuarios/usuarios_perfil_header', data: data});
		});
	});

router.post('/uploadarquivo', function(req, res, next) {
	var sampleFile = req.files.arquivo;
	var nome = control.DateTimeForFile()+'_'+sampleFile.name;
	var id = req.session.id_usuario;

	model.CadastraArquivo(id, nome).then(data => {
		  // Use the mv() method to place the file somewhere on your server
		  sampleFile.mv('./assets/uploads/'+nome, function(err) {
		  	if (err) {
		  		return res.status(500).send(err);
		  	}

		  	res.json(nome);
		  });
		});
});

module.exports = router;
