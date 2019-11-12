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

/* Ínicio Simples GET Administração */

router.get('/', function(req, res, next) {
	model.GetPrimeiroAporte(req.session.usuario.id).then(data_primeiro_aporte=>{
		data.primeiro_aporte = data_primeiro_aporte;
		model.GetValorSaldoAtualizado(req.session.usuario.id).then(data_saldo_atualizado =>{
			data.saldo_atualizado = data_saldo_atualizado;
			model.GetPlanoUsuario(req.session.usuario.id).then(data_plano=>{
				data.plano = data_plano;
				model.GetMesesDecorridosUsuario(req.session.usuario.id).then(data_meses_decorridos=>{
					data.meses_decorridos = data_meses_decorridos;
					model.GetCaixaMesesUsuario(req.session.usuario.id).then(data_meses_caixa=>{
						data.meses_com_caixa = data_meses_caixa;
						model.GetMesAtualAtivo().then(data_mes_atual_ativo=>{
							data.mes_atual_ativo = data_mes_atual_ativo;
							data.numero_menu = 4;
							console.log('kokokokokokoko usuario requisição kokokokokokokokoko')
							console.log(data);
							console.log('kokokokokokokokokokokokokokokokokokokokokokokokokoko');
							res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/upload-csv/upload-csv', data: data, usuario: req.session.usuario});
						});
					});
				});
			});
		});
	});
});


router.get('/usuarios', function(req, res, next) {
	model.GetPrimeiroAporte(req.session.usuario.id).then(data_primeiro_aporte=>{
		data.primeiro_aporte = data_primeiro_aporte;
		model.GetValorSaldoAtualizado(req.session.usuario.id).then(data_saldo_atualizado =>{
			data.saldo_atualizado = data_saldo_atualizado;
			model.GetPlanoUsuario(req.session.usuario.id).then(data_plano=>{
				data.plano = data_plano;
				model.GetUsuariosMenosProprio(req.session.usuario.id).then(data_usuarios=>{
					data.usuarios_admin = data_usuarios;
					data.link_sistema = '/sistema';
					console.log('===================== ADMINISTRACAO USUARIO ===-================');
					console.log(data);
					console.log('=======================================================');
					res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/usuarios/usuarios', data: data, usuario: req.session.usuario});
				});
			});
		});
	});
});


router.get('/pedidos-saques', function(req, res, next) {
	model.GetPedidosSaques().then(data_pedido_saque=>{
		data.pedido_saque = data_pedido_saque;
		data.link_sistema = '/sistema';
		console.log('ADQADQADQADQADQADQADQADQADQADQ ADMINISTRAÇÃO PEDIDO SAQUE ADQADQADQADQADQ');
		console.log(data.pedido_saque);
		console.log('ADQADQADQADQADQADQADQADQADQADQADQADQADQADQADQADQADQADQADQADQADQADQADQADQA');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/pedidos-saques/pedidos_saques', data: data, usuario: req.session.usuario});
	});
});

router.get('/pedidos-aportes', function(req, res, next) {
	model.GetPedidosAportes().then(data_pedido_aporte=>{
		data.pedido_aporte = data_pedido_aporte;
		data.link_sistema = '/sistema';
		console.log('ADTADTADTADT ADMINISTRAÇÃO PEDIDO APORTE ADTADTADTADTADTADTADTADT');
		console.log(data);
		console.log('ADTADTADTADTADTADTADTADTADTADTADTADTADTADTADTADTADTADTADTADTADTAD');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/pedidos-aportes/pedidos_aportes', data: data, usuario: req.session.usuario});
	});
});

router.get('/caixa', function(req, res, next) {
	model.GetCaixa().then(data_caixa=>{
		data.caixa = data_caixa;
		data.link_sistema = '/sistema';
		console.log('CAIXACAIXACAIXACAIXACAIXA ADMINISTRAÇÃO CAIXA CAIXACAIXACAIXA');
		console.log(data.caixa);
		console.log('CAIXACAIXACAIXACAIXACAIXACAIXACAIXACAIXACAIXACAIXACAIXACAIXA');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/caixa/caixa', data: data, usuario: req.session.usuario});
	});
});


