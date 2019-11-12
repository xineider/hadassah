// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var CarteiraModel = require('../model/carteiraModel.js');
var model = new CarteiraModel;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));

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
							data.mes_ativo = data_mes_atual_ativo[0].mes_atual_ativo;
							data.mesmo_mes = data_mes_atual_ativo[0].mes_atual_ativo;
							model.GetUltimoSaldoMesUsuario(req.session.usuario.id,data_mes_atual_ativo[0].mes_atual_ativo).then(data_ultimo_saldo=>{
								data.ultimo_saldo = data_ultimo_saldo;
								model.GetCaixaMesUsuario(req.session.usuario.id,data_mes_atual_ativo[0].mes_atual_ativo).then(data_caixa=>{
									data.caixa = data_caixa;
									data.link_sistema = '/sistema';
									data.numero_menu = 2;
									console.log('ccccccccccccccccc carteira ccccccccccccccccccc');
									console.log(data);
									console.log('cccccccccccccccccccccccccccccccccccccccccccccc');
									res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'carteira/carteira', data: data, usuario: req.session.usuario});
								});
							});
						});
					});
				});
			});
		});
	});
});


router.get('/ver-carteira-mes/:mes', function(req, res, next) {
	var mes = req.params.mes;

	console.log('estou vendo a carteira do mes');
	console.log('mes:'+mes);

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
						model.GetNomeMes(parseInt(mes)).then(data_nome_mes=>{
							data.nome_mes = data_nome_mes;
							model.GetUltimoSaldoMesUsuario(req.session.usuario.id,mes).then(data_ultimo_saldo=>{
								data.ultimo_saldo = data_ultimo_saldo;
								model.GetCaixaMesUsuario(req.session.usuario.id,mes).then(data_caixa=>{
									data.caixa = data_caixa;
									data.mes_ativo = mes;
									console.log('vVvVvVvVvVvVvVvVvVvVvVvVvVvV verCarteiraMes vVvVvVvVvVvVvVvVvVvVvVvVvVvV');
									console.log(data);
									console.log('vVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvV');
									res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'carteira/carteira', data: data, usuario: req.session.usuario});
								});
							});
						});
					});
				});
			});
		});
	});
});

module.exports = router;
