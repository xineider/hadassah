'use strict';
var express = require('express');
var app = express();
var Helper = require('./model.js');
var helper = new Helper;

class AdministracaoModel {

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

	GetUsuariosMenosProprio(id) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*\
				FROM usuarios as a WHERE deletado = ? AND id != ? ORDER BY data_cadastro ', [0,id]).then(data => {
					resolve(data);
				});
			});
	}

	GetPermissoes() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*,\
				CASE\
				WHEN a.nivel = 1 THEN "Administrador"\
				WHEN a.nivel = 2 THEN "Super Usuário"\
				WHEN a.nivel = 3 THEN "Usuário"\
				WHEN a.nivel = 4 THEN "Observador"\
				END as nome_nivel\
				FROM permissoes as a WHERE a.deletado = ? ORDER BY a.data_cadastro ', [0]).then(data => {
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


	SelecionarUsuario(id) {
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT * FROM usuarios WHERE id = ? AND deletado = ?", [id,0]).then(data => {
				resolve(data);
			});
		});
	}

	SelecionarPermissao(id) {
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT * FROM permissoes WHERE id = ? AND deletado = ?", [id,0]).then(data => {
				resolve(data);
			});
		});
	}

	CadastrarUsuario(POST) {	
		return new Promise(function(resolve, reject) {
			POST.senha = helper.Encrypt(POST.senha);
			helper.Insert('usuarios', POST).then(data => {
				resolve(data);
			});
		});
	}

	CadastrarPermissao(POST) {	
		return new Promise(function(resolve, reject) {
			helper.Insert('permissoes', POST).then(data => {
				resolve(data);
			});
		});
	}


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

	AtualizarPermissao(POST) {
		return new Promise(function(resolve, reject) {
			helper.Update('permissoes', POST).then(data => {
				resolve(data);
			});
		});
	}

	DesativarUsuario(POST) {
		return new Promise(function(resolve, reject) {
			helper.Desativar('usuarios', POST).then(data => {
				resolve(data);
			});
		});
	}

	DesativarPermissao(POST) {
		return new Promise(function(resolve, reject) {
			helper.Desativar('permissoes', POST).then(data => {
				resolve(data);
			});
		});
	}


}
module.exports = AdministracaoModel;