router.get('/planos', function(req, res, next) {
	model.GetPlanos().then(data_planos=>{
		data.planos = data_planos;		
		data.link_sistema = '/sistema';
		console.log('===================== ADMINISTRACAO USUARIO ===-================');
		console.log(data);
		console.log('=======================================================');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/planos/planos', data: data, usuario: req.session.usuario});
	});
});


router.get('/planos_usuarios', function(req, res, next) {
	var dolar = req.app.get('dolar');
	model.GetValoresPlanosUsuarios(dolar).then(data_planos_usuarios=>{
		data.planos = data_planos_usuarios;		
		data.link_sistema = '/sistema';
		console.log('­‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗ Planos Usuarios ‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗');
		console.log(data);
		console.log('‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗‗');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/planos-usuarios/planos_usuarios', data: data, usuario: req.session.usuario});
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

router.get('/lista-conectores', function(req, res, next) {

	model.GetConectores().then(data_conectores=>{
		data.conector = data_conectores;
		data.link_sistema = '/sistema';
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/listas/lista-conectores', data: data, usuario: req.session.usuario});
	});
});

router.get('/upload-csv', function(req, res, next) {
	model.GetPrimeiroAporte(req.session.usuario.id).then(data_primeiro_aporte=>{
		data.primeiro_aporte = data_primeiro_aporte;
		model.GetValorSaldoAtualizado(req.session.usuario.id).then(data_saldo_atualizado =>{
			data.saldo_atualizado = data_saldo_atualizado;
			model.GetPlanoUsuario(req.session.usuario.id).then(data_plano=>{
				data.plano = data_plano;
				model.GetMesesDecorridosUsuario(req.session.usuario.id).then(data_meses_decorridos=>{
					data.meses_decorridos = data_meses_decorridos;
					model.GetCaixaMesesUsuario(req.session.usuario.id).then(data_meses_caixa=>{
						data.meses_com_caixa = data_meses_caixa;
						model.GetMesAtualAtivo().then(data_mes_atual_ativo=>{
							data.mes_atual_ativo = data_mes_atual_ativo;
							console.log('kokokokokokoko usuario requisição kokokokokokokokoko')
							console.log(data);
							console.log('kokokokokokokokokokokokokokokokokokokokokokokokokoko');
							res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/upload-csv/upload-csv', data: data, usuario: req.session.usuario});
						});
					});
				});
			});
		});
	});
});

/* Fim Simples GET Administração */


/* Ínicio Criar GET Administração */


// router.get('/usuarios', function(req, res, next) {
// 	model.GetPrimeiroAporte(req.session.usuario.id).then(data_primeiro_aporte=>{
// 		data.primeiro_aporte = data_primeiro_aporte;
// 		model.GetValorSaldoAtualizado(req.session.usuario.id).then(data_saldo_atualizado =>{
// 			data.saldo_atualizado = data_saldo_atualizado;
// 			model.GetPlanoUsuario(req.session.usuario.id).then(data_plano=>{
// 				data.plano = data_plano;
// 				model.GetMesAtualAtivo().then(data_mes_atual_ativo=>{
// 					data.mes_atual_ativo = data_mes_atual_ativo;
// 					model.GetUsuariosMenosProprio(req.session.usuario.id).then(data_usuarios=>{
// 						data.usuarios_admin = data_usuarios;
// 						data.link_sistema = '/sistema';
// 						console.log('===================== ADMINISTRACAO USUARIO ===-================');
// 						console.log(data);
// 						console.log('=======================================================');
// 						res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/usuarios/usuarios', data: data, usuario: req.session.usuario});
// 					});
// 				});
// 			});
// 		});
// 	});
// });




router.get('/usuarios/criar', function(req, res, next) {

	model.GetPrimeiroAporte(req.session.usuario.id).then(data_primeiro_aporte=>{
		data.primeiro_aporte = data_primeiro_aporte;
		model.GetValorSaldoAtualizado(req.session.usuario.id).then(data_saldo_atualizado =>{
			data.saldo_atualizado = data_saldo_atualizado;
			model.GetPlanoUsuario(req.session.usuario.id).then(data_plano=>{
				data.plano = data_plano;
				model.GetConectores().then(data_conectores=>{
					data.conector = data_conectores;
					data.link_sistema = '/sistema';
					res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/usuarios/cadastrar_usuario', data: data, usuario: req.session.usuario});
				});
			});
		});
	});
});

router.get('/caixa/criar', function(req, res, next) {
	model.GetUsuarios().then(data_usuario=>{
		data.usuario = data_usuario;
		model.GetPlanos().then(data_plano=>{
			data.plano = data_plano;
			data.link_sistema = '/sistema';
			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/caixa/cadastrar_caixa', data: data, usuario: req.session.usuario});
		});
	});
});


router.get('/caixa/criar-aporte', function(req, res, next) {
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/caixa/cadastrar_caixa_aporte', data: data, usuario: req.session.usuario});
});

router.get('/caixa/criar-saque', function(req, res, next) {
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/caixa/cadastrar_caixa_saque', data: data, usuario: req.session.usuario});
});

router.get('/caixa/criar-rendimento', function(req, res, next) {
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/caixa/cadastrar_caixa_rendimento', data: data, usuario: req.session.usuario});
});

router.get('/plano/criar', function(req, res, next) {
	data.link_sistema = '/sistema';
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/planos/cadastrar_plano', data: data, usuario: req.session.usuario});
});


/* Fim Criar GET Administração */


/* Ínicio Editar GET Administração */

router.get('/usuarios/editar/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('Selecionei o usuario no editar');
	console.log(id);
	console.log('_________________________________');

	model.GetPrimeiroAporte(req.session.usuario.id).then(data_primeiro_aporte=>{
		data.primeiro_aporte = data_primeiro_aporte;
		model.GetValorSaldoAtualizado(req.session.usuario.id).then(data_saldo_atualizado =>{
			data.saldo_atualizado = data_saldo_atualizado;
			model.GetPlanoUsuario(req.session.usuario.id).then(data_plano=>{
				data.plano = data_plano;
				model.GetConectores().then(data_conectores=>{
					data.conector = data_conectores;
					model.SelecionarUsuario(id).then(data_usuario_sel => {
						data.usuario_admin = data_usuario_sel;
						data.link_sistema = '/sistema';
						console.log(data);
						res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/usuarios/editar_usuario', data: data, usuario: req.session.usuario});
					});
				});
			});
		});
	});
});


router.get('/pedido-saque/editar/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('selecionei o pedido-saque no editar');
	console.log(id);
	console.log('_________________________________');
	model.SelecionarPedidoSaque(id).then(data_pedido_saque => {
		data.pedido_saque = data_pedido_saque;
		data.link_sistema = '/sistema';
		console.log('QQQQQQQQQQQQQQ PEDIDO SAQUE EDITAR QQQQQQQQQQQQQQQQQQQ');
		console.log(data);	
		console.log('QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/pedidos-saques/editar_pedido_saque', data: data, usuario: req.session.usuario});
	});
});

router.get('/pedido-saque/aprovacao_saque_data_hora/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('selecionei o modal no editar');
	console.log(id);
	console.log('_________________________________');
	model.SelecionarPedidoSaque(id).then(data_pedido_saque_a => {
		data.pedido_saque_a = data_pedido_saque_a;
		data.link_sistema = '/sistema';
		console.log('================= APROVACAO SAQUE =========================');
		console.log(data);	
		console.log('===========================================================');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLimpo', {html: 'administracao/pedidos-saques/aprovacao_saque_qtd_btc', data: data, usuario: req.session.usuario});
	});
});


