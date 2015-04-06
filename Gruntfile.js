module.exports = function(grunt) {

    grunt.initConfig({

        m2j: {
            blog: {
                files: {
                    'release/posts.json': [ 'articles/*.md' ]
                }
            }
        },

        md2html: {
            blog: {
                files: [
                    {
                        expand: true,
                        src: ['.tmp/*.md'],
                        dest: 'release',
                        ext: '.html'
                    }
                ]
            }
        },

        replace: {
            meta: {
                src: ['articles/*.md'],
                dest: ['.tmp/'],
                replacements: [
                    {from: /^(-{3}(?:\n|\r)([\w\W]+?)-{3}\s*)?/, to: ''}
                ]
            }
        },

        rename: {
            tempfolder: {
                files: [
                    {
                        src: 'release/.tmp',
                        dest: 'release/articles'
                    }
                ]
            }
        },

        remove: {
            tempfolder: {
                dirList: ['.tmp']
            },

            releasefolder: {
                dirList: ['release']
            }
        }

    });

    grunt.loadNpmTasks('grunt-markdown-to-json');
    grunt.loadNpmTasks('grunt-md2html');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-remove');

    grunt.registerTask('default', [
                                   'remove:releasefolder',
                                   'replace:meta',
                                   'md2html:blog',
                                   'm2j:blog',
                                   'rename:tempfolder',
                                   'remove:tempfolder'
                                ]);

};
