module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    uglify: {
      plugin: {
        files: [{
          "build/ephemerides.min.js": ["src/ephemerides.astro.js", "src/ephemerides.calendar.constants.js", "src/ephemerides.calendar.calc.js", "src/ephemerides.calendar.js"],
          "build/ephemerides.astro.min.js": ["src/ephemerides.astro.js"],
          "build/ephemerides.calendar.min.js": ["src/ephemerides.calendar.constants.js", "src/ephemerides.calendar.calc.js", "src/ephemerides.calendar.js"]
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