router.get('/pedido-saque/negacao_saque_motivo/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('selecionei o modal no editar');
	console.log(id);
	console.log('_________________________________');
	model.SelecionarPedidoSaque(id).then(data_pedido_saque_n => {
		data.pedido_saque_n = data_pedido_saque_n;
		data.link_sistema = '/sistema';
		console.log('oooOOOOooOOoOOO NEGAR SAQUE oooOOooOOOooOOooo');
		console.log(data);	
		console.log('ooooOOOooooOOOoooOOOooOoooOOooOooOoooooOOOoOO');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLimpo', {html: 'administracao/pedidos-saques/negacao_saque_motivo', data: data, usuario: req.session.usuario});
	});
});


router.get('/pedido-aporte/editar/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('selecionei o pedido-aporte no editar');
	console.log(id);
	console.log('_________________________________');
	model.SelecionarPedidoAporte(id).then(data_pedido_aporte => {
		data.pedido_aporte = data_pedido_aporte;
		data.link_sistema = '/sistema';
		console.log('TTTTTTTTTTTTTTTTTT PEDIDO APORTE EDITAR TTTTTTTTTTTTTTTTTTTT');
		console.log(data);	
		console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/pedidos-aportes/editar_pedido_aporte', data: data, usuario: req.session.usuario});
	});
});


