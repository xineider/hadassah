// Eventos DOM
$(document).ready(function () {

	console.log('estou aqui no ready do começo');
	adicionarLoader();
	FormatInputs();
	

	$(document).ajaxError(function () {
		AddErrorAjax();
	});
	$(document).ajaxSuccess(function () {
		$('.error_ajax').fadeOut();
	});

	$(document).on('click', '.modal-remover-mount', function (e) {
		e.preventDefault();
		var modal = $(this).data('modal');
		var texto = $(this).data('texto');
		var id = $(this).data('id');
		var to = $(this).data('to');
		var back = $(this).data('back');
		var mensagem_sucesso = $(this).data('mensagem-sucesso');
		console.log('mensagem_sucesso:' + mensagem_sucesso);

		$(modal).modal();
		$(modal).find('#texto').text(texto);
		$(modal).find('#id').val(id);
		$(modal).find('.delete_button').data('href', to).data('action', back).data('mensagem-sucesso',mensagem_sucesso);
	});

	$(document).on('click', '.modal-mount', function (e) {
		e.preventDefault();
		var modal = $(this).data('modal');
		var link = $(this).data('link');
		MountModal(modal, link);
	});

	$(document).on('click', '.ajax-load', function(e) {
		e.preventDefault();
		var link = $(this).attr('href');
		console.log(link);
		GoTo(link, true);
	});

	$(document).on('click', '.ajax-load-to', function(e) {
		e.preventDefault();
		var link = $(this).attr('href');
		var to = $(this).data('to');
		LoadTo(link, to);
	});

	$(document).on('click', '.remove', function (e) {
		e.preventDefault();
		$(this).closest('.pai').remove();
	});

	$(document).on('click', '.ajax-submit', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');
		var sucessMessage = $(this).data('mensagem-sucesso');
		var sucessClass = $(this).data('mensagem-sucesso-color');
		console.log('sucessClass:'+sucessClass);
		if(sucessClass == undefined){
			console.log('estrei aqui no sucessClass');
			sucessClass = 'bg-success';
		}
		if (VerificarForm(form) == true) {
			console.log('o que está indo de fato para o submit ajax de cor')
			console.log(sucessClass);
			SubmitAjax(post, link, back,sucessMessage,sucessClass);
		}
	});

	$(document).on('change', 'input[type="file"]', function () {
		if($(this).val() != '') {
			UploadFile($(this));
		}
	});


	$(document).on('change', '.select_change_container', function(e) {
		
		console.log('----------------- VALOR DO SELECT ---------------');
		console.log($(this).val());
		console.log('-------------------------------------------------');

		console.log('number-appear:'+$(this).data('number-appear'));
		console.log('container:'+$(this).data('container'));
		console.log('link:'+$(this).data('link'));

		if($(this).val() == $(this).data('number-appear')){
			LoadTo($(this).data('link'),$(this).data('container'));
		}else{
			$('.'+$(this).data('container')).empty();
		}		
	});

	$(document).on('submit', 'form', function(e) {
		e.preventDefault();
	});

	$(document).on('change', '.cep', function () {
		GetEndereco($(this).val(), $(this).closest('.row'));
	});



	window.onpopstate = function() {
		GoTo(location.pathname, false);
	};

	$(document).on('click', '.arquivo-escolha', function(e) {
		e.preventDefault();
		var nome = $(this).data('nome');
		$('.uploads').append('\
			<div class="col s12 m6 center-align relative pai">\
			<div class="card-panel grey lighten-4">\
			<input type="hidden" name="tarefa_arquivo[arquivo][]" value="'+nome+'">\
			<button class="btn-floating btn waves-effect waves-light red close-button remove"><i class="fa fa-times" aria-hidden="true"></i></button>\
			<b>Arquivo: '+nome+' <br>\
			</div>\
			</div>\
			');
		$('.modal').modal('close');
	});

});


// Eventos Após DOM

$(window).on('load', function() {
	console.log('removi o loader');
	removerLoader();
	FormatInputs();
});



