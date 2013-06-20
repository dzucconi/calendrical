module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      plugin: {
        files: [{
          'build/ephemerides.min.js': ['src/ephemerides.astro.js', 'src/ephemerides.calc.js', 'src/ephemerides.calendar.js']
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', 'uglify');
};