router.get('/pedido-aporte/aprovacao_aporte_data_hora/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('selecionei o modal no editar');
	console.log(id);
	console.log('_________________________________');
	model.SelecionarPedidoAporte(id).then(data_pedido_aporte_a => {
		data.pedido_aporte_a = data_pedido_aporte_a;
		data.link_sistema = '/sistema';
		console.log('TTTTTTTTTTTTTTTTTT PEDIDO APORTE EDITAR TTTTTTTTTTTTTTTTTTTT');
		console.log(data);	
		console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLimpo', {html: 'administracao/pedidos-aportes/aprovacao_aporte_data_hora', data: data, usuario: req.session.usuario});
	});
});


router.get('/pedido-aporte/negacao_aporte_motivo/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('selecionei o modal no editar');
	console.log(id);
	console.log('_________________________________');
	model.SelecionarPedidoAporte(id).then(data_pedido_aporte_n => {
		data.pedido_aporte_n = data_pedido_aporte_n;
		data.link_sistema = '/sistema';
		console.log('TTTTTTTTTTTTTTTTTT PEDIDO APORTE EDITAR TTTTTTTTTTTTTTTTTTTT');
		console.log(data);	
		console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLimpo', {html: 'administracao/pedidos-aportes/negacao_aporte_motivo', data: data, usuario: req.session.usuario});
	});
});


router.get('/caixa/editar/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('selecionei o editar do caixa');
	console.log(id);
	console.log('_________________________________');
	model.GetUsuarios().then(data_usuario=>{
		data.usuario = data_usuario;
		model.SelecionarCaixa(id).then(data_caixa => {
			data.caixa = data_caixa;
			model.GetPlanos().then(data_plano=>{
				data.plano = data_plano;
				data.link_sistema = '/sistema';
				console.log('$$$$$$$$$$$$$$$$$$ CAIXA EDITAR $$$$$$$$$$$$$$$$$');
				console.log(data);	
				console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
				res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/caixa/editar_caixa', data: data, usuario: req.session.usuario});
			});
		});
	});
});


router.get('/plano/editar/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('selecionei o plano no editar');
	console.log(id);
	console.log('_________________________________');

	model.SelecionarPlano(id).then(data_plano_editar => {
		data.plano = data_plano_editar;
		data.link_sistema = '/sistema';
		console.log('@@@@@@@@@@@@@ PLANO EDITAR @@@@@@@@@@@@@@@@@@@@');
		console.log(data);	
		console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/planos/editar_plano', data: data, usuario: req.session.usuario});
	});
});


router.get('/plano/ativar/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('selecionei o plano ativar');
	console.log(id);
	console.log('_________________________________');

	model.SelecionarPlano(id).then(data_plano_ativar => {
		data.plano = data_plano_ativar;
		data.link_sistema = '/sistema';
		console.log('←←←←←←←←←←←← PLANO ATIVAR ←←←←←←←←←←←←←←←←←←←←←');
		console.log(data);	
		console.log('←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/planos/modal_ativar_plano', data: data, usuario: req.session.usuario});
	});
});



/* Fim Editar GET Administração */


/* Ínicio POST Cadastrar Administração*/


