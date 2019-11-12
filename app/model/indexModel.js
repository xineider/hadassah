'use strict';
var express = require('express');
var app = express();
var Helper = require('./model.js');
var helper = new Helper;

class IndexModel {


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
}
module.exports = IndexModel;