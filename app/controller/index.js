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
							data.numero_menu = 1;
							console.log('kokokokokokoko usuario requisição kokokokokokokokoko')
							console.log(data);
							console.log('kokokokokokokokokokokokokokokokokokokokokokokokokoko');
							res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'historico/historico', data: data, usuario: req.session.usuario});
						});
					});
				});
			});
		});
	});
});


/* POST enviando o login para verificação. */
router.post('/', function(req, res, next) {
	mode.Teste().then(data => {
		res.json(data);
	});
});

router.post('/log', function(req, res, next) {
	POST = req.body;
	
	model.CadastrarLog(POST).then(data=> {
		res.json(data);
	});
});

module.exports = router;
