module.exports = function (config) {
  "use strict";

  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'angular-directive-percentage.js',
      'test/angular-directive-percentage.spec.js'
    ],
    reporters: [
      'progress',
      'coverage',
      'coveralls'
    ],
    preprocessors: {
      'angular-directive-percentage.js': ['coverage']
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    client: {
      mocha: {
        timeout: 2000
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
