// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var AdministracaoModel = require('../model/administracaoModel.js');
var model = new AdministracaoModel;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));


router.get('/', function(req, res, next) {
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/administracao', data: data, usuario: req.session.usuario});
});



router.get('/usuarios', function(req, res, next) {
	model.GetUsuariosMenosProprio(req.session.usuario.id).then(data_usuarios=>{
		data.usuarios_admin = data_usuarios;
		data.link_sistema = '/sistema';
		console.log('===================== ADMINISTRACAO USUARIO ===-================');
		console.log(data);
		console.log('=======================================================');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/usuarios/usuarios', data: data, usuario: req.session.usuario});
	});
});

router.get('/permissoes_niveis', function(req, res, next) {
	model.GetPermissoes().then(data_permissoes=>{
		data.permissoes_admin = data_permissoes;
		data.link_sistema = '/sistema';
		console.log('===================== ADMINISTRACAO USUARIO ===-================');
		console.log(data);
		console.log('=======================================================');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/permissoes/permissoes', data: data, usuario: req.session.usuario});
	});
});



router.get('/usuarios/criar', function(req, res, next) {
	data.link_sistema = '/sistema';
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/usuarios/cadastrar_usuario', data: data, usuario: req.session.usuario});
});

router.get('/permissao/criar', function(req, res, next) {
	data.link_sistema = '/sistema';
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/permissoes/cadastrar_permissao', data: data, usuario: req.session.usuario});
});

router.get('/usuarios/editar/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('Selecionei o usuario no editar');
	console.log(id);
	console.log('_________________________________');

	model.SelecionarUsuario(id).then(data_usuario_sel => {
		data.usuario_admin = data_usuario_sel;
		data.link_sistema = '/sistema';
		console.log(data);
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/usuarios/editar_usuario', data: data, usuario: req.session.usuario});
	});
});


router.get('/permissao/editar/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('Selecionei a permissão do nivel');
	console.log(id);
	console.log('_________________________________');

	model.SelecionarPermissao(id).then(data_permissoes_sel => {
		data.permissao_admin = data_permissoes_sel;
		data.link_sistema = '/sistema';
		console.log(data);
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/permissoes/editar_permissao', data: data, usuario: req.session.usuario});
	});
});

