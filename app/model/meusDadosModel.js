'use strict';
var express = require('express');
var app = express();
var Helper = require('./model.js');
var helper = new Helper;

class MeusDadosModel {


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
			helper.Query('SELECT ROUND(DATEDIFF(NOW(),data_inicio)/30) as meses_decorridos \
				FROM usuarios_planos \
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

	GetUsuario(id) {
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT * FROM usuarios WHERE id = ? AND deletado = ?", [id,0]).then(data => {
				resolve(data);
			});
		});
	}

	GetPadraoContaBancaria(id) {
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT * FROM conta_bancaria WHERE id_usuario = ? AND deletado = ? AND padrao = ?", [id,0,1]).then(data => {
				resolve(data);
			});
		});
	}

	GetContaBancariaUsuario(id) {
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT a.*, \
				CASE \
				WHEN a.tipo_conta = 0 THEN 'Conta Corrente'\
				WHEN a.tipo_conta = 1 THEN 'Conta Poupança'\
				ELSE 'Erro' END as nome_tipo_conta,\
				(SELECT SUBSTRING(b.banco,7) FROM bancos as b WHERE b.id = a.id_banco) as nome_banco\
				FROM conta_bancaria as a \
				WHERE a.id_usuario = ? AND a.deletado = ?", [id,0]).then(data => {
					resolve(data);
				});
			});
	}

	GetBancos(){
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT a.* \
				FROM bancos AS a WHERE a.deletado = ? \
				ORDER BY a.principal DESC, a.banco ASC", [0]).then(data => {
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

	VerificarSeTemMesmoEmail(POST){
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT email \
				FROM usuarios WHERE deletado = ? AND email = ? AND id = ?", [0,POST.email,POST.id]).then(data => {
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

	VerificarSeSenhaAtualLegitima(id,senhaAtual) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT * FROM usuarios WHERE deletado = ? AND id = ? AND senha = ?', [0, id,senhaAtual]).then(data => {
				resolve(data);
			});
		});
	}

	CadastrarContaBancariaUsuario(POST) {	
		return new Promise(function(resolve, reject) {
			helper.Insert('conta_bancaria', POST).then(data => {
				resolve(data);
			});
		});
	}

	SelecionarContaBancaria(id) {
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT a.* FROM conta_bancaria as a \
				WHERE a.id = ? AND a.deletado = ?", [id,0]).then(data => {
					resolve(data);
				});
			});
	}


	AtualizarContaBancaria(POST) {
		return new Promise(function(resolve, reject) {
			helper.Update('conta_bancaria', POST).then(data => {
				resolve(data);
			});
		});
	}

	DesativarContaBancaria(POST) {
		return new Promise(function(resolve, reject) {
			helper.Desativar('conta_bancaria', POST).then(data => {
				resolve(data);
			});
		});
	}


}
module.exports = MeusDadosModel;