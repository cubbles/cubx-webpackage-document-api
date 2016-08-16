'use strict';
module.exports = function (grunt) {
  // measures the time each task takes
  require('time-grunt')(grunt);

  // Load the plugin that provides tasks.
  require('load-grunt-tasks')(grunt);

  // Load all custom tasks
  // grunt.loadTasks('tasks');

  // Load grunt configurations
  var options = {
    githooks: {
      all: {
        'pre-commit': 'shell:eslint'
      }
    },
    shell: {
      'docs': {
        command: 'npm run-script generate-docs'
      },
      eslint: {
        command: 'npm run-script lint'
      },
      test: {
        command: 'npm test'
      }
    }
  };
  // Define the configuration for all the tasks
  grunt.initConfig(options);

  // Default server test task.
  grunt.registerTask('default', [
    'githooks'
  ]);

  // Default client test task.
  grunt.registerTask('test', [
    'shell:eslint', 'shell:test'
  ]);
  // Default client test task.
  grunt.registerTask('validateSources', [
    'shell:eslint'
  ]);

  // generate docs
  grunt.registerTask('docs', [
    'shell:docs'
  ]);
};
