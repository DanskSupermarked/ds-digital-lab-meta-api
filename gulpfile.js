/**
 * gulp test: Lint, test and coverage threshold
 * gulp tdd: Test and watch
 * gulp coverage: Open browsable coverage report
 */
var gulp = require('gulp');

require('ds-task-test-node')(gulp, {
  lint: {
    src: ['app.js', 'middlewares/**/*.js']
  },
  coverage: {
    src: ['app.js', 'middlewares/**/*.js'],
    threshold: 10 // TODO: delete
  },
  test: {
    src: 'test/**/*.js',
    watch: ['app.js', 'middlewares/**/*.js', 'test/**/*.js']
  }
});
