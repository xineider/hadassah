'use strict';
var express = require('express');
var app = express();
var Helper = require('./model.js');
var helper = new Helper;

class IndexModel {
	Login(POST) {
		return new Promise(function(resolve, reject) {
			
			helper.Query('SELECT id,nivel,nome FROM usuarios WHERE email = ? AND senha = ?', [POST.email, POST.senha]).then(data => {
				var hash_login = helper.Encrypt(Date());
				data[0].hash_login = hash_login;
				helper.Update('usuarios', {id: data[0].id, hash_login: hash_login}).then(data_up => {
					resolve(data);
				});
			});
		});
	}
}
module.exports = IndexModel;
