var mine_types = {
   'js' : 'text/javascript',
   'html' : 'text/html',
   'css' : 'text/css',
   'jpg' : 'image/jpg',
   'gif' : 'image/gif',
   'png' : 'image/png'
};

function crear(http, url, fs){
	http.createServer(function(peticion, respuesta){
		var ruta_a_archivo= devolverRutaArchivo(url, peticion);
		leerArchivo(fs, ruta_a_archivo, function(numero, contenido_archivo){
			if (numero==404){
				respuesta.writeHead(numero, 'text/plain');
				respuesta.end('Error '+numero+'. El enlace no existe o ha dejado de existir');
			}else if(numero == 500){
				respuesta.writeHead();
				respuesta.end('Error interno');
			}else{
				var extension = ruta_a_archivo.split('.').pop();
				var mine_type= mine_types[extension];
				respuesta.writeHead(numero, {'Content-Type':mine_type});
				respuesta.end(contenido_archivo);
			}
		});
	}).listen(3000, '127.0.0.1');
}

function devolverRutaArchivo(url, peticion){
	var path_nombre = (url.parse(peticion.url).pathname == '/') ? 'index.html' : url.parse(peticion.url).pathname;
	var ruta_a_archivo = 'contenido/'+path_nombre;
	return ruta_a_archivo;
}

function leerArchivo( fs, ruta_a_archivo, callback){
	fs.exists(ruta_a_archivo, function(existe){
		if(existe){
			fs.readFile(ruta_a_archivo,function(error, contenido_archivo){
				if(error){
					callback(500, null);
				}else{
					callback(200, contenido_archivo);
				}
			});
		}else{
			callback(404, null);
		}
	});
}

exports.crear = crear;