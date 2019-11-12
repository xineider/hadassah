'use strict';
var express = require('express');
var app = express();
var Helper = require('./model.js');
var helper = new Helper;

class UsuariosModel {
	SelecionarUsuarios() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT a.*, (SELECT b.nome FROM setores as b WHERE a.id_setor = b.id) as setor \
			 						FROM usuarios as a WHERE a.id != ? AND a.deletado = ?', [1, 0]).then(data => {
				resolve(data);
			});
		});
	}
	SelecionarSetores() {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT * FROM setores WHERE deletado = ?', [0]).then(data => {
				resolve(data);
			});
		});
	}
	SelecionarUsuario(id) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT * FROM usuarios WHERE id = ? AND deletado = ?', [id, 0]).then(data => {
				resolve(data);
			});
		});
	}
	CadastrarUsuario(data) {
		return new Promise(function(resolve, reject) {
			helper.Insert('usuarios', data).then(data => {
				resolve(data);
			});
		});
	}
	AtualizarUsuario(data) {
		return new Promise(function(resolve, reject) {
			helper.Update('usuarios', data).then(data => {
				resolve(data);
			});
		});
	}
	DesativarUsuario(post) {
		return new Promise(function(resolve, reject) {
			helper.Desativar('usuarios', post).then(data => {
				console.log(data);
				resolve(data);
			});
		});
	}
	LoadPerfil(id) {
		return new Promise(function(resolve, reject) {
			helper.Query('SELECT imagem, nome, email, id FROM usuarios WHERE id = ? AND deletado = ?', [id, 0]).then(data => {
				resolve(data);
			});
		});
	}
}
module.exports = UsuariosModel;
