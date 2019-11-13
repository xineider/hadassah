'use strict';
var express = require('express');
var app = express();
var Helper = require('./model.js');
var helper = new Helper;

class EmpresaModel {

	SelecionarEmpresaComObservacoesRegiaoSegmento(id) {
		return new Promise(function(resolve, reject) {
			var data = {};
			helper.Query("SELECT a.* FROM empresa as a WHERE a.id = ? AND a.deletado = ?", [id, 0]).then(data_empresa => {
				data.empresa = data_empresa;
				helper.Query("SELECT * FROM empresa_observacoes WHERE id_empresa = ? AND deletado = ?", [id, 0]).then(data_lista => {
					data.lista = data_lista;
					helper.Query("SELECT a.* FROM regiao as a WHERE a.deletado = ?", [0]).then(data_regiao => {
						data.regiao = data_regiao;
						helper.Query("SELECT a.* FROM segmento as a WHERE a.deletado = ?", [0]).then(data_segmento => {
							data.segmento = data_segmento;
							resolve(data);
						});
					});
				});
			});
		});
	}


	GetRegiao() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.* FROM regiao as a WHERE a.deletado = ?',[0]).then(data => {
				resolve(data);
			});
		});
	}

	GetSegmento() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.* FROM segmento as a WHERE a.deletado = ?',[0]).then(data => {
				resolve(data);
			});
		});
	}

	CadastrarLog(POST) {
		var cadastrarLog = [];
		cadastrarLog.ip = POST[0];
		cadastrarLog.method = POST[1];
		cadastrarLog.rota = POST[2];
		cadastrarLog.user_agent = POST[3];
		cadastrarLog.id_usuario = POST[4];

		return new Promise(function(resolve, reject) {
			helper.Insert('log', cadastrarLog).then(data => {
				resolve(data);
			});
		});
	}


	CadastrarEmpresa(POST) {	
		return new Promise(function(resolve, reject) {

			console.log('antes de deletar os desnecessario');
			console.log(POST);
			console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
			console.log('empresa');
			console.log(POST.empresa);
			console.log('eeeeeeeeeeeee');

			if(POST.empresa.faturamento == null || POST.empresa.faturamento == ''){
				delete POST.empresa.faturamento;
			}

			if(POST.empresa.ebitida == null || POST.empresa.ebitida == ''){
				delete POST.empresa.ebitida;
			}

			if(POST.empresa.valor_venda == null || POST.empresa.valor_venda == ''){
				delete POST.empresa.valor_venda;
			}

			if(POST.empresa.consult == null || POST.empresa.consult == ''){
				delete POST.empresa.consult;
			}

			if(POST.empresa.com == null || POST.empresa.com == ''){
				delete POST.empresa.com;
			}

			console.log('ddddddddddd dentro da cadastrarEmpresa ddddddd');
			console.log(POST);
			console.log('dddddddddddddddddddddddddddddddddddddddddddddd');

			helper.Insert('empresa', POST.empresa).then(id_empresa => {
				POST.lista = helper.PrepareMultiple(POST.lista, 'id_empresa', id_empresa);
				console.log('PPPPPPPPPPPPPPPPPPPPPPPP MODEL DEPOIS DO PrepareMultiple PPPPPPPPPPPPPPPPPPPPPPPPPPPPP');
				console.log(POST);
				console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP');
				helper.InsertMultiple('empresa_observacoes', POST.lista).then(id_lista => {
					resolve(id_lista);
				});
			});
		});
	}

	AtualizarEmpresa(POST) {

		return new Promise(function(resolve, reject) {
			console.log('ÚÚÚÚÚÚÚÚÚÚÚ POST DA ATUALIZAR EMPRESA ÚÚÚÚÚÚÚÚÚÚÚÚÚÚ');
			console.log(POST);
			console.log('ÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚÚ');


			if(POST.empresa.faturamento == null || POST.empresa.faturamento == ''){
				console.log('1111111111111111111111');
				delete POST.empresa.faturamento;
			}

			if(POST.empresa.ebitida == null || POST.empresa.ebitida == ''){
				console.log('2222222222222222222222222');
				delete POST.empresa.ebitida;
			}

			if(POST.empresa.valor_venda == null || POST.empresa.valor_venda == ''){
				console.log('333333333333333333333333333');
				delete POST.empresa.valor_venda;
			}

			if(POST.empresa.consult == null || POST.empresa.consult == ''){
				console.log('4444444444444444444444444444');
				delete POST.empresa.consult;
			}

			if(POST.empresa.com == null || POST.empresa.com == ''){
				console.log('555555555555555555555555555555555555');
				delete POST.empresa.com;
			}


			if (typeof POST.remover != 'undefined') {
				console.log('cai no remover para adicionar o deletado:')
				POST.remover = helper.PrepareMultiple(POST.remover, 'deletado', 1);
				console.log(POST);
				console.log('______________________________________');
			} else {
				console.log('nao cai no remover');
				POST.remover = {};
			}
			if (typeof POST.lista != 'undefined') {
				console.log('lista diferente de undefined');
				POST.lista = helper.PrepareMultiple(POST.lista, 'id_empresa', POST.empresa.id);
				console.log(POST);
				console.log('--------------------------------------');
			} else {
				console.log('cai no else do lista undefined');
				POST.lista = {};
			}
			if (typeof POST.lista_editar == 'undefined') {
				console.log('cai no lista editar');
				POST.lista_editar = {};
			}

			console.log('ÏÏÏÏÏÏÏÏÏÏÏÏÏÏ post ÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏ');
			console.log(POST);
			console.log('ÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏÏ');

			console.log('POST EMPRESA');
			console.log(POST.empresa);

			console.log('POST remover');
			console.log(POST.remover);

			console.log('POST lista');
			console.log(POST.lista);

			console.log('POST lista_editar');
			console.log(POST.lista_editar);

			helper.Update('empresa', POST.empresa).then(id_empresa => {
				console.log('DDDDDDDDDDD id_empresa DDDDDDDDDDDDDDDDDD');
				console.log(id_empresa);
				console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
				helper.UpdateMultiple('empresa_observacoes', POST.remover).then(id_lista_rmv => {
					console.log('XXXXXXXXXXXXX id_lista: XXXXXXXXXXX');
					console.log(id_lista_rmv);
					console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
					helper.InsertMultiple('empresa_observacoes', POST.lista).then(id_lista_insert => {
						console.log('LLLLLLLLLL id_lista_insert LLLLLLLLLLLLL');
						console.log(id_lista_insert);
						console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL');
						helper.UpdateMultiple('empresa_observacoes', POST.lista_editar).then(id_lista_edit => {
							console.log('ÇÇÇÇÇÇÇÇÇÇÇ id_lista_edit ÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇ');
							console.log(id_lista_edit);
							console.log('ÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇ');
							resolve(id_empresa);
						});
					});
				});
			});
		});
	}



	DesativarEmpresa(POST) {
		return new Promise(function(resolve, reject) {
			helper.Desativar('empresa', POST).then(data => {
				resolve(data);
			});
		});
	}



}
module.exports = EmpresaModel;