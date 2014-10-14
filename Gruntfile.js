module.exports = function(grunt) {

	// Load all NPM grunt tasks
	require('matchdep').filterAll('grunt-*').forEach( grunt.loadNpmTasks );

	var shell       = require('shelljs');
	var githash     = shell.exec('git rev-parse HEAD', {silent:true}).output.replace("\n","");
	var master_dir  = '/tmp';
	var master_name = 'PimpMyLog-master';
	var master      = master_dir + '/' + master_name;
	var beta_dir    = '/tmp';
	var beta_name   = 'PimpMyLog-beta';
	var beta        = beta_dir + '/' + beta_name;
	var npmpkg      = grunt.file.readJSON('package.json');
	var licence     = "/*! " + npmpkg.name + " - " + npmpkg.version + " - " + githash + "*/\n";
		licence    += "/*\n";
		licence    += " * " + npmpkg.name + "\n";
		licence    += " * " + npmpkg.homepage + "\n";
		licence    += " *\n";
		licence    += " * Copyright (c) " + (new Date()).getFullYear() + " Potsky, contributors\n";
		licence    += " * Licensed under the GPLv3 license.\n";
		licence    += " */";

	/*
	|--------------------------------------------------------------------------
	| Grunt configuration
	|--------------------------------------------------------------------------
	|
	*/
	grunt.initConfig({

		/*
		|--------------------------------------------------------------------------
		| Clean
		|--------------------------------------------------------------------------
		|
		*/
		clean: {
			all  : [ '_build' , '_site' , '_tmp' ],
			dev  : [ '_site' ],
			prod : [ '_build' , '_tmp' ]
		},

		/*
		|--------------------------------------------------------------------------
		| Concatenation
		|--------------------------------------------------------------------------
		|
		*/
		concat: {
			js: {
				src: [
					'bower_components/modernizr/modernizr.js',
					'bower_components/respondJs/dest/respond.src.js',
					'bower_components/jquery/dist/jquery.js',
					'bower_components/jquery.cookie/jquery.cookie.js',
					'bower_components/jquery-zclip/jquery.zclip.js',
					'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
					'bower_components/ua-parser-js/src/ua-parser.js',
					'bower_components/hook/mousewheel.js',
					'bower_components/hook/hook.min.js',
					'bower_components/numeral/numeral.js',
					'bower_components/numeral/languages/*.js',
				],
				dest: '_tmp/pml.js',
				options: {
					separator: ';'
				}
			},
			css: {
				src: [
					'css/main.scss',
					'bower_components/hook/hook.css',
				],
				dest: '_tmp/pml.scss'
			}
		},

		/*
		|--------------------------------------------------------------------------
		| Copy
		|--------------------------------------------------------------------------
		|
		*/
		copy: {
			dev: {
				files: [{
					expand: true,
					src: [
						'cfg/**',
						'img/**',
						'inc/**',
						'lang/**',
						'*.json',
						'*.txt',
						'*.php'
					],
					dest: '_site/'
				}]
			},
			devcss: {
				files: [{
					expand: true,
					src: [ 'css/*.css' ],
					dest: '_site/'
				}],
			},
			devphp: {
				files: [{
					expand: true,
					src: [ '*.php' , 'inc/*', 'cfg/*' , 'lang/*' ],
					dest: '_site/'
				}]
			},
			devfonts: {
				files: [{
					expand  : true,
					cwd     : 'bower_components/bootstrap-sass-official/assets/fonts/',
					src     : [ '**/*' ],
					dest    : '_site/fonts/'
				}]
			},
			devhook: {
				files: [{
					expand: true,
					flatten: true,
					filter: 'isFile',
					src: [
						'bower_components/hook/*.png',
						'bower_components/hook/*.gif'
					],
					dest: '_site/css/'
				}]
			},
			devswf: {
				files: [{
					expand: true,
					flatten: true,
					filter: 'isFile',
					src: ['bower_components/jquery-zclip/ZeroClipboard.swf'],
					dest: '_site/js/'
				}]
			},
			devjs: {
				files: [{
					expand: true,
					flatten: true,
					filter: 'isFile',
					src: [ 'js/**.js' ],
					dest: '_site/js/'
				}]
			},
			installmaster: {
				files: [{
					expand: true,
					cwd: '_build/',
					src: [ '**' ],
					dest: master
				}]
			},
			installmasterREADME: {
				files: [{
					expand: true,
					cwd: '_tools/',
					src: [ 'README.md' ],
					dest: master
				}]
			},
			installbeta: {
				files: [{
					expand: true,
					cwd: '_build/',
					src: [ '**' ],
					dest: beta
				}]
			},
			installbetaREADME: {
				files: [{
					expand: true,
					cwd: '_tools/',
					src: [ 'README.md' ],
					dest: beta
				}]
			},
			prod: {
				files: [{
					expand: true,
					src: [
						'cfg/**',
						'img/**',
						'inc/**',
						'lang/**',
						'config.user.json',
						'*.txt'
					],
					dest: '_build/'
				}]
			},
			prodcss: {
				files: [{
					expand: true,
					src: [
						'css/*.css'
					],
					dest: '_build/'
				}],
				options: {
					processContent: function ( content , srcpath ) {
						return licence + "\n" + content;
					}
				}
			},
			prodfonts: {
				files: [{
					expand  : true,
					cwd     : 'bower_components/bootstrap-sass-official/assets/fonts/',
					src     : [ '**/*' ],
					dest    : '_build/fonts/'
				}]
			},
			prodphp: {
				files: [{
					expand: true,
					src: [
						'inc/*.php',
						'cfg/*.php',
						'*.php'
					],
					dest: '_build/'
				}],
				options: {
					processContent: function ( content , srcpath ) {
						return "<?php\n" + licence + "\n?>\n" + content;
					}
				}
			},
			prodhook: {
				files: [{
					expand: true,
					flatten: true,
					filter: 'isFile',
					src: [
						'bower_components/hook/*.png',
						'bower_components/hook/*.gif'
					],
					dest: '_build/css/'
				}]
			},
			prodswf: {
				files: [{
					expand: true,
					flatten: true,
					filter: 'isFile',
					src: ['bower_components/jquery-zclip/ZeroClipboard.swf'],
					dest: '_build/js/'
				}]
			},
			prodphptmp: {
				expand: true,
				cwd: '_build/',
				src: [
					'index.php',
					'inc/*.php'
				],
				dest: '_tmp/',
				filter: 'isFile'
			},
		},

		/*
		|--------------------------------------------------------------------------
		| Minify HTML
		|--------------------------------------------------------------------------
		|
		*/
		htmlmin: {
			prod: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
					cwd: '_tmp/',
					expand: true,
					src: [
						'index.php',
						'inc/*.php'
					],
					dest: '_build/',
					filter: 'isFile'
				}]
			}
		},


		/*
		|--------------------------------------------------------------------------
		| SASS
		|--------------------------------------------------------------------------
		|
		*/
		sass: {
			prod: {
				options: {
					style : 'compressed'
				},
				files: {
					"_build/css/pml.min.css" : ["_tmp/pml.scss"]
				}
			},
			dev: {
				options: {
					style  : 'nested',
					update : true,
				},
				files: {
					"_site/css/pml.min.css" : ["_tmp/pml.scss"]
				}
			},
		},


		/*
		|--------------------------------------------------------------------------
		| Package access
		|--------------------------------------------------------------------------
		|
		*/
		pkg: grunt.file.readJSON('package.json'),


		/*
		|--------------------------------------------------------------------------
		| Deprecated, inject if/else/endif in code
		|--------------------------------------------------------------------------
		|
		*/
		preprocess : {
			dev : {
				src  : [
					'_site/*.php' ,
					'_site/inc/*.php'
				],
				options : {
					inline : true,
					context: {
						prod:'dev'
					}
				}
			},
			prod : {
				src  : [
					'_build/*.php' ,
					'_build/inc/*.php'
				],
				options : {
					inline : true,
					context: {
						prod:'prod'
					}
				}
			}
		},

		/*
		|--------------------------------------------------------------------------
		| Preprocessing
		|--------------------------------------------------------------------------
		|
		*/
		replace: {
			dev: {
				options: {
					patterns: [
						{ match: 'VERSIONDEVH',	replacement: githash },
						{ match: 'VERSIONDEV',	replacement: '<%= pkg.version %>' }
					]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ['version.js'],
					dest: '_site/'
				}]
			},
			prod: {
				options: {
					patterns: [
						{ match: 'VERSIONDEVH',	replacement: githash },
						{ match: 'VERSIONDEV',	replacement: '<%= pkg.version %>' }
					]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ['version.js'],
					dest: '_build/'
				}]
			}
		},

		/*
		|--------------------------------------------------------------------------
		| Shell
		|--------------------------------------------------------------------------
		|
		*/
		shell: {
			betagitclone: {
				command: [
					'cd "' + beta_dir + '"',
					'git clone git@github.com:potsky/PimpMyLog.git -b beta "' + beta_name + '"'
				].join('&&'),
				options: {
					stdout: true,
					stderr: true
				}
			},
			betagitremove: {
				command: [
					'cd "' + beta + '"',
					'git rm -rf * '
				].join('&&'),
				options: {
					stdout: true,
					stderr: true
				}
			},
			betagitaddcommitpush : {
				command: [
					'a=$(git rev-parse --short HEAD)',
					'cd "' + beta + '"',
					'rm -f config.user.json',
					'git add -A .',
					'git commit -m "grunt install from branch dev commit $a"',
					'git pull origin beta',
					'git push origin beta'
				].join(';'),
				options: {
					stdout: true,
					stderr: true
				}
			},
			mastergitclone: {
				command: [
					'cd "' + master_dir + '"',
					'git clone git@github.com:potsky/PimpMyLog.git -b master "' + master_name + '"'
				].join('&&'),
				options: {
					stdout: true,
					stderr: true
				}
			},
			mastergitremove: {
				command: [
					'cd "' + master + '"',
					'git rm -rf * '
				].join('&&'),
				options: {
					stdout: true,
					stderr: true
				}
			},
			mastergitaddcommitpush : {
				command: [
					'a=$(git rev-parse --short HEAD)',
					'cd "' + master + '"',
					'rm -f config.user.json',
					'git add -A .',
					'git commit -m "grunt install from branch dev commit $a"',
					'git pull origin master',
					'git push origin master'
				].join(';'),
				options: {
					stdout: true,
					stderr: true
				}
			},
			devaddcommitpush : {
				command: [
					'git add -A .',
					'git commit --author=\'Potsky <potsky@me.com>\' -m "prepare to publish on master or beta"',
					'git pull origin dev',
					'git push origin dev'
				].join(';'),
				options: {
					stdout: true,
					stderr: true
				}
			}
		},

		/*
		|--------------------------------------------------------------------------
		| Minify JS
		|--------------------------------------------------------------------------
		|
		*/
		uglify: {
			prodvendor: {
				files: {
					'_build/js/pml.min.js' : ['<%= concat.js.dest %>'],
				},
				options: {
					banner       : licence,
					drop_console : true
				}
			},

			prod: {
				files: {
					'_build/js/main.min.js'      : ['js/main.js'],
					'_build/js/test.min.js'      : ['js/test.js'],
					'_build/js/configure.min.js' : ['js/configure.js'],
				},
				options: {
					banner       : licence,
					drop_console : true
				}
			},

			devvendor: {
				files: {
					'_site/js/pml.min.js' : ['<%= concat.js.dest %>'],
				},
				options : {
					mangle   : false,
					beautify : true
				}
			},

			dev: {
				files: {
					'_site/js/main.min.js'      : ['js/main.js'],
					'_site/js/test.min.js'      : ['js/test.js'],
					'_site/js/configure.min.js' : ['js/configure.js'],
				},
				options : {
					mangle   : false,
					beautify : true
				}
			}
		},

		/*
		|--------------------------------------------------------------------------
		| PHPUnit
		|--------------------------------------------------------------------------
		|
		*/
		phpunit: {
			dev: {
			    options: {
					bin : 'vendor/bin/phpunit'
			    }
			}
		},

		/*
		|--------------------------------------------------------------------------
		| Watch
		|--------------------------------------------------------------------------
		|
		*/
		watch: {
			css: {
				files: [ 'css/**/*.css' , '_tmp/**/*.css' ],
				tasks: [ 'copy:devcss' ]
			},
			cssless: {
				files: [ 'css/**/*.less' ],
				tasks: [ 'less' , 'copy:devcss' ]
			},
			html: {
				files: [ '*.php' , 'inc/*', 'cfg/*' ],
				tasks: [ 'copy:devphp' , 'preprocess:dev' ]
			},
			version: {
				files: [ 'package.json' , 'version.js' ],
				tasks: [ 'checkversion' , 'replace:dev' ]
			},
			js: {
				files: [ 'js/**/*.js' ],
				tasks: [ 'uglify:dev' ]
			},
			vendorjs: {
				files: [ 'bower_components/**/*.js' ],
				tasks: [ 'concat:js' , 'uglify:devvendor' ]
			},
		}
	});


	/*
	|--------------------------------------------------------------------------
	| Tasks
	|--------------------------------------------------------------------------
	|
	*/
	// Installation task which install the _build folder in beta , commit and push
	grunt.registerTask( 'installbeta' , function() {
		if ( grunt.file.exists( '_build/index.php' ) === false ) {
			grunt.verbose.or.error().error( 'File "_build/index.php" does not exist. Please build before installing with "grunt build"' );
			grunt.fail.warn('Unable to continue');
		}
		else if ( grunt.file.exists( beta + '/.git/config' ) === false ) {
			grunt.log.writeln('Cloning and installing in ' + beta );
			grunt.task.run(['shell:betagitclone']);
			grunt.task.run([
				'shell:devaddcommitpush',
				'shell:betagitremove',
				'copy:installbeta',
				'copy:installbetaREADME',
				'shell:betagitaddcommitpush'
			]);
		}
		else {
			grunt.log.writeln('Installing in ' + beta );
			grunt.task.run([
				'shell:devaddcommitpush',
				'shell:betagitremove',
				'copy:installbeta',
				'copy:installbetaREADME',
				'shell:betagitaddcommitpush'
			]);
		}
	});

	// Installation task which install the _build folder in master , commit and push
	grunt.registerTask( 'installmaster' , function() {
		if ( grunt.file.exists( '_build/index.php' ) === false ) {
			grunt.verbose.or.error().error( 'File "_build/index.php" does not exist. Please build before installing with "grunt build"' );
			grunt.fail.warn('Unable to continue');
		}
		else if ( grunt.file.exists( master + '/.git/config' ) === false ) {
			grunt.log.writeln('Cloning and installing in ' + master );
			grunt.task.run(['shell:mastergitclone']);
			grunt.task.run([
				'shell:devaddcommitpush',
				'shell:mastergitremove',
				'copy:installmaster',
				'copy:installmasterREADME',
				'shell:mastergitaddcommitpush'
			]);
		}
		else {
			grunt.log.writeln('Installing in ' + master );
			grunt.task.run([
				'shell:devaddcommitpush',
				'shell:mastergitremove',
				'copy:installmaster',
				'copy:installmasterREADME',
				'shell:mastergitaddcommitpush'
			]);
		}
	});

	// Development task, build and watch for file modification
	grunt.registerTask( 'dev' , function() {
		grunt.task.run('checkversion');
		grunt.task.run([
			'clean:dev',

			'copy:devfonts',
			'copy:devswf',
			'copy:devhook',
			'copy:dev',

			'replace:dev',

			'preprocess:dev',

			'copy:devcss',
			'concat:css',
			'sass:dev',

			'concat:js',
			'uglify:dev',
			'uglify:devvendor'
		]);
		grunt.task.run('watch');
	});

	// Build task for production
	grunt.registerTask( 'prod' , function() {
		grunt.task.run('checkversion');
		grunt.task.run([
			'clean:prod',

			'copy:prodfonts',
			'copy:prodswf',
			'copy:prodhook',
			'copy:prod',

			'replace:prod',

			'copy:prodphp',
			'copy:prodphptmp',
			'htmlmin',
			'preprocess:prod',

			'copy:prodcss',
			'concat:css',
			'sass:prod',

			'concat:js',
			'uglify:prod',
			'uglify:prodvendor',

			'phpunit:dev'
		]);
	});

	grunt.registerTask('checkversion', function() {
		var a;
		try {
			a = JSON.parse( grunt.file.read('./version.js').replace('/*PSK*/pml_version_cb(/*PSK*/','').replace('/*PSK*/);/*PSK*/','') );
			if ( ! a.changelog[ npmpkg.version ] ) {
				grunt.verbose.or.error().error( 'Version ' + npmpkg.version + ' is not in the changelog in file version.js!' );
				grunt.fail.warn('Unable to continue');
			}
		} catch (e) {
			grunt.verbose.or.error().error( 'version.js is invalid!' );
			grunt.fail.warn('Unable to continue');
		}
	});

	/*
	|--------------------------------------------------------------------------
	| Shortcuts
	|--------------------------------------------------------------------------
	|
	*/
	grunt.registerTask( 'build'              , function() { grunt.task.run( 'prod' ); });
	grunt.registerTask( 'test'               , function() { grunt.task.run( 'prod' ); });
	grunt.registerTask( 'install'            , function() { grunt.task.run( 'installbeta' ); });
	grunt.registerTask( 'install-production' , function() { grunt.task.run( 'installmaster' ); });
	grunt.registerTask( 'default' , [ 'dev' ] );
};
