module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      plugin: {
        files: [{
          'build/ephemerides.min.js': ['ephemerides.astro.js', 'ephemerides.calc.js', 'ephemerides.calendar.js']
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', 'uglify');
};
