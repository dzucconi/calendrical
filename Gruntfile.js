module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    uglify: {
      plugin: {
        files: [{
          "build/calendrical.min.js": ["src/calendrical.*.js"],
          "build/calendrical.astro.min.js": ["src/calendrical.astro.js"],
          "build/calendrical.calendar.min.js": ["src/calendrical.calendar.*.js"]
        }]
      }
    },

    shell: {
      generateDocs: {
        command: "rm docs/*",
        command: "docco src/calendrical.*.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("build", ["uglify", "shell:generateDocs"]);
};