router.get('/alterar-senha-usuario/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('selecionei alterar a senha do usuario');
	console.log(id);
	console.log('_________________________________');
	model.SelecionarUsuario(id).then(data_usuario_admin => {
		data.usuarios_admin = data_usuario_admin;
		data.link_sistema = '/sistema';
		console.log('***************** ADMINISTRAÇÃO ALTERAR SENHA USUARIO ***************');
		console.log(data);
		console.log('*********************************************************************');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/usuarios/alterar_senha_usuario', data: data, usuario: req.session.usuario});
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

router.post('/usuarios/cadastrar/', function(req, res, next) {
	POST = req.body;
	var senha = Math.random().toString(36).substr(2, 8);
	POST.senha = senha;

	console.log('PPPPPPPPPPOOOOOOOOOOOST USUARIOS POOOOOOSSSSSSSSSTTTTTTTTTTTTTTTT');
	console.log(POST);
	console.log('PPPPPPPPPPPPPPPPOOOOOOOOOOOSSSSSSSSSSSSSSSSSSSSSSTTTTTTTTTTTTTTTT');

	console.log('eeeeeeeeeeee mail eeeeeeeeeeeeeee');
	console.log(POST.email);
	console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

	model.VerificarSeTemEmailDisponivel(POST.email).then(tem_email => {
		console.log('ttttttttttt tem login ttttt');
		console.log(tem_email);
		console.log('ttttttttttttttttttttttttttt');

		if(tem_email == ''){
			model.CadastrarUsuario(POST).then(data => {
				console.log('cai aqui no cadastrar usuario');

				var html = "Olá, você foi cadastrado no Hadassah Consulting! Segue abaixo as informações sobre sua conta."+
				"<br>O E-mail é este e a senha é:<br>"+senha+
				"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
				"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

				var text = "Olá, você foi cadastrado no Hadassah Consulting! Segue abaixo as informações sobre sua conta."+
				"<br>O E-mail é este e a senha é:<br>"+senha+
				"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
				"<br>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";



				// var html = "Bem vindo ao Hadassah Consulting! Segue abaixo as informações sobre sua conta."+
				// "<br>Para fazer o Login, utilize este e-mail e esta senha:"+
				// "<br>"+senha+
				// "<br>Acesse via o site : http://hadassahconsulting-com.umbler.net/"+
				// "<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
				// "<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

				// var text = "Bem vindo ao Hadassah Consulting! Segue abaixo as informações sobre sua conta."+
				// "<br>Para fazer o Login, utilize este e-mail e esta senha:"+
				// "<br>"+senha+
				// "<br>Acesse via o site : http://hadassahconsulting-com.umbler.net/"+
				// "<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
				// "<br>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";


				console.log('lllllllllllllllllll html lllllllllllllllllllllll');
				console.log(html);
				console.log('llllllllllllllllllllllllllllllllllllllllllllllll')

				console.log('@@@@@@@@@@@@@@@@ text !@@@@@@@@@@@');
				console.log(text);
				console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

				control.SendMail(POST.email, 'Bem-vindo ao Hadassah Consulting!', text,html);
				

				res.json(data);
			});


		}else{
			console.log('JJJJJJJJJJJJJJJJJJJ já existe login JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');
			res.json({error:'possui_email',element:'input[name="email"]',texto:'Email já cadastrado, por-favor tente outro!'});
		}
	});
});


router.post('/permissao/cadastrar/', function(req, res, next) {
	POST = req.body;

	console.log('PPPPPPPPPPOOOOOOOOOOOST Permissao POOOOOOSSSSSSSSSTTTTTTTTTTTTTTTT');
	console.log(POST);
	console.log('PPPPPPPPPPPPPPPPOOOOOOOOOOOSSSSSSSSSSSSSSSSSSSSSSTTTTTTTTTTTTTTTT');

	if(POST.show_segmento == undefined){
		POST.show_segmento = 1;
	}

	if(POST.show_regiao == undefined){
		POST.show_regiao = 1;
	}

	if(POST.show_faturamento == undefined){
		POST.show_faturamento = 1;
	}

	if(POST.show_ebitida == undefined){
		POST.show_ebitida = 1;
	}

	if(POST.show_valor_venda == undefined){
		POST.show_valor_venda = 1;
	}

	if(POST.show_consult == undefined){
		POST.show_consult = 1;
	}

	if(POST.show_com == undefined){
		POST.show_com = 1;
	}

	if(POST.show_observacoes == undefined){
		POST.show_observacoes = 1;
	}





	model.CadastrarPermissao(POST).then(data => {
		res.json(data);
	});
});


router.post('/usuarios/alterar-senha/', function(req, res, next) {
	POST = req.body;
	var senha = Math.random().toString(36).substr(2, 8);
	console.log('ssssssssssssssssssss senha sssssssssssssssssssssss');
	console.log(senha);
	console.log('ssssssssssssssssssssssssssssssssssssssssssssssssss');
	POST.senha = senha;

	console.log('USUARIOS ALTERAR-SENHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
	console.log(POST);
	console.log('USUARIOS ALTERAR-SENHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

	model.SelecionarUsuario(POST.id).then(data_usuario => {
		model.AlterarSenhaUsuario(POST).then(senha_alteradao =>{
			var html = "Olá sua senha foi alterada pelo administrador do Sistema Hadassah Consulting. Segue abaixo as informações sobre sua conta."+
			"<br>O E-mail segue sendo este e a nova senha é:"+
			"<br>"+senha+ 
			"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
			"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

			var text = "Olá sua senha foi alterada pelo administrador do Sistema Hadassah Consulting. Segue abaixo as informações sobre sua conta."+
			"<br>O E-mail segue sendo este e a nova senha é:"+
			"<br>Senha: "+senha+
			"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
			"<br>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";
			control.SendMail(data_usuario[0].email, 'Alterado Senha no Hadassah Consulting!', text,html);
			res.json(data);
		});
	});
});

router.post('/usuarios/atualizar/', function(req, res, next) {
	POST = req.body;
	console.log('AAAAAAAAA ATUALIZAR USUARIO AAAAAAAAAAAAAA');
	console.log(POST);
	console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');


	var html = "Olá seu email foi alterado pela administração no Hadassah Consulting. Os dados continuam os mesmos."+
	"<br><br>Caso você não saiba sua senha por favor contate o suporte."
	"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
	"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

	var text = "Olá seu email foi alterado pela administração no Hadassah Consulting. Os dados continuam os mesmos."+
	"<br><br>Caso você não saiba sua senha por favor contate o suporte."
	"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
	"<br>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";

	/*verificar se o email é o mesmo, se não for enviar um e-mail para o novo informando as alterações*/
	model.VerificarSeTemMesmoEmail(POST).then(tem_mesmo_email => {
		console.log('eeeeeeeeeeeeee tem mesmo email eeeeeeeeeeeeeeeeeeeeeeee');
		console.log(tem_mesmo_email);
		console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
		if(tem_mesmo_email != ''){
			model.AtualizarUsuario(POST).then(data => {
				res.json(data);
			});
		}else{
			/*Se o e-mail foi alterado verificar se ele está disponivel(único)*/
			model.VerificarSeTemEmailDisponivel(POST.email).then(tem_email => {
				if(tem_email == ''){
					model.AtualizarUsuario(POST).then(data => {
						control.SendMail(POST.email, 'E-mail alterado no Hadassah!', text,html);
						res.json(data);
					});
				}else{
					res.json({error:'possui_email',element:'input[name="email"]',texto:'Email já cadastrado, por favor inserir outro!'});
				}
			});
		}
	});

});

router.post('/permissao/atualizar/', function(req, res, next) {
	POST = req.body;

	console.log('PPPPPPPPPPOOOOOOOOOOOST Permissao POOOOOOSSSSSSSSSTTTTTTTTTTTTTTTT');
	console.log(POST);
	console.log('PPPPPPPPPPPPPPPPOOOOOOOOOOOSSSSSSSSSSSSSSSSSSSSSSTTTTTTTTTTTTTTTT');

	if(POST.show_segmento == undefined){
		POST.show_segmento = 1;
	}

	if(POST.show_regiao == undefined){
		POST.show_regiao = 1;
	}

	if(POST.show_faturamento == undefined){
		POST.show_faturamento = 1;
	}

	if(POST.show_ebitida == undefined){
		POST.show_ebitida = 1;
	}

	if(POST.show_valor_venda == undefined){
		POST.show_valor_venda = 1;
	}

	if(POST.show_consult == undefined){
		POST.show_consult = 1;
	}

	if(POST.show_com == undefined){
		POST.show_com = 1;
	}

	if(POST.show_observacoes == undefined){
		POST.show_observacoes = 1;
	}

	model.AtualizarPermissao(POST).then(data => {
		res.json(data);
	});
});


router.post('/usuarios/desativar', function(req, res, next) {	
	POST = req.body;
	model.DesativarUsuario(POST).then(data=> {
		res.json(data);
	});
});

router.post('/permissao/desativar', function(req, res, next) {	
	POST = req.body;
	model.DesativarPermissao(POST).then(data=> {
		res.json(data);
	});
});



module.exports = router;
