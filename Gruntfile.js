module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    uglify: {
      options: {
          // banner: "<%= meta.banner %>",
        compress: {
          drop_console: true,
          sequences: true, // join consecutive statemets with the “comma operator”
          properties: true, // optimize property access: a["foo"] → a.foo
          dead_code: true, // discard unreachable code
          drop_debugger: true, // discard “debugger” statements
          unsafe: false, // some unsafe optimizations (see below)
          conditionals: true, // optimize if-s and conditional expressions
          comparisons: true, // optimize comparisons
          evaluate: true, // evaluate constant expressions
          booleans: true, // optimize boolean expressions
          loops: true, // optimize loops
          unused: true, // drop unused variables/functions
          hoist_funs: true, // hoist function declarations
          hoist_vars: false, // hoist variable declarations
          if_return: true, // optimize if-s followed by return/continue
          join_vars: true, // join var declarations
          cascade: true, // try to cascade `right` into `left` in sequences
          side_effects: true, // drop side-effect-free statements
          warnings: true
        },
        report: "gzip"
      },
      plugin: {
        files: [ {
          "build/calendrical.min.js": [ "src/calendrical.*.js" ],
          "build/calendrical.astro.min.js": [ "src/calendrical.astro.js" ],
          "build/calendrical.calendar.min.js": [ "src/calendrical.calendar.*.js" ]
        } ]
      }
    },

    shell: {
      generateDocs: {
        command: "docco src/calendrical.*.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("build", [ "uglify", "shell:generateDocs" ]);
  grunt.registerTask("default", "build");
};
