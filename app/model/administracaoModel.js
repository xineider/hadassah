'use strict';
var express = require('express');
var app = express();
var Helper = require('./model.js');
var helper = new Helper;

class AdministracaoModel {


	GetPrimeiroAporte(id_usuario) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT COALESCE(\
				REPLACE(REPLACE(REPLACE(FORMAT(valor, 2), ".", "@"), ",", "."), "@", ",")\
				,0) as valor FROM caixa \
				WHERE id_usuario = ? AND deletado = ? AND tipo = ? \
				ORDER BY data_cadastro ASC LIMIT 1', [id_usuario,0,0]).then(data => {
					resolve(data);
				});
			});
	}

	GetExtrato(id_usuario,dolar) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*,REPLACE(ROUND(a.valor,2),".",",") as valor,REPLACE(ROUND(a.qtd_stable,2),".",",") as qtd_stable,REPLACE(ROUND(a.qtd_stable * ?,2),".",",") as qtd_real_convertido,\
				DATE_FORMAT(a.data_cadastro, "%d/%m/%Y") as data_cadastro,DATE_FORMAT(a.dia_convertido_stable, "%d/%m/%Y") as dia_convertido_stable,b.nome as nome_plano,\
				CASE \
				WHEN a.tipo = 0 THEN "Depósito em Conta"\
				WHEN a.tipo = 1 THEN "Saque"\
				WHEN a.tipo = 2 THEN "Rendimento"\
				WHEN a.tipo = 3 THEN "Saque"\
				ELSE 0 END as mensagem \
				FROM caixa as a \
				LEFT JOIN planos as b ON a.id_plano = b.id\
				WHERE a.deletado = ? AND a.id_usuario = ? \
				ORDER BY a.data_cadastro', [dolar,0,id_usuario]).then(data => {
					resolve(data);
				});
			});
	}

	GetValorSaldoAtualizado(id_usuario) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT COALESCE(\
				REPLACE(REPLACE(REPLACE(FORMAT((\
				(SUM(CASE WHEN (tipo = ? AND deletado = ? AND id_usuario = ? AND confirmado = ?) THEN valor ELSE 0 END)) + \
				(SUM(CASE WHEN (tipo = ? AND deletado = ? AND id_usuario = ? AND confirmado = ?) THEN valor ELSE 0 END)) - \
				(SUM(CASE WHEN (tipo = ? AND deletado = ? AND id_usuario = ? AND confirmado = ?) THEN valor ELSE 0 END)) - \
				(SUM(CASE WHEN (tipo = ? AND deletado = ? AND id_usuario = ? AND confirmado = ?) THEN valor ELSE 0 END)) \
				),2), ".", "@"), ",", "."), "@", ","),0) as saldo_atualizado \
				FROM caixa', 
				[
				0,0,id_usuario,1,
				2,0,id_usuario,1,
				1,0,id_usuario,1,
				3,0,id_usuario,1]).then(data => {
					resolve(data);
				});
			});
	}


	GetMesesDecorridosUsuario(id_usuario){
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT ROUND(DATEDIFF(NOW(),data_inicio)/30) as meses_decorridos FROM usuarios_planos \
				WHERE id_usuario = ? and deletado = ?', [id_usuario,0]).then(data => {
					resolve(data);
				});
			});
	}


	GetPlanoUsuario(id_usuario) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT b.nome, c.nome as plano, c.performance\
				FROM usuarios_planos as a\
				LEFT JOIN usuarios as b ON b.id = a.id_usuario\
				LEFT JOIN planos as c ON c.id = a.id_plano\
				WHERE a.id_usuario = ? AND a.deletado = ?', [id_usuario,0]).then(data => {
					resolve(data);
				});
			});
	}

	GetMesAtualAtivo(){
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT MONTH(NOW()) as mes_atual_ativo', []).then(data => {
				resolve(data);
			});
		});
	}


	GetCaixaMesesUsuario(id_usuario) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT MONTH(data) AS numero_mes,\
				CASE \
				WHEN MONTH(data) = 1 THEN "Jan"\
				WHEN MONTH(data) = 2 THEN "Fev"\
				WHEN MONTH(data) = 3 THEN "Mar"\
				WHEN MONTH(data) = 4 THEN "Abr"\
				WHEN MONTH(data) = 5 THEN "Mai"\
				WHEN MONTH(data) = 6 THEN "Jun"\
				WHEN MONTH(data) = 7 THEN "Jul"\
				WHEN MONTH(data) = 8 THEN "Ago"\
				WHEN MONTH(data) = 9 THEN "Set"\
				WHEN MONTH(data) = 10 THEN "Out"\
				WHEN MONTH(data) = 11 THEN "Nov"\
				WHEN MONTH(data) = 12 THEN "Dez"\
				END AS nome_mes\
				FROM caixa WHERE deletado = ? AND id_usuario = ? \
				GROUP BY MONTH(data)',[0,id_usuario]).then(data => {
					resolve(data);
				});
			});
	}

	GetUsuariosMenosProprio(id) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*,\
				(SELECT b.nome FROM usuarios as b WHERE b.id = a.id_conector) as conector FROM usuarios as a WHERE deletado = ? AND id != ?	ORDER BY data_cadastro ', [0,id]).then(data => {
					resolve(data);
				});
			});
	}

	GetConectores() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT * FROM usuarios WHERE deletado = ? AND nivel = ? ORDER BY nome', [0,2]).then(data => {
				resolve(data);
			});
		});
	}

	GetPedidosAportes() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*,\
				DATE_FORMAT(a.data_cadastro, "%d/%m/%Y") as data_cadastro, \
				DATE_FORMAT(a.data_cadastro, "%Y%m%d %H:%i") as data_table_filtro,\
				REPLACE(REPLACE(REPLACE(FORMAT(a.valor, 2), ".", "@"), ",", "."), "@", ",") as valor_real,\
				(SELECT b.nome FROM usuarios as b WHERE b.id = a.id_usuario AND b.deletado = ?) as nome, \
				(SELECT c.nome FROM planos as c WHERE c.id = a.id_plano) as plano \
				FROM caixa as a WHERE a.deletado = ? AND a.tipo = ? AND a.confirmado = ?', [0,0,0,0]).then(data => {
					resolve(data);
				});
			});
	}

	GetPedidosSaques() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*,\
				DATE_FORMAT(a.data_cadastro, "%Y%m%d %H:%i") as data_table_filtro,\
				DATE_FORMAT(a.data_cadastro, "%d/%m/%Y") as data_cadastro, \
				REPLACE(REPLACE(REPLACE(FORMAT(a.valor, 2), ".", "@"), ",", "."), "@", ",") as valor_real,\
				(SELECT b.nome FROM usuarios as b WHERE b.id = a.id_usuario AND b.deletado = ?) as nome, \
				(SELECT c.nome FROM planos as c WHERE c.id = a.id_plano) as plano \
				FROM caixa as a \
				WHERE a.deletado = ? AND (a.tipo = ? OR a.tipo = ?) AND a.confirmado = ?', [0,0,1,3,0]).then(data => {
					resolve(data);
				});
			});
	}

	GetCaixa() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*,  \
				DATE_FORMAT(a.data_cadastro, "%d/%m/%Y") as data_cadastro,\
				DATE_FORMAT(a.data_cadastro, "%Y%m%d %H:%i") as data_table_filtro,\
				REPLACE(REPLACE(REPLACE(FORMAT(a.valor, 2), ".", "@"), ",", "."), "@", ",") as valor_real,\
				(SELECT nome FROM planos as b WHERE b.id = a.id_plano) as plano,\
				(SELECT nome FROM usuarios as c WHERE c.id = a.id_usuario) as nome_usuario,\
				CASE \
				WHEN a.tipo = 0 THEN "Aporte"\
				WHEN a.tipo = 1 THEN "Saque do Aporte"\
				WHEN a.tipo = 2 THEN "Rendimento"\
				WHEN a.tipo = 3 THEN "Saque do Rendimento"\
				WHEN a.tipo = 4 THEN "Reaporte"\
				ELSE "Indefinido"\
				END AS tipo\
				FROM caixa as a WHERE a.deletado = ? AND a.confirmado = ?', [0,1]).then(data => {
					console.log('sssssssss sai assim do getCaixa() sssssssssssss');
					console.log(data);
					console.log('sssssssssssssssssssssssssssssssssssssssssssssss');
					resolve(data);
				});
			});
	}

	GetPlanos() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*,\
				DATE_FORMAT(a.data_cadastro, "%d/%m/%Y") as data_cadastro,\
				DATE_FORMAT(a.data_cadastro, "%Y%m%d %H:%i") as data_table_filtro\
				FROM planos as a WHERE a.deletado = ?', [0]).then(data => {
					resolve(data);
				});
			});
	}

	GetUsuarios() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT * FROM usuarios WHERE deletado = ?	ORDER BY nome ', [0]).then(data => {
				resolve(data);
			});
		});
	}

	VerificarSeTemEmailDisponivel(email){
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT email \
				FROM usuarios WHERE deletado = ? AND email = ?", [0,email]).then(data => {
					resolve(data);
				});
			});
	}

	VerificarSeTemMesmoEmail(POST){
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT email \
				FROM usuarios WHERE deletado = ? AND email = ? AND id = ?", [0,POST.email,POST.id]).then(data => {
					resolve(data);

				});
			});
	}

	/*Ínicio Descobrir*/
	DescobrirUsuarioPorCaixaId(id_caixa) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT * FROM usuarios as a \
				WHERE a.id IN (SELECT id_usuario FROM caixa as b WHERE b.id = ? AND b.deletado = ?) AND a.deletado = ?', [id_caixa,0,0]).then(data => {
					resolve(data);
				});
			});
	}

	DescobrirCaixaValorPorCaixaId(id_caixa){
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*, \
				REPLACE(REPLACE(REPLACE(FORMAT(a.valor, 2), ".", "@"), ",", "."), "@", ",") as valor_real,\
				(SELECT nome FROM planos as b WHERE a.id_plano = b.id AND b.deletado = ?) as nome_plano \
				FROM caixa as a WHERE id =  ? AND deletado = ?', [0,id_caixa,0]).then(data => {
					resolve(data);
				});
			});
	}


	/*Fim Descobrir*/

	/*Ínicio Selecionar*/

	SelecionarUsuario(id) {
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT * FROM usuarios WHERE id = ? AND deletado = ?", [id,0]).then(data => {
				resolve(data);
			});
		});
	}

	SelecionarCaixa(id) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*, \
				DATE_FORMAT(a.data_cadastro, "%d/%m/%Y") as data_cadastro,DATE_FORMAT(a.data, "%d/%m/%Y") as data,\
				(SELECT nome FROM planos as b WHERE b.id = a.id_plano) as plano,\
				(SELECT nome FROM usuarios as c WHERE c.id = a.id_usuario) as nome_usuario\
				FROM caixa as a WHERE a.deletado = ? and id = ?', [0,id]).then(data => {
					resolve(data);
				});
			});
	}

	SelecionarPlano(id) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.* FROM planos as a WHERE a.id = ? and a.deletado = ?', [id,0]).then(data => {
				resolve(data);
			});
		});
	}

	SelecionarPedidoAporte(id) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*,DATE_FORMAT(data_cadastro, "%d/%m/%Y") as data_cadastro, \
				REPLACE(REPLACE(REPLACE(FORMAT(a.valor, 2), ".", "@"), ",", "."), "@", ",") as valor_real,\
				(SELECT b.nome FROM usuarios as b WHERE b.id = a.id_usuario AND b.deletado = ?) as nome_usuario, \
				(SELECT c.nome FROM planos as c WHERE c.id = a.id_plano AND c.deletado = ?) as plano \
				FROM caixa as a WHERE a.id = ? AND a.deletado = ? AND a.tipo = ? AND a.confirmado = ?', [0,0,id,0,0,0]).then(data => {
					resolve(data);
				});
			});
	}

	SelecionarPedidoSaque(id) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*,DATE_FORMAT(data_cadastro, "%d/%m/%Y") as data_cadastro, \
				REPLACE(REPLACE(REPLACE(FORMAT(a.valor, 2), ".", "@"), ",", "."), "@", ",") as valor_real,\
				(SELECT b.nome FROM usuarios as b WHERE b.id = a.id_usuario AND b.deletado = ?) as nome_usuario, \
				(SELECT c.nome FROM planos as c WHERE c.id = a.id_plano) as plano, \
				(SELECT d.carteira FROM usuarios as d WHERE d.id = a.id_usuario AND d.deletado = ?) as carteira \
				FROM caixa as a WHERE a.id = ? AND a.deletado = ? AND (a.tipo = ? OR a.tipo = ? ) AND a.confirmado = ?', [0,0,id,0,1,3,0]).then(data => {
					resolve(data);
				});
			});
	}

	SelecionarHoje(){
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT DATE_FORMAT(now(),"%Y-%m-%d") as hoje', []).then(data => {
				resolve(data);
			});
		});
	}




	/*Fim Selecionar*/

	/*Ínicio Cadastrar*/

	CadastrarUsuario(POST) {	
		return new Promise(function(resolve, reject) {
			POST.senha = helper.Encrypt(POST.senha);
			helper.Insert('usuarios', POST).then(data => {
				resolve(data);
			});
		});
	}

	CadastrarPlano(POST) {	
		return new Promise(function(resolve, reject) {
			helper.Insert('planos', POST).then(data => {
				resolve(data);
			});
		});
	}

	CadastrarCaixa(POST) {

		if(POST.data != null){
			POST = helper.PrepareDates(POST, ['data']);
		}

		return new Promise(function(resolve, reject) {
			helper.Insert('caixa', POST).then(data => {
				resolve(data);
			});
		});
	}


	/*Fim cadastrar*/

	/*Ínicio Update*/

	AlterarSenhaUsuario(POST) {
		return new Promise(function(resolve, reject) {
			POST.senha = helper.Encrypt(POST.senha);
			helper.Update('usuarios', POST).then(data => {
				resolve(data);
			});
		});
	}

	AtualizarUsuario(POST) {
		return new Promise(function(resolve, reject) {
			helper.Update('usuarios', POST).then(data => {
				resolve(data);
			});
		});
	}

	AtualizarCaixa(POST) {
		if(POST.data != null){
			POST = helper.PrepareDates(POST, ['data']);
		}
		return new Promise(function(resolve, reject) {
			helper.Update('caixa', POST).then(data => {
				resolve(data);
			});
		});
	}

	AtualizarPlano(POST) {
		return new Promise(function(resolve, reject) {
			helper.Update('planos', POST).then(data => {
				resolve(data);
			});
		});
	}

	NegarPedidoAporte(POST) {
		console.log('negar pedido');
		console.log(POST);
		console.log('nnnnnnnnnnnnn');
		return new Promise(function(resolve, reject) {
			helper.Update('caixa', POST).then(data => {
				resolve(data);
			});
		});
	}

	NegarPedidoSaque(POST) {
		return new Promise(function(resolve, reject) {
			helper.Update('caixa', POST).then(data => {
				resolve(data);
			});
		});
	}


	AprovarPedidoAporte(POST) {

		if(POST.data != null){
			POST = helper.PrepareDates(POST, ['data']);
		}

		console.log('aprovar pedido');
		console.log(POST);
		console.log('nnnnnnnnnnnnn');


		return new Promise(function(resolve, reject) {
			helper.Update('caixa', POST).then(data => {
				resolve(data);
			});
		});
	}

	AprovarPedidoSaque(POST) {

		if(POST.data != null){
			POST = helper.PrepareDates(POST, ['data']);
		}

		console.log('aprovar saque');
		console.log(POST);
		console.log('nnnnnnnnnnnnn');


		return new Promise(function(resolve, reject) {
			helper.Update('caixa', POST).then(data => {
				resolve(data);
			});
		});
	}

	/*Fim Update/

	/*Ínicio Desativar*/

	DesativarUsuario(POST) {
		return new Promise(function(resolve, reject) {
			helper.Desativar('usuarios', POST).then(data => {
				resolve(data);
			});
		});
	}

	DesativarCaixa(POST) {
		return new Promise(function(resolve, reject) {
			helper.Desativar('caixa', POST).then(data => {
				resolve(data);
			});
		});
	}

	DesativarPlano(POST) {
		return new Promise(function(resolve, reject) {
			helper.Desativar('planos', POST).then(data => {
				resolve(data);
			});
		});
	}




}
module.exports = AdministracaoModel;