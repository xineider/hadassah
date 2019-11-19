'use strict';
var express = require('express');
var app = express();
var Helper = require('./model.js');
var helper = new Helper;

class IndexModel {


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

	GetEmpresas() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*,\
				(SELECT b.descricao FROM segmento as b WHERE b.id = a.id_segmento AND b.deletado = ?) as segmento, \
				(SELECT c.sigla FROM regiao as c WHERE c.id = a.id_regiao AND c.deletado = ?) as regiao \
				FROM empresa as a WHERE a.deletado = ?',[0,0,0]).then(data => {
					resolve(data);
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