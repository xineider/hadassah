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


	VerificarSeTemEmailDisponivel(email){
		return new Promise(function(resolve, reject) {
			helper.Query("SELECT email \
				FROM usuarios WHERE deletado = ? AND email = ?", [0,email]).then(data => {
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







}
module.exports = AdministracaoModel;