// Funções
function adicionarLoader() {
	// $('body').css('overflow', 'hidden');
	$('.loader').fadeIn('fast');
	console.log('estou sendo chamado, adicionarLoader()');
}
function removerLoader() {
	console.log('estou sendo chamado, a função de removerLoader');
	$('body').css('overflow', 'auto');
	$('.loader').fadeOut('fast');
}
function InitBar() {
	if (localStorage.bar != 2 && localStorage.bar != 1) {
		localStorage.setItem("bar", 1);
	}
}
function GoTo(link, state) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			console.log('setando');
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
			console.log('requestHeader');
			console.log(request);
			console.log('D:D:D:D:D:D:')
		},
		success: function(data) {
			$('main').html(data);
		},
    error: function(xhr) { // if error occured
    },
    complete: function() {
    	removerLoader();
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	//$('.modal').modal('close');
    	FormatInputs();
    }
});
	if (state == true) {
		window.history.pushState('Sistema Quorp', 'Sistema Quorp', link);
	}
}
function LoadTo(link, to) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			$('.'+to).empty();
			$('.'+to).append(data);
		},
    error: function(xhr) { // if error occured
    },
    complete: function() {
    	removerLoader();
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	//$('.modal').modal('close');
    	FormatInputs();
    }
});
}
function FormatInputs(focus) {
	$('.cnpj').mask('00.000.000/0000-00', {reverse: true});
	$('.cpf').mask('000.000.000-00', {reverse: true});
	$('.rg').mask('AAAAAAAAAAAAA', {reverse: true});
	$('.cep').mask('00000-000');
	$('.tel').mask('(00) Z0000-0000', {
		translation: {
			'Z': {
				pattern: /[0-9]/, optional: true
			}
		}
	});
	$('.money').mask('000000000000000,00', {reverse: true});
	$('.data-sem-hora').mask('00/00/0000');
	validarDataTable($('.tabela_filtrada'));
	$('[data-toggle="tooltip"]').tooltip();
	$('.datepicker').datepicker({
		format:'dd/mm/yyyy',
		language:'pt-BR',
		autoclose:true
	});
}
function GetEndereco(cep, pai) {
	var link = 'https://viacep.com.br/ws/'+cep+'/json/ ';
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			adicionarLoader();
		},
		success: function(data) {
			console.log(data);
			if (data['erro'] == true) {
				alert('CEP não encontrado');
				$(pai).find('.uf').focus();
			} else {
				$(pai).find('.cidade').val(data['localidade']).focus();
				$(pai).find('.rua').val(data['logradouro']).focus();
				$(pai).find('.uf').val(data['uf']).focus();
				$(pai).find('.numero').focus();
			}
		},
    error: function(xhr) { // if error occured
    	alert("CEP não encontrado, utilize somente números");
    	$(pai).find('.uf').focus();
    },
    complete: function() {
    	removerLoader();
    }
});
}


function SubmitAjax(post, link, back,sucessMessage,sucessClass) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				console.log('estou sendo chamado por que deu certo !!!!');
				$('.toast-body').html('<div class="text-center">'+sucessMessage+'</div>');
				/*utilizo o attr para limpar a classe para que não tenha a classe de erro no cadastro que deveria ser o verde*/
				$('.toast').attr('class','toast').addClass(sucessClass).toast({delay:3000}).toast('show')
				if(back != ''){
					GoTo(back, true);
				}
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			removerLoader();
		}
	});
}
function Reestruturar(str) {
	var i = 1;
	$('.'+ str +' > div').each(function () {
		$(this).data('num', ''+i+'');
		i += 1;
	});
	return i;
}
function ActiveMaterializeInput(focus) {
	if (focus != undefined && focus != 'undefined') {
		console.log(focus);
		focus.first().focus();
		return true;
	}
	$('main textarea:not(disabled)').each(function () {
		if ($(this).val() != '') {
			$(this).focus();
		}
	});
	$('main input:not(disabled)').each(function () {
		if ($(this).val() != '') {
			$(this).focus();
			$('main input:not([disabled]):not([type="hidden"])').first().focus();
		}
	});
}
function MountModal(modal, link) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log(link);
			$(modal).find('.modal-content').html(data);
			$(modal).modal('show');
		},
    error: function(xhr) { // if error occured
    	removerLoader();
    },
    complete: function() {
    	removerLoader();
    	FormatInputs();
    }
});
}

function VerificarForm(form) {
	$('.error').remove();
	var qtdErros = 0;
	
	form.find('input:enabled:not([type="hidden"])[required="true"]').each(function(){
		console.log('tem + de um input');
		if(VerificaItem($(this)) == true) {
			console.log('cai aqui no 1° erro')
			qtdErros++;
		};
	});

	if($('#alterar_senha').val() != $('#confirmar_alterar_senha').val())
	{
		console.log('cai no segundo erro');
		console.log('qtdErros:'+qtdErros);
		AddErrorTexto($('#confirmar_alterar_senha'),'Senhas são diferentes');
		qtdErros++;
	}

	form.find('input:enabled:not([type="hidden"])[required="true"][type="email"]').each(function(){
		if($(this).val()!= ''){
			if(!validateEmail($(this).val())){
				console.log('cai no terteiro erro');
				qtdErros++;
				AddErrorTexto($(this),'Email Incorreto!!');
			}
		}
	});
	
	form.find('textarea:enabled[required="true"]').each(function(){
		if(VerificaItem($(this)) == true) {
			console.log('cai no quarto erro');
			qtdErros++;
		};
	});
	
	form.find('select:enabled[required="true"]').each(function(){
		if(VerificaItem($(this)) == true) {
			console.log('cai no quinto erro');
			qtdErros++;
		};
	});
	
	if(qtdErros > 0){
		return false;
	}else if(qtdErros <= 0){
		return true;
	}
}