router.post('/caixa/cadastrar/', function(req, res, next) {
	POST = req.body;
	
	POST.confirmado = 1;
	console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP');
	console.log(POST);
	console.log('PPPPPPPPPPPPPPPPPPPPPOOOOOOOOOOOOOOOOOSSSSSSSSSSS');

	POST.valor = POST.valor.replace(',','.');
	if(parseFloat(POST.valor) > 0){
		model.CadastrarCaixa(POST).then(data => {
			res.json(data);
		});
	}else{
		res.json({error:'qtd_valor_negativo',element:'input[name="valor"]',texto:'Valor não pode ser 0 ou Negativo!'});
	}

});

router.post('/usuarios/cadastrar/', function(req, res, next) {
	POST = req.body;
	var senha = Math.random().toString(36).substr(2, 8);
	POST.senha = senha;


	if(POST.id_conector == undefined){
		POST.id_conector = 0;
	}

	console.log('PPPPPPPPPPOOOOOOOOOOOST USUARIOS POOOOOOSSSSSSSSSTTTTTTTTTTTTTTTT');
	console.log(POST);
	console.log('PPPPPPPPPPPPPPPPOOOOOOOOOOOSSSSSSSSSSSSSSSSSSSSSSTTTTTTTTTTTTTTTT');

	model.VerificarSeTemEmailDisponivel(POST.email).then(tem_email => {
		console.log('ttttttttttt tem login ttttt');
		console.log(tem_email);
		console.log('ttttttttttttttttttttttttttt');

		if(tem_email == ''){
			model.CadastrarUsuario(POST).then(data => {

				var html = "Bem vindo ao Moon Austronauta!. Segue abaixo as informações sobre sua conta."+
				"<br><b>Login:</b> "+POST.email+
				"<br><b>Senha:</b> "+senha+ 
				"<br><br>Recomendamos que você altera sua senha ao acessar o botão meus dados no menu."+
				"<br>Acesse via o site : http://moon.com.br"+
				"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
				"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

				var text = "Bem vindo ao Eagle Finances. Segue abaixo as informações sobre sua conta."+
				"<br>Login: "+POST.login+
				"<br>Senha: "+senha+
				"<br><br>Recomendamos que você altera sua senha ao acessar o seu perfil ao clicar no menu e ir no item 'Perfil'."+
				"<br>Acesse via o aplicativo Eagle Finance"+
				"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
				"<br>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";

				control.SendMail(POST.email, 'Bem-vindo ao Moon!', text,html);

				res.json(data);
			});


		}else{
			console.log('JJJJJJJJJJJJJJJJJJJ já existe login JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');
			res.json({error:'possui_email',element:'input[name="email"]',texto:'Email já cadastrado, por-favor tente outro!'});
		}
	});
});

router.post('/plano/cadastrar/', function(req, res, next) {
	POST = req.body;
	model.CadastrarPlano(POST).then(data => {
		res.json(data);
	});
});

