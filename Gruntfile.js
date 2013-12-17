module.exports = function(grunt) {
	// Load all NPM grunt tasks
	require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration
	grunt.initConfig({

		// Clean target directories
		clean: {
			dev: [ 'dist' , 'fonts' , 'tmp' ],
			all: [ 'upload/thumbs', 'dist' , 'fonts' , 'tmp' ]
		},

		// Concat
		concat: {
			js: {
				src: [
					'bower_components/jquery/jquery.js',
					'bower_components/bootstrap/js/affix.js',
					'bower_components/bootstrap/js/alert.js',
					'bower_components/bootstrap/js/button.js',
					'bower_components/bootstrap/js/carousel.js',
					'bower_components/bootstrap/js/collapse.js',
					'bower_components/bootstrap/js/dropdown.js',
					'bower_components/bootstrap/js/modal.js',
					'bower_components/bootstrap/js/scrollspy.js',
					'bower_components/bootstrap/js/tab.js',
					'bower_components/bootstrap/js/tooltip.js',
					'bower_components/bootstrap/js/popover.js',
					'bower_components/bootstrap/js/transition.js',
					'bower_components/JAIL/src/jail.js',
					'bower_components/fastclick/lib/fastclick.js',
					'js/**/*.js'
				],
				dest: 'dist/global.js',
				options: {
					separator: ';'
				}
			},
			css: {
				src: ['css/**/*.css' , 'tmp/**/*.css' ],
				dest: 'dist/global.css'
			}
		},

		// Copy files
		copy: {
			bsfoots: {
				files: [{
					expand: true,
					flatten: true,
					src: ['bower_components/bootstrap/dist/fonts/*'],
					dest: 'fonts/',
					filter: 'isFile'
				}]
			}
		},

		// Make thumbs for blog posts
		cropthumb: {
			thumbs: {
				options: {
					width: 100,
					height: 100,
					cropAmount: 0,
					overwrite: false
				},
				files: [{
					expand: true,
					cwd: '<%= meta.postimages %>',
					src: [ '*.png' , '*.jpg' , '*.gif' ],
					dest: '<%= meta.postthumbs %>',
					filter: 'isFile'
				}]
			}
		},

		// Minify CSS
		cssmin: {
			minify: {
				files: {
					'dist/global.min.css': ['<%= concat.css.dest %>']
				}
			}
		},

		// Run Jekyll commands
		jekyll: {
			server: {
				options: {
					serve: true,
					watch: true
				}
			},
			build: {
				options: {
					serve: false
				}
			}
		},

		// LESS files to CSS
		less: {
			convert: {
				files: {
					"tmp/style.css" : ["css/style.less"]
				}
			}
		},

		// Reload my Safari on change
		macreload: {
			safari: {
				browser: 'safari',
			}
		},

		// Define files
		meta: {
			css: [
				'css/**/*.css',
				'tmp/**/*.css'
			],
			js: [
				'js/**/*.js'
			],
			less: [
				'css/**/*.less',
			],
			postimages: 'upload/images/',
			postthumbs: 'upload/thumbs/'
		},

		// Make pkg available
		pkg: grunt.file.readJSON('package.json'),

		// Minify JS
		uglify: {
			options: {
				// the banner is inserted at the top of the output
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/global.min.js': ['<%= concat.js.dest %>']
				}
			}
		},

		// Watch files for changes
		watch: {
			css: {
				files: ['<%= meta.css %>'],
				tasks: ['concat:css','cssmin']
			},
			js: {
				files: ['<%= meta.js %>'],
				tasks: ['concat:js','uglify']
			},
			less: {
				files: ['<%= meta.less %>'],
				tasks: ['less']
			},
//			jekyll: {
//				files: ['_site/**/*.html'],
//				tasks: ['macreload']
//			},
			postimages: {
				files: ['<%= meta.postimages %>/*'],
				tasks: ['cropthumb:thumbs'],
			},
			postthumbs: {
				files: ['<%= meta.postthumbs %>/*'],
				tasks: ['cropthumb:thumbs'],
				options: {
					event:['deleted']
				}
			}
		}
	});

	// Debug Task
	grunt.registerTask('dev', function() {
		grunt.task.run([
			'clean:dev',
			'copy',
			'less',
			'concat',
			'cssmin',
			'uglify',
			'cropthumb:thumbs',
		]);
		grunt.task.run('watch');
	});

	// Jekyll aliases
	grunt.registerTask('server-prod', function() {
		grunt.log.writeln('Launching Jekyll PROD Server');
		process.env.JEKYLL_ENV = 'prod';
		grunt.task.run( 'jekyll:server' );
	});
	grunt.registerTask('server-dev', function() {
		grunt.log.writeln('Launching Jekyll DEV Server');
		grunt.task.run( 'jekyll:server' );
	});
	grunt.registerTask('server', 'server-dev');
	grunt.registerTask('build-prod', function() {
		grunt.log.writeln('Launching Jekyll PROD Build');
		process.env.JEKYLL_ENV = 'prod';
		grunt.task.run( 'jekyll:build' );
	});
	grunt.registerTask('build-dev', function() {
		grunt.log.writeln('Launching Jekyll DEV Build');
		grunt.task.run( 'jekyll:build' );
	});
	grunt.registerTask('build', 'server-prod');

	grunt.registerTask('default', [ 'dev' ] );

};
