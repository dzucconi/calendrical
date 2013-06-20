module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    uglify: {
      plugin: {
        files: [{
          "build/ephemerides.min.js": ["src/ephemerides.astro.js", "src/ephemerides.calc.js", "src/ephemerides.calendar.js"]
        }]
      }
    },

    shell: {
      generateDocs: {
        command: "docco src/ephemerides.*.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("build", ["uglify", "shell:generateDocs"]);
};