router.post('/usuarios/alterar-senha/', function(req, res, next) {
	POST = req.body;
	var senha = Math.random().toString(36).substr(2, 8);
	POST.senha = senha;

	console.log('USUARIOS ALTERAR-SENHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
	console.log(POST);
	console.log('USUARIOS ALTERAR-SENHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

	model.SelecionarUsuario(POST.id).then(data_usuario => {
		model.AlterarSenhaUsuario(POST).then(senha_alteradao =>{
			var html = "Olá sua senha foi alterada pelo administrador do Sistema Moon. Segue abaixo as informações sobre sua conta."+
			"<br>O E-mail segue sendo este e a nova senha é:"
			"<br>"+senha+ 
			"<br><br>Recomendamos que você altera sua senha ao acessar os meus dados ao clicar no menu abaixo"+
			"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
			"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

			var text = "Olá sua senha foi alterada pelo administrador do Sistema Eagle Finances. Segue abaixo as informações sobre sua conta."+
			"<br>Login: "+data_usuario[0].login+
			"<br>Senha: "+senha+
			"<br><br>Recomendamos que você altera sua senha ao acessar o seu perfil ao clicar na imagem no cabeçalho a direita."+
			"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
			"<br>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";
			control.SendMail(data_usuario[0].email, 'Alterado Senha no Eagle Finances!', html, text);
			res.json(data);
		});
	});
});

router.post('/uploadarquivo', function(req, res, next) {
	var sampleFile = req.files.arquivo;
	var nome = control.DateTimeForFile()+'_'+sampleFile.name;

	console.log('SSSSSSSSSSSSSSSSSSS sampleFile SSSSSSSSSSSSSSSSSSSSSS');
	console.log(sampleFile);
	console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');

	
	sampleFile.mv('./public/uploads/'+nome, function(err) {
		if (err) {
			return res.status(500).send(err);
		}

		res.json(nome);
	});
});


/* Fim POST Cadastrar Administração */

/* Ínicio POST Atualizar Administração*/

router.post('/usuarios/atualizar/', function(req, res, next) {
	POST = req.body;
	console.log('AAAAAAAAA ATUALIZAR USUARIO AAAAAAAAAAAAAA');
	console.log(POST);
	console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
	//Se for criado um coach ou seja nivel 1 e quem tá cadastrando é o manager então vai o id do manager

	var html = "Olá seu email foi alterado pela administração no Moon. Os dados continuam os mesmos."+
	"<br><br>Caso você não saiba sua senha por favor contate o suporte."
	"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
	"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

	var text = "Olá seu email foi alterado pela administração no Moon.Os dados continuam os mesmos"+
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
			/*Se o e-mail foi alterado verificar se ele está disponivel(unico)*/
			model.VerificarSeTemEmailDisponivel(POST.email).then(tem_email => {
				if(tem_email == ''){
					model.AtualizarUsuario(POST).then(data => {
						control.SendMail(POST.email, 'E-mail alterado no Moon!', html, text);
						res.json(data);
					});
				}else{
					res.json({error:'possui_email',element:'input[name="email"]',texto:'Email já cadastrado, por favor inserir outro!'});
				}
			});
		}
	});

});

router.post('/pedido-saque/aprovar/', function(req, res, next) {
	POST = req.body;
	POST.confirmado = 1;

	model.SelecionarHoje().then(data_hoje=>{
		POST.dia_confirmacao = data_hoje[0].hoje;
		model.AprovarPedidoSaque(POST).then(id_aprovar_saque => {
			model.DescobrirUsuarioPorCaixaId(POST.id).then(data_usuario => {
				model.DescobrirCaixaValorPorCaixaId(POST.id).then(data_caixa => {

					var html = "Moon informa:"+
					"<br>Foi <b>APROVADO</b> o seu saque de <b>R$"+data_caixa[0].valor_real+" no plano <b>"+data_caixa[0].nome_plano+"</b>."+
					"<br>Qualquer dúvida por favor contatar o suporte."+ 
					"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

					var text = "Moon informa:"+
					"Foi APROVADO o seu saque de R$"+data_caixa[0].valor_real+" no plano "+data_caixa[0].nome_plano+"."+
					"Qualquer dúvida por favor contatar o suporte."+ 
					"Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";

					control.SendMail(data_usuario[0].email, 'Pedido de aporte Aprovado na Eagle!', text,html);
					console.log('usuario uuuuu')
					console.log(data_usuario);
					console.log('uuuuuuuuuuuuu');
					console.log('caixa xxxxxxxx');
					console.log(data_caixa);
					console.log('xxxxxxxxxxxxxx');
					res.json(id_aprovar_saque);
				});
			});
		});
	});
});

