'use strict';
var express = require('express');
var app = express();
var Helper = require('./model.js');
var helper = new Helper;

class EmpresaModel {

	SelecionarEmpresaComObservacoesRegiaoSegmentoPermissao(id,nivel) {
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
							helper.Query('SELECT a.* FROM permissoes as a WHERE deletado = ? AND nivel = ? ORDER BY data_cadastro DESC LIMIT 1', [0,nivel]).then(data_permissoes => {
								data.permissoes = data_permissoes;
								resolve(data);
							});
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

	ProcurarEmpresa(POST) {
		return new Promise(function(resolve, reject) {

			if(POST.id_segmento == null || POST.id_segmento == 'nao_existe'){
				delete POST.id_segmento;
			}

			if(POST.id_regiao == null || POST.id_regiao == 'nao_existe'){
				delete POST.id_regiao;
			}

			if(POST.faturamento_maior == null || POST.faturamento_maior == ''){
				delete POST.faturamento_maior;
			}


			if(POST.faturamento_menor== null || POST.faturamento_menor == ''){
				delete POST.faturamento_menor;
			}

			if(POST.ebitida == null || POST.ebitida == ''){
				delete POST.ebitida;
			}

			if(POST.valor_venda_maior == null || POST.valor_venda_maior == ''){
				delete POST.valor_venda_maior;
			}

			if(POST.valor_venda_menor == null || POST.valor_venda_menor == ''){
				delete POST.valor_venda_menor;
			}

			if(POST.consult == null || POST.consult == ''){
				delete POST.consult;
			}

			if(POST.com == null || POST.com == ''){
				delete POST.com;
			}


			console.log('@@@@@@@@@@ POST DO PROCURAR EMPRESA @@@@@@@@@@');
			console.log(POST);
			console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

			var where = '';
			var array = [0,0,0];
			for (var key in POST) {
				console.log('key:' +key);


				/*uso a função substring para ver se é um id (o padrão é id_usuario, id_qualquercoisa) 
				se for um id o mesmo deve ser igual a chave*/
				if(key.substring(0,3) == 'id_'){
					where += 'AND a.' + key + ' = ? ';
					array.push(POST[key]);
				}else if(key == 'faturamento_maior'){
					where += 'AND a.faturamento >= ?'
					array.push(POST[key]);
				}else if(key == 'faturamento_menor'){
					where += 'AND a.faturamento <= ?'
					array.push(POST[key]);
				}else if(key == 'valor_venda_maior'){
					where += 'AND a.valor_venda >= ?'
					array.push(POST[key]);
				}else if(key == 'valor_venda_menor'){
					where += 'AND a.valor_venda <= ?'
					array.push(POST[key]);
				}else{
					where += 'AND a.' + key + ' LIKE ? ';
					array.push('%'+POST[key]+'%');
					console.log('no else');
				}
			}

			console.log('+++++++++ where ++++++');
			console.log(where);
			console.log('++++++++++++++++++++++');
			console.log('********* array *************');
			console.log(array);
			console.log('*****************************');

			helper.Query("SELECT a.*,\
				(SELECT b.descricao FROM segmento as b WHERE b.id = a.id_segmento AND b.deletado = ?) as segmento, \
				(SELECT c.sigla FROM regiao as c WHERE c.id = a.id_regiao AND c.deletado = ?) as regiao \
				FROM empresa AS a WHERE a.deletado = ? "+where, array).then(data => {
					console.log('data do procurar empresa');
					console.log(data);
					console.log('eeeeeeeeeeeeeeeeeeeeeeee');			
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

	GetPermissoesPorNivel(nivel) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*\
				FROM permissoes as a WHERE deletado = ? AND nivel = ? ORDER BY data_cadastro DESC LIMIT 1', [0,nivel]).then(data => {
					resolve(data);
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