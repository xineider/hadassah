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



router.get('/usuarios/criar', function(req, res, next) {
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/usuarios/cadastrar_usuario', data: data, usuario: req.session.usuario});
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

	model.VerificarSeTemEmailDisponivel(POST.email).then(tem_email => {
		console.log('ttttttttttt tem login ttttt');
		console.log(tem_email);
		console.log('ttttttttttttttttttttttttttt');

		if(tem_email == ''){
			model.CadastrarUsuario(POST).then(data => {

				var html = "Bem vindo ao Hadassah Consulting!. Segue abaixo as informações sobre sua conta."+
				"<br><b>Login:</b> "+POST.email+
				"<br><b>Senha:</b> "+senha+ 
				"<br>Acesse via o site : http://hadassahconsulting-com.umbler.net/"+
				"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
				"<br><b>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!</b>";

				var text = "Bem vindo ao Hadassah Consulting!. Segue abaixo as informações sobre sua conta."+
				"<br>Login: "+POST.email+
				"<br>Senha: "+senha+
				"<br>Os dados da sua conta são responsabilidade sua, não a entregue a pessoas sem permissão."+
				"<br>Por favor, não responda essa mensagem, pois ela é enviada automaticamente!";

				control.SendMail(POST.email, 'Bem-vindo ao Moon!', html,text);

				res.json(data);
			});


		}else{
			console.log('JJJJJJJJJJJJJJJJJJJ já existe login JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');
			res.json({error:'possui_email',element:'input[name="email"]',texto:'Email já cadastrado, por-favor tente outro!'});
		}
	});
});

module.exports = router;
