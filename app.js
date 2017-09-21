'use strict';

var azbn = new require(__dirname + '/../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var fs = require('fs');
var path = require('path');
var imagemagick = require('imagemagick');

var argv = require('optimist')
	.usage('Usage: $0 --root=[Path to root dir] --maxw=[width] --maxsize=[size kB] --action=[resize|find] --fmask=[filename mask]')
	.default('root', './')
	.default('maxw', 2048)
	.default('maxsize', 1024)
	.default('action', 'find')
	.default('fmask', new RegExp('(.jpg|.png)', 'ig'))
	//.demand(['str'])
	.argv
;

argv.maxw = parseInt(argv.maxw);
argv.maxsize = parseInt(argv.maxsize * 1024);

var _resizer = function(path) {
	
	imagemagick.identify(['-format', '%m.%w.%h', path], function(__err, info){
		
		if (__err) {
			
			azbn.echo(__err);
			return;
			
		} else {
			
			var __p = info.split('.');
			
			var _args = {
				srcPath : path,
				dstPath : path + '_resized.' + __p[0],
				width : argv.maxw,
				//height : maxh,
				format : __p[0],//.format,
			};
			
			if(__p[1] < argv.maxw) {
				_args.width = __p[1];
			}
			
			switch(__p[0]) {
				
				case 'JPEG' : {
					_args.quality = 0.85;
					_args.progressive = true;
				}
				break;
				
				case 'PNG' : {
					//args.quality = 1;
					//args.progressive = true;
				}
				break;
				
				default : {
					
				}
				break;
				
			}
			
			imagemagick.resize(_args, function(___err, stdout, stderr){
				
				if (___err) {
					console.log(___err);
				} else {
					azbn.echo('Resized: ' + path);
				}
				
			});
			
		}
		
		// { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
	});
	
	//next();
	
};

azbn.mdl('fs/tree').walk(argv.root, function(file, stat){
	
	if (stat && stat.isDirectory()) {
		
	} else if(stat) {
		
		var in_masked = -1;
		
		if(argv.fmask != false) {
			in_masked = file.search(argv.fmask);//fmask.test(file);
		}
		
		if(in_masked > 0) {
			
			if(stat.size > argv.maxsize) {
				
				switch(argv.action) {
					
					case 'resize' : {
						
						_resizer(file);
						
					}
					break;
					
					case 'find' : {
						
						console.log(file);
						
					}
					break;
					
					default : {
						
					}
					break;
					
				}
				
			}
			
		}
		
	}
	
}, function(err, results){
	
	//fs.writeFileSync(storage_file, JSON.stringify(storage));
	
	/*
	switch(argv.action) {
		
		case 'check' : {
			
			
			
		}
		break;
		
		case 'index' : 
		default : {
			
			
			
		}
		break;
		
	}
	*/
	
});