router.post('/pedido-saque/negar/', function(req, res, next) {
	POST = req.body;
	console.log('NNNNNNNNNNNN NEGAR PEDIDO SAQUE  NNNNNNNNNNNNNNNNNNNNNNN');
	console.log(POST);
	console.log('NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN');
	/*2 é negado*/
	POST.confirmado = 2;
	model.SelecionarHoje().then(data_hoje=>{
		POST.dia_confirmacao = data_hoje[0].hoje;
		model.NegarPedidoSaque(POST).then(id_negar_saque => {
			model.DescobrirUsuarioPorCaixaId(POST.id).then(data_usuario => {
				model.DescobrirCaixaValorPorCaixaId(POST.id).then(data_caixa => {

					var html = "Moon informa:"+
					"<br>Foi <b>NEGADO</b> o seu saque de <b>R$"+data_caixa[0].valor_real+" no plano <b>"+data_caixa[0].nome_plano+"</b>."+
					"<br>Pelo seguinte motivo:<b>"+POST.status+"</b>."+
					"<br>Qualquer dúvida por favor contatar o suporte."+ 
					"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

					var text = "Moon informa:"+
					"Foi NEGADO o seu saque de R$"+data_caixa[0].qtd_stable+" no plano "+data_caixa[0].nome_plano+"."+
					"Pelo seguinte motivo:"+POST.status+"."+
					"Qualquer dúvida por favor contatar o suporte."+ 
					"Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";

					control.SendMail(data_usuario[0].email, 'Pedido de saque Negado no Moon!', text,html);
					res.json(id_negar_saque);
				});
			});
		});
	});
});

router.post('/pedido-aporte/aprovar/', function(req, res, next) {
	POST = req.body;
	POST.confirmado = 1;

	model.SelecionarHoje().then(data_hoje=>{
		POST.dia_confirmacao = data_hoje[0].hoje;
		model.AprovarPedidoAporte(POST).then(id_aprovar_aporte => {
			model.DescobrirUsuarioPorCaixaId(POST.id).then(data_usuario => {
				model.DescobrirCaixaValorPorCaixaId(POST.id).then(data_caixa => {

					var html = "Moon informa:"+
					"<br>Foi <b>APROVADO</b> o seu aporte de <b>R$"+data_caixa[0].valor_real+" no plano <b>"+data_caixa[0].nome_plano+"</b>."+
					"<br>Qualquer dúvida por favor contatar o suporte."+ 
					"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

					var text = "Moon informa:"+
					"Foi APROVADO o seu aporte de R$"+data_caixa[0].valor_real+" no plano "+data_caixa[0].nome_plano+"."+
					"Qualquer dúvida por favor contatar o suporte."+ 
					"Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";

					control.SendMail(data_usuario[0].email, 'Pedido de aporte Aprovado na Eagle!', text,html);
					console.log('usuario uuuuu')
					console.log(data_usuario);
					console.log('uuuuuuuuuuuuu');
					console.log('caixa xxxxxxxx');
					console.log(data_caixa);
					console.log('xxxxxxxxxxxxxx');
					res.json(id_aprovar_aporte);
				});
			});
		});
	});
});

router.post('/pedido-aporte/negar/', function(req, res, next) {
	POST = req.body;
	/*2 é negado*/
	POST.confirmado = 2;
	console.log('NNNNNNNNNNNN NEGAR PEDIDO APORTE  NNNNNNNNNNNNNNNNNNNNNNN');
	console.log(POST);
	console.log('NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN');
	
	model.SelecionarHoje().then(data_hoje=>{
		POST.dia_confirmacao = data_hoje[0].hoje;
		model.NegarPedidoAporte(POST).then(id_negar_aporte => {
			model.DescobrirUsuarioPorCaixaId(POST.id).then(data_usuario => {
				model.DescobrirCaixaValorPorCaixaId(POST.id).then(data_caixa => {

					var html = "Moon informa:"+
					"<br>Foi <b>NEGADO</b> o seu aporte de <b>R$"+data_caixa[0].valor_real+" no plano <b>"+data_caixa[0].nome_plano+"</b>."+
					"<br>Pelo seguinte motivo:<b>"+POST.status+"</b>."+
					"<br>Qualquer dúvida por favor contatar o suporte."+ 
					"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

					var text = "Moon informa:"+
					"Foi NEGADO o seu aporte de R$"+data_caixa[0].valor_real+" no plano "+data_caixa[0].nome_plano+"."+
					"Pelo seguinte motivo:<b>"+POST.status+"</b>."+
					"Qualquer dúvida por favor contatar o suporte."+ 
					"Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";

					control.SendMail(data_usuario[0].email, 'Pedido de aporte Negado na Eagle!', text,html);
					console.log('id_negar_aporte:'+id_negar_aporte);
					console.log('usuario uuuuu')
					console.log(data_usuario);
					console.log('uuuuuuuuuuuuu');
					console.log('caixa xxxxxxxx');
					console.log(data_caixa);
					console.log('xxxxxxxxxxxxxx');
					res.json(id_negar_aporte);
				});
			});
		});
	});
});