function VerificaItem(isso) {
	if (isso.val() == '') {
		AddError(isso);
		return true;
	}
}
function AddError(isso) {
	console.log(isso);
	isso.focus().addClass('observe-post').parent().append('<div class="error">Complete corretamente</div>');
}
function AddErrorAjax() {
	$('.error_ajax').fadeIn();
}

function AddErrorTexto(isso,texto) {
	isso.focus().addClass('observe-post').parent().append('<div class="error text-center">'+texto+'</div>');
}

function UploadFile(isso) {
	var link = isso.data('href');
	var formData = new FormData();
	formData.append('arquivo', isso[0].files[0]);

	$.ajax({
		url: link,
		type: 'POST',
		data: formData,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function (data) {
			$('.file-path').val('');
			isso.closest('.row').append('\
				<div class="col s12 m6 center-align relative pai">\
				<div class="card-panel grey lighten-4">\
				<input type="hidden" name="tarefa_arquivo[arquivo][]" value="'+data+'">\
				<button class="btn-floating btn waves-effect waves-light red close-button remove"><i class="fa fa-times" aria-hidden="true"></i></button>\
				<b>Arquivo: '+data+' <br>\
				</div>\
				</div>\
				');
			console.debug(data);
		},
		error: function (xhr, e, t) {
			console.debug((xhr.responseText));
		},
		complete: function() {
			removerLoader();
		}
	});
}

function validarDataTable(elemento){
	if($(elemento).length>0){
		/*Já existe a tabela então não há necessidade de criá-la(senão dá problema)*/
		if($.fn.dataTable.isDataTable(elemento)){
		}else{
			filtrarTabelaDataTablePt(elemento);	
		}
	}
}

function validarDataTableNoSort(elemento){
	if($(elemento).length>0){
		/*Já existe a tabela então não há necessidade de criá-la(senão dá problema)*/
		if($.fn.dataTable.isDataTable(elemento)){
		}else{
			filtrarTabelaDataTablePtNoSort(elemento);	
		}
	}
}

function validateEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function LogSistema(metodo,rota){
	var ip;
	var arrayValores = [];

	$.getJSON("https://api.ipify.org/?format=json", function(e) {
		ip = e.ip;
		arrayValores = [ip,metodo,rota,navigator.userAgent,$('input[name="id_usuario_sessao"]').val()];

		$.ajax({
			url:'/sistema/log',
			type:'POST',
			data:JSON.stringify(arrayValores),
			contentType: 'application/json', 
			beforeSend: function(request) {
			}
		});
	});
}

function filtrarTabelaDataTablePt(tabela){
	$(tabela).DataTable({			
		"paging":   false,
		"order": [],
		language:{
			"decimal":        ",",
			"emptyTable":     "Nenhum registro encontrado",
			"info":           "Mostrando de _START_ até _END_ de _TOTAL_ registros",
			"infoEmpty":      "Mostrando de 0 até 0 de 0 registros",
			"infoFiltered":   "(Filtrados de _MAX_ registros)",
			"infoPostFix":    "",
			"thousands":      ".",
			"lengthMenu":     "_MENU_ resultados por página",
			"loadingRecords": "Carregando...",
			"processing":     "Processando...",
			"search":         "Pesquisar: <i class='fa fa-search primary-text'></i> ",
			"searchPlaceholder":"Pesquisar",
			"zeroRecords":    "Nenhum registro encontrado",
			"paginate": {
				"first":      "Primeiro",
				"last":       "Último",
				"next":       "Próximo",
				"previous":   "Anterior"
			},
			"aria": {
				"sortAscending":  ": Ordenar colunas de forma ascendente",
				"sortDescending": ": Ordenar colunas de forma descendente"
			}
		}	
	});
}

function filtrarTabelaDataTablePtNoSort(tabela){
	$(tabela).DataTable({			
		"paging":   false,
		"aaSorting": [],
		"order": [],
		language:{
			"decimal":        ",",
			"emptyTable":     "Nenhum registro encontrado",
			"info":           "Mostrando de _START_ até _END_ de _TOTAL_ registros",
			"infoEmpty":      "Mostrando de 0 até 0 de 0 registros",
			"infoFiltered":   "(Filtrados de _MAX_ registros)",
			"infoPostFix":    "",
			"thousands":      ".",
			"lengthMenu":     "_MENU_ resultados por página",
			"loadingRecords": "Carregando...",
			"processing":     "Processando...",
			"search":         "Pesquisar: <i class='fa fa-search primary-text'></i> ",
			"searchPlaceholder":"Pesquisar",
			"zeroRecords":    "Nenhum registro encontrado",
			"paginate": {
				"first":      "Primeiro",
				"last":       "Último",
				"next":       "Próximo",
				"previous":   "Anterior"
			},
			"aria": {
				"sortAscending":  ": Ordenar colunas de forma ascendente",
				"sortDescending": ": Ordenar colunas de forma descendente"
			}
		}
	});
}