// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var IndexModel = require('../model/indexModel.js');
var model = new IndexModel;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));

/* GET pagina de login. */

router.get('/', function(req, res, next) {
	model.GetEmpresas().then(data_empresas=>{
		data.empresas = data_empresas;
		model.GetRegiao().then(data_regiao => {
			data.regiao = data_regiao;
			model.GetSegmento().then(data_segmento => {
				data.segmento = data_segmento;
				model.GetPermissoesPorNivel(req.session.usuario.nivel).then(data_permissoes=>{
					data.permissoes = data_permissoes;
					console.log('usuario');
					console.log(req.session.usuario);
					console.log('kokokokokokoko usuario requisição kokokokokokokokoko')
					console.log(data);
					console.log('kokokokokokokokokokokokokokokokokokokokokokokokokoko');
					res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/index', data: data, usuario: req.session.usuario});
				});
			});
		});
	});
});


router.post('/log', function(req, res, next) {
	POST = req.body;

	model.CadastrarLog(POST).then(data=> {
		res.json(data);
	});
});

module.exports = router;
