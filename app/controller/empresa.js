// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var EmpresaModel = require('../model/empresaModel.js');
var model = new EmpresaModel;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));

/* GET pagina de login. */
router.get('/', function(req, res, next) {
	model.SelecionarUsuarios().then(data => {
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/index', data: data, usuario: req.session.usuario});
	});
});
router.get('/criar', function(req, res, next) {
	model.GetRegiao().then(data_regiao => {
		data.regiao = data_regiao;
		model.GetSegmento().then(data_segmento => {
			data.segmento = data_segmento;
			console.log('eeeeeee estou no criar empresa eeeeeeeee');
			console.log(data);
			console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'empresa/cadastrar_empresa', data: data, usuario: req.session.usuario});
		});
	});
});

router.get('/editar/:id', function(req, res, next) {
	var id = req.params.id;

	model.SelecionarEmpresaComObservacoesRegiaoSegmentoPermissao(id,req.session.usuario.nivel).then(data => {
		console.log('eeeeeeeeeeee editar empresa eeeeeeeee');
		console.log(data);
		console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'empresa/editar_empresa', data: data, usuario: req.session.usuario});
	});
});





router.get('/adicionar/observacao', function(req, res, next) {
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'empresa/observacoes_lista', data: data, usuario: req.session.usuario});
});


router.post('/cadastrar', function(req, res, next) {	
	POST = req.body;
	console.log('cccccccc cadastrar empresa cccccccccc');
	console.log(POST);
	console.log('ccccccccccccccccccccccccccccccccccccc');
	model.CadastrarEmpresa(POST).then(data => {
		res.json(data);
	});
});

router.post('/atualizar', function(req, res, next) {	
	POST = req.body;
	console.log('AAAAAAAA Atualizar Empresa AAAAAAAAAA');
	console.log(POST);
	console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
	model.AtualizarEmpresa(POST).then(data => {
		res.json(data);
	});
});

router.post('/desativar', function(req, res, next) {
	POST = req.body;
	model.DesativarEmpresa(POST).then(data=> {
		res.json(data);
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

router.post('/pesquisar', function(req, res, next) {

	POST = req.body;
	model.ProcurarEmpresa(POST).then(data_empresa => {
		data.empresas = data_empresa;
		model.GetPermissoesPorNivel(req.session.usuario.nivel).then(data_permissoes=>{
			data.permissoes = data_permissoes;
			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/tabela_interna_only', data: data, usuario: req.session.usuario});
		});
	});
});

module.exports = router;
