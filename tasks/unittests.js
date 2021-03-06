/*
 * grunt-este
 * https://github.com/este/grunt-este
 * Copyright (c) 2013 Daniel Steigerwald
 */
module.exports = function (grunt) {

  var jsdom = require('jsdom').jsdom;
  var Mocha = require('mocha');
  var path = require('path');
  var previousGlobalKeys = [];
  var requireUncache = require('require-uncache');
  var chai = require('chai');
  var sinonChai = require('sinon-chai');

  // Useful global shortcuts available in every test.
  global.assert = chai.assert;
  global.expect = chai.expect;
  global.sinon = require('sinon');

  // allow bdd test syntax with `should`
  chai.should();
  // sinon used with chai syntax
  chai.use(sinonChai);

  grunt.registerMultiTask('esteUnitTests', 'Super-fast unit testing for Google Closure with Mocha in Node.js',
    function() {

      var options = this.options({
        bootstrapPath: 'bower_components/closure-library/closure/goog/bootstrap/nodejs.js',
        depsPath: 'client/deps.js',
        // TODO: Try to compute it.
        prefix: '../../../../',
        mocha: {
          ui: 'tdd',
          reporter: 'dot',
          globals: [],
          timeout: 100
        }
      });
      var bootstrapPath = path.resolve(options.bootstrapPath);
      var depsPath = path.resolve(options.depsPath);

      // Delete global keys created for one test run.
      // Uncache does not help.
      previousGlobalKeys.forEach(function(key) {
        delete global[key];
      });

      // Need to be uncached.
      requireUncache(bootstrapPath);
      requireUncache(depsPath);

      var globalKeys = Object.keys(global);
      require(bootstrapPath);
      require(depsPath);

      // Mock browser.
      var doc = jsdom();
      global.window = doc.parentWindow;
      global.document = doc.parentWindow.document;
      global.navigator = doc.parentWindow.navigator;

      // React and ReactTestUtils have to required after new jsdom is created.
      // https://github.com/facebook/react/issues/1287
      global.React = require('react');
      global.TestUtils = require('react/addons').addons.TestUtils;

      var testFiles = this.filesSrc;

      // Watch mode, map tests to tested files.
      testFiles = testFiles.map(function(file) {
        if (file.indexOf('_test.') == -1)
          file = file.replace('.', '_test.');
        return file;
      });

      // Watch mode, do nothing for missing test.
      if (testFiles.length == 1 && !grunt.file.exists(testFiles[0])) {
        return;
      }

      // Require tests deps.
      testFiles.forEach(function(testFile) {
        var file = testFile.replace('_test.js', '.js');
        var namespaces = goog.dependencies_.pathToNames[options.prefix + file];
        for (var namespace in namespaces) {
          // TODO: For gulp back to manual resolve because uncache
          // does not work reliable.
          goog.require(namespace);
        }
      });

      previousGlobalKeys = Object.keys(global).filter(function(key) {
        return globalKeys.indexOf(key) == -1;
      });

      var mocha = new Mocha(options.mocha);

      // Workaround for mocha "0 tests complete" issue.
      // github.com/visionmedia/mocha/issues/445#issuecomment-17693393
      mocha.suite.on('pre-require', function(context, file) {
        requireUncache(file);
      });

      testFiles.forEach(function(testFile) {
        mocha.addFile(path.resolve(testFile));
      });

      // Enforce stack on Mocha crash.
      var done = this.async();
      try {
        mocha.run(function(errCount) {
          done(!errCount);
        });
      }
      catch (e) {
        grunt.log.error(e.stack);
        done(false);
      }

    }
  );
};