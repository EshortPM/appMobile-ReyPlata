document.addEventListener("orientationchange",orientationChange,false);
document.addEventListener("deviceready", onDeviceReady, false);

function orientationChange(){
	var orientado_actual = (inArray(window.orientation, [0,180])) ? 'portrait' : 'landscape';
	ajustaCentroFotos();
}
orientationChange();

function showAlert(text){navigator.notification.alert(text,null,nombreApp,txt_btn_aceptar);}


/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ DEVICE READY */
function onDeviceReady() {
	
	pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;

	if (localStorage.getItem('n')){
		var nomberLoc = localStorage.getItem('n');
		var telefonoLoc = localStorage.getItem('t');
		var cpLoc = localStorage.getItem('c');
		var emailLoc = localStorage.getItem('e');
		$("#nombre").val(nomberLoc);
		$("#telefono").val(telefonoLoc);
		$("#cp").val(cpLoc);
		$("#email").val(emailLoc);
		$("#nombre, #cp, #telefono, #email").prop('readonly', true);
	}

	$(".input_, .textarea_, .select_").on('click keydown',function(){clearError();});
	
	$("#descripcion").keydown(function(e){
		var code = e.keyCode || e.which;
		if(code == 9) e.preventDefault();
	});
	
	
	$(".inputBackground").swipe({
		tap:function(event, target) {
			var id = $(this).attr('id');
			var id_new= id.substr(3,(id.length - 3));
			$("#"+id_new).focus();
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});

	$('.input_').on("focus", function(){
		if (localStorage.getItem('n')){
			navigator.notification.confirm(txt_msj_borrarLoc, function(btn){
				if (btn == 1){
					//borramos LocalStorage
					localStorage.removeItem('n');
					localStorage.removeItem('t');
					localStorage.removeItem('c');
					localStorage.removeItem('e');
					$("#nombre, #cp, #telefono, #email").val('').prop('readonly', false);
					$("#nombre").focus();
				}else{
					$("#objeto").focus();
				}
			}, nombreApp, txt_btn_si+','+txt_btn_no );
		}
	});
	
	$("#terminos_check").swipe({
		tap:function(event, target) {
			clearError();
			if (user.terminos == 'No'){
				$("#terminos_check img").attr('src','img/chek_on.png');
				user.terminos = 'Si';
			}else{
				$("#terminos_check img").attr('src','img/chek_off.png');
				user.terminos = 'No';	
			}
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	$("#terminosLink").swipe({
		tap:function(event, target) {
			clearError();
			muestraHelp(3);
			$("#terminos_check img").attr('src','img/chek_on.png');
			user.terminos = 'Si';
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	
	
	$(".btnCapture").swipe({
		tap:function(event, target) {
			clearError();
			if (cargandoPhoto == 0){
				fancyShow('loader');
				cargandoPhoto = 1;
				var id = $(this).attr('id');
				numPhoto = parseInt(id.substr(-1,1));
				capturePhoto();
			}
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	$(".btnFind").swipe({
		tap:function(event, target) {
			clearError();
			if (cargandoPhoto == 0){
				fancyShow('loader');
				cargandoPhoto = 1;
				var id = $(this).attr('id');
				numPhoto = parseInt(id.substr(-1,1));
				getPhoto(pictureSource.PHOTOLIBRARY);
			}
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	$("#btnContinuar").swipe({
		tap:function(event, target) {
        	clearError();
			if (comprobandoDatos == 0){
				comprobandoDatos = 1;
				clearError();
				//verificamos los datos
				user.nombre = $.trim($("#nombre").val());
				user.cp = $.trim($("#cp").val());
				user.telefono = $.trim($("#telefono").val());
				user.telefono = user.telefono.replace(/\'/g,'');
				user.email = $.trim($("#email").val());
				user.email = user.email.replace(/\'/g,'');
				user.objeto = $.trim($("#objeto").val());
				user.descripcion = $.trim($("#descripcion").val());
				
				var okDatos = true;
				
				if ((user.nombre == '') && okDatos) {
					txtError(txt_error_nombre_vacio);
					okDatos = false;
				}
				
				if (okDatos){
					if (user.telefono == '') {
						txtError(txt_error_telefono_vacio);
						okDatos = false;
					}else{
						user.telefono = user.telefono.replace(/[^\d]/g, "");
						if (user.telefono.length != 9){
							txtError(txt_error_telefono_error);
							okDatos = false;
						}else{
							var inicio_tel = user.telefono.substring(0,1);
							if(!inArray(inicio_tel,['6','7','8','9'])) {
								txtError(txt_error_telefono_error);
								okDatos = false;
							}
						}
					}
				}
	
				if (okDatos){
					if (user.cp == ''){
						txtError(txt_error_cp_vacio);
						okDatos = false;
					}else{
						user.cp = user.cp.replace(/[^\d]/g, "");
						if (user.cp.length != 5){
							txtError(txt_error_cp_error);
							okDatos = false;
						}
					}
				}
				
				if ((user.email != '') && okDatos) {
					user.email = user.email.toLowerCase();
					if (!validarEmail(user.email) && okDatos) {
						txtError(txt_error_email_novalido);
						okDatos = false;
					}
				}
				
				if ((user.objeto == '')&&okDatos){
					txtError(txt_error_objeto_vacio);
					okDatos = false;
				}
				
				if ((user.terminos == 'No')&&okDatos){
					txtError(txt_error_terminos);
					okDatos = false;
				}
				
				$("#nombre").val(user.nombre);	
				$("#apellidos").val(user.apellidos);
				$("#telefono").val(user.telefono);	
				$("#email").val(user.email);
				$("#descripcion").val(user.descripcion);
				
				
				if (okDatos){
					//miramos que no este en focus
					var focusInput = $(".input_").is(':focus');
					if (focusInput) {okDatos = false;$(".input_").blur();}
					var focusTextArea = $(".textarea_").is(':focus');
					if (focusTextArea) {okDatos = false; $(".textarea_").blur();}
					var focusSelect = $(".select_").is(':focus');
					if (focusSelect) {okDatos = false; $(".select_").blur();}
				}
				
				//okDatos = true;
				
				if (okDatos){
					
					$("#page-right").stop().animate({
						left: "0px"
					}, 500, function() {
						comprobandoDatos = 0;
					});
								
				}else{
					comprobandoDatos = 0;
				}
			}
        },
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	$("#btnBack").swipe({
		tap:function(event, target) {	
			clearError();
			//enviamos los datos y si no hay errorpasamos a subir las fotos
			$("#page-right").stop().animate({
				left: "100%"
			}, 500, function() {
				// Animation complete.
			});
			
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	$(".btnSettings").swipe({
		tap:function(event, target) {
			clearError();
			$("#page-settings").stop().animate({
				left: "0px"
			}, 500, function() {
				// Animation complete.
			});
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	$("#btnSettings_back").swipe({
		tap:function(event, target) {
			clearError();
			$("#page-settings").stop().animate({
				left: "100%"
			}, 500, function() {
				// Animation complete.
			});
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	$("#btnHelp_back").swipe({
		tap:function(event, target) {
			$("#page-help").stop().animate({
				left: "100%"
			}, 500, function() {
				// Animation complete.
			});
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	$("#btnRecAmigo").swipe({
		tap:function(event, target) {
			window.location.href = "mailto:?subject="+mail_recAmigo_subject+"&body="+mail_recAmigo_body;
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	
	
	$("#btnHelp").swipe({
		tap:function(event, target) {
			muestraHelp(1);
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	$("#btnAttCliente").swipe({
		tap:function(event, target) {
			muestraHelp(2);
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	$("#btnAvisoLegal").swipe({
		tap:function(event, target) {
			muestraHelp(3);
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	$("#btnAcerca").swipe({
		tap:function(event, target) {
			muestraHelp(4);
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	$("#btnSend").swipe({
		tap:function(event, target) {
			clearError();
			$("#btnSend").hide();
			$("#btnSend_off").show();
			
			//mostramos un loader
			fancyShow('loader');
			
			var cargando_fotos = false;
			
			for (var cont=1; cont < 4; cont++){
				if (photosCamera[cont] != ''){
					uploadPhoto(photosCamera[cont], cont);
					cargando_fotos = true;
					cont = 4;
				}else{
					user.img[cont] = '';
				}
			}
			
			if (!cargando_fotos){
				fancyClose();
				navigator.notification.confirm(txt_error_data_noImage, envioDatosUser_noImg, nombreApp, txt_btn_aceptar+','+txt_btn_cancelar );
			}
		},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});
	
	/*device={name,cordova,platform,uuid,model,version}*/
	//ios7
	if ((device.platform == 'iOS') && (parseInt(device.version) >= 7)) {/*hay que dejarle 20px en el top de espaciado*/}
	
	user.device = {
		'name':device.name,
		'cordova':device.cordova,
		'platform':device.platform,
		'uuid':device.uuid,
		'model':device.model,
		'version':device.version
	};
		
	//permite el placeholder en los numeros
	$("input[type='number']").each(function(i, el) {
	    el.type = "text";
	    el.onfocus = function(){this.type="number";};
	    el.onblur = function(){this.type="text";};
	});
	
	$("#btnAppBrowser").swipe({
		tap:function(event, target) {
			iabRef = window.open(urlinAppBrowser,'_blank');
			iabRef.addEventListener('loadstart', iabLoadStart);
       		iabRef.addEventListener('loadstop', iabLoadStop);
        	iabRef.addEventListener('exit', iabRefClose);
       	},
		excludedElements:"button, input, select, textarea, .noSwipe"
	});

}
/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ DEVICE READY */


function iabLoadStart(event) {/*alert(event.type + ' - ' + event.url);*/}

function iabLoadStop(event) {/*alert(event.type + ' - ' + event.url);*/}

function iabRefClose(event) {
     //alert(event.type);
     iabRef.removeEventListener('loadstart', iabLoadStart);
     iabRef.removeEventListener('loadstop', iabLoadStop);
     iabRef.removeEventListener('exit', iabRefClose);
}

function iabMailClose(event) {
     //alert(event.type);
     iabMail.removeEventListener('loadstart', iabLoadStart);
     iabMail.removeEventListener('loadstop', iabLoadStop);
     iabMail.removeEventListener('exit', iabMailClose);
}

function muestraHelp(num){
	for (var i=1; i<5; i++){if (i == num) $("#helpContent_"+i).show(); else $("#helpContent_"+i).hide();}
	$("#page-help").animate({
		left: "0px"
	}, 500, function() {
		// Animation complete.
	});
}

function savedLocal(){
	localStorage.setItem('n',user.nombre);
	localStorage.setItem('t',user.telefono);
	localStorage.setItem('c',user.cp);
	localStorage.setItem('e',user.email);
	$("#nombre, #cp, #telefono, #email").prop('readonly', true);
}


function uploadPhoto(imageURI, numPhoto) {
	var timePhoto = new Date();
	var fechaPhoto = timePhoto.getTime();
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    var params = new Object();
    params.value1 = user.device.uuid;
    params.value2 = numPhoto;
    params.value3 = fechaPhoto;
    user.img[numPhoto] = fechaPhoto;
    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(urlUploadPhoto), win, fail, options); //(path de la imagen, URL de la imagen, funcion exitosa, funcion erronea, parametro opcionales)
}
function win(r) {
    //alert("Code = " + r.responseCode + "Response = " + r.response + "Sent = " + r.bytesSent);
    if (r.response == 'error'){
    	fancyClose();
		showAlert(txt_error_uploadPhoto);
		$("#btnSend").show();
		$("#btnSend_off").hide();
    }else{
    	var nextNum = parseInt(r.response) + 1;
    	if (nextNum < 4) cargaSiguienteImagen(nextNum);
    	if (nextNum == 4) envioDatosUser();
    }
}
function cargaSiguienteImagen(num){
	if ( photosCamera[num] != ''){
		uploadPhoto(photosCamera[num], num);
	}else{
		user.img[num] = '';
		var nextNum = num + 1;
		if (nextNum < 4) cargaSiguienteImagen(nextNum);
		if (nextNum == 4) envioDatosUser();
	}
}
function fail(error) {
	fancyClose();
    //showAlert("An error has occurred: Code = " = error.code);
    showAlert(txt_error_uploadPhoto);
    $("#btnSend").show();
	$("#btnSend_off").hide();
}



function envioDatosUser_noImg(btn){
	if(btn == 1){
		fancyShow('loader');
		envioDatosUser();
	}else{
		$("#btnSend").show();$("#btnSend_off").hide();
	}
}


function envioDatosUser(){
	$.ajax({
		type: 'GET',
		url: urlSendForm,
		contentType: "application/json",
		dataType: 'jsonp',
		crossDomain: true,
		data: {user:user},
		beforeSend: function ( xhr ) {
			//show your image loader here
		},
		success: function ( data ) {
			if( data.status == 'saved' ) {
				savedLocal();
				fancyClose();
				navigator.notification.confirm(txt_msj_register, function(btn){
					if (btn == 2){
						resetAplication();
						if(navigator.app){
							navigator.app.exitApp();
						}else if(navigator.device){
						    navigator.device.exitApp();
						}
					}else{
						resetPhotos();
						$("#btnSend").show();
						$("#btnSend_off").hide();
						resetObject();
					}
				}, nombreApp, txt_btn_si+','+txt_btn_no );
			}else{
				fancyClose();
				showAlert(txt_error_register);
				$("#btnSend").show();
				$("#btnSend_off").hide();
			}
		}
	});
}

function txtError(text){$(".txterror").html(text);}
function clearError(){$(".txterror").html('');}

function creaImagen(numPhoto){
	$("#tamanoImg"+numPhoto).html("").css({'width':'100%','height':'auto', 'margin':'0'});
	$("#tamanoImg"+numPhoto).append('<img id="smallImage'+numPhoto+'" style="width:100%;margin:0;padding:0;" src="'+photosCamera[numPhoto]+'" />');
	$("#smallImage"+numPhoto).on('load', function(){
		//alert('cargada la imagen');
		$("#imgVista_"+numPhoto).css({'background-image':'none', 'background-color':'#000'});
		redimensionaFoto(numPhoto);
	});
}

function redimensionaFoto(numPhoto){
	setTimeout(function(){
		var alto_img = parseInt($("#tamanoImg"+numPhoto).css("height"));
		var alto_vent = parseInt($("#imgVista_"+numPhoto).css("height"));
		if (alto_img > 0){
			if (alto_img > alto_vent){
				$("#smallImage"+numPhoto).css({'width':'auto','height':'100%'});
				$("#tamanoImg"+numPhoto).css({'width':'auto','height':'100%', 'margin':'0 auto'});
				ajustaCentroFotos();
			}else if (alto_img < alto_vent){
				var tamano_dif = (alto_vent - alto_img)/2;
				var tamano_dif_txt = tamano_dif + 'px';
				$("#tamanoImg"+numPhoto).css({
					'margin-top':tamano_dif_txt
				});
			}
		}
		fancyClose();
		cargandoPhoto = 0;
	},500);
}

function ajustaCentroFotos(){
	for (var i=1; i<=3 ; i++){
		var alto_img = parseInt($("#tamanoImg"+i).css("height"));
		var alto_vent = parseInt($("#imgVista_"+i).css("height"));
		var ancho_img = parseInt($("#tamanoImg"+i).css("width"));
		var ancho_vent = parseInt($("#imgVista_"+i).css("width"));
		if (alto_img > 0){
			if (ancho_img == ancho_vent){
				//es landscape image
				var tamano_dif = (alto_vent - alto_img)/2;
				var tamano_dif_txt = tamano_dif + 'px';
				$("#tamanoImg"+i).css({
					'margin-top':tamano_dif_txt
				});
		
			}else{
				//es portarit image
				var tamano_dif = (ancho_vent - ancho_img)/2;
				var tamano_dif_txt = tamano_dif + 'px';
				$("#tamanoImg"+i).css({
					'margin-left':tamano_dif_txt
				});
		
			}
		}
	}
}


function onPhotoDataSuccess(imageData) {
	photosCamera[numPhoto] = 'data:image/jpeg;base64,'+imageData;
	creaImagen(numPhoto);
}

function onPhotoURISuccess(imageURI) {
	photosCamera[numPhoto] = imageURI;
	creaImagen(numPhoto);
}


function capturePhoto() {
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {
		//quality: 50,
		quality: 30,
		targetWidth:800,
		targetHeight:600,
		destinationType: destinationType.FILE_URI
	});
}

function getPhoto(source) {
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {
		//quality: 50,
		quality: 30,
		destinationType: destinationType.FILE_URI,
		sourceType: source 
	});
}

function onFail(message) { // Called if something bad happens.
	fancyClose();
	cargandoPhoto = 0;
	showAlert(txt_error_uploadPhoto);
	//showAlert('Failed: ' + message);
}

function fancyClose(){
	var ok = true;
	if (ok) $("#fancy").hide();
}

function fancyOculta(ventana){
	var ventanas = [];
	ventanas[1] = "#loader";
	for (var cont=1; cont <= 1; cont++){if (ventana != ventanas[cont]) $(ventanas[cont]).hide();}
}

function fancyShow(ventana){
	fancyOculta('#'+ventana);
//--------------------------------------------------------------------------------------------------------
	if (ventana == 'loader') $('#'+ventana).show();
//--------------------------------------------------------------------------------------------------------
	$("#fancy").show();
	$("body").animate({scrollTop : 0},500);
}

function resetPhotos(){
	for (var cont=1; cont<4; cont++){
		user.img[cont] = '';
		photosCamera[cont] = '';
		$("#tamanoImg"+cont).html("").css({'width':'100%','height':'auto', 'margin':'0'});
		$("#imgVista_"+cont).css({'background-image':'url(img/fondo_fotos.png)', 'background-color':'transparent'});
	}
}

function resetObject(){
	$("#page-right").css("left","100%");
	$("#objeto option[value='']").prop('selected', true);
	$("#descripcion").val('');
}

function resetAplication(){
	resetPhotos();
	fancyClose();
	clearError();
	$("#btnSend").show();
	$("#btnSend_off").hide();
	$("#page-right").css("left","100%");
	//$("#nombre, #cp, #telefono, #email, #descripcion").val('');
	$("#descripcion").val('');
	$("#objeto option[value='']").prop('selected', true);
	$("#terminos_check img").attr('src','img/chek_off.png');
	user.terminos = 'No';
}