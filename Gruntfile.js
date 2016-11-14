var src = './src/';
var dest = './dist/';
var npm = './node_modules/';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scss: {
                files: [src + '**/*.scss'],
                tasks: ['styles']
            },

            js: {
                files: [src + '**/*.js'],
                tasks: ['uglify']
            }
        },

        copy: {
            'html': {
                flatten: true,
                expand: true,
                src: src + '*.html',
                dest: dest
            },

            'images': {
                flatten: true,
                expand: true,
                src: src + 'img/*.svg',
                dest: dest + 'img/'
            }
        },

        sass: {
            options: {
                sourceMap: true,
                includePaths: [npm]
            },

            dist: {
                files: [{
                    expand: true,
                    cwd: src + 'sass',
                    src: ['*.scss'],
                    dest: dest + 'css',
                    ext: '.css'
                }]
            }
        },

        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
                    })
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: dest + 'css',
                    src: '*.css',
                    dest: dest + 'css'
                }]
            }
        },

        cssmin: {
            options: {
                sourceMap: true
            },
            target: {
                files: [{
                    expand: true,
                    cwd: dest + 'css',
                    src: ['*.css', '!*.min.css'],
                    dest: dest + 'css',
                    ext: '.min.css'
                }]
            }
        },

        browserSync: {
            bsFiles: {
                src: [
                    dest + 'css/*.css',
                    dest + '*.html'
                ]
            },

            options: {
                server: {
                    watchTask: true,
                    baseDir: dest,
                    server: dest
                }
            }
        },

        clean: [
            dest + 'css/'
        ],

        uglify: {
            main: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: src + 'js',
                    src: ['*.js', '!*.min.js'],
                    dest: dest + 'js',
                    ext: '.min.js',
                    extDot: 'last'
                }]
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['clean', 'styles', 'uglify', 'copy']);
    grunt.registerTask('styles', ['sass', 'postcss', 'cssmin']);
    grunt.registerTask('dev', ['default', 'browserSync', 'watch']);
};