router.post('/pedido-aporte/enviar-email/', function(req, res, next) {
	POST = req.body;
	console.log('@@@@@@@@@@@@@ PEDIDO APORTE ENVIO DE EMAIL @@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

	model.DescobrirUsuarioPorCaixaId(POST.id).then(data_usuario_caixa=>{
		model.DescobrirCaixaValorPorCaixaId(POST.id).then(data_caixa=>{

			var html = "Olá Você está recebendo este e-mail pois pediu o comprovante por e-mail. <br>"+
			"O comprovante do usuário <b>"+data_usuario_caixa[0].nome+"</b> no plano <b>"+data_caixa[0].nome_plano+ "</b> com o valor de " +data_caixa[0].qtd_stable+ " Tether."+
			"<br>O comprovante está em anexo."+
			"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

			var text = "Olá Você está recebendo este e-mail pois pediu o comprovante por e-mail. <br>."+
			"O comprovante do usuário "+data_usuario_caixa[0].nome+" com o login "+ data_usuario_caixa[0].login + " no plano "+data_caixa[0].nome_plano+ " com o valor de " +data_caixa[0].valor+ " Tether."+
			"<br>O comprovante está em anexo."+
			"<br>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";


			model.GetUsuario(req.session.usuario.id).then(data_usuario =>{
				control.SendMailAttachmentNoFileName(data_usuario[0].email, 'Comprovante Deposito - '+POST.id, text, html,'.'+POST.arquivo);
				res.json(data_usuario);
			});
		});
	});
});

router.post('/caixa/atualizar/', function(req, res, next) {
	POST = req.body;

	POST.valor = POST.valor.replace(',','.');
	if(parseFloat(POST.valor) > 0){
		console.log('ACCCCCCCCCC ATUALIZAR CAIXA ACCCCCCCCCCCCCCCCCCC');
		console.log(POST);
		console.log('ACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
		model.AtualizarCaixa(POST).then(data => {
			res.json(data);
		});
	}else{
		res.json({error:'qtd_valor_negativo',element:'input[name="valor"]',texto:'Valor não pode ser 0 ou Negativo!'});
	}

});

router.post('/plano/atualizar/', function(req, res, next) {
	POST = req.body;
	console.log('APPPPPPPPPPPP ATUALIZAR PLANO APPPPPPPPPPPPPPP');
	console.log(POST);
	console.log('APPPPPPPPPPPPPPPPPAPPPPPPPPPPPPPPPPPPPAPPPPPP');

	model.AtualizarPlano(POST).then(data => {
		res.json(data);
	});
});


/* Fim POST Atualizar Administração*/

/* Ínicio POST Deletar Administração*/

router.post('/usuarios/desativar', function(req, res, next) {
	
	POST = req.body;
	model.DesativarUsuario(POST).then(data=> {
		res.json(data);
	});
});

router.post('/caixa/desativar', function(req, res, next) {
	POST = req.body;
	console.log('XXXXXXXXXXX CAIXA DESATIVAR XXXXXXXXXXXXXXXX');
	console.log(POST);
	console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
	model.DesativarCaixa(POST).then(data=> {
		res.json(data);
	});
});

router.post('/plano/desativar', function(req, res, next) {
	POST = req.body;
	console.log('PPPPPPPPPPPPPP PLANO DESATIVAR PPPPPPPPPPPPPPPPP');
	console.log(POST);
	console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP');
	model.DesativarPlano(POST).then(data=> {
		res.json(data);
	});
});

/* Fim POST Deletar Administração*/

module.exports = router;
