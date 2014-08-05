# grunt-este [![Build Status](https://secure.travis-ci.org/steida/grunt-este.png?branch=master)](http://travis-ci.org/steida/grunt-este) [![Dependency Status](https://david-dm.org/steida/grunt-este.png)](https://david-dm.org/steida/grunt-este) [![devDependency Status](https://david-dm.org/steida/grunt-este/dev-status.png)](https://david-dm.org/steida/grunt-este#info=devDependencies)

## Intro
Original autor ended support for grunt-este package because he migrated to gulp.js (see. https://github.com/steida/grunt-este). And because I'm using `grunt-este` at some projects and need some modifications, I tried to made this fork.

## Fork differencies ##
  
### esteUnitTests ###
  - doesnt require `este-library` with `este.thirdParty.react` to run
  - provides some useful utilities for tests like `expect` or `TestUtils` (which is `ReactTestUtils` from `react` package)
  - suports BDD syntax of writing test queries ([should](http://chaijs.com/api/bdd/) and [sinon-chai](http://chaijs.com/plugins/sinon-chai))

## Tasks

  - **esteBuilder**: Builder for Google Closure application
  - **coffee2closure**: Fixes CoffeeScript compiled output for Google Closure Compiler
  - **esteCompiler**: Simple Google Closure Compiler wrapper
  - **esteDeps**: Google Closure dependency calculator
  - **esteExtractMessages**: Extract messages defined with goog.getMsg
  - **esteTemplates**: Google Closure Templates compiler
  - **esteUnitTests**: Super-fast unit testing for Google Closure with Mocha in Node.js

## Usage

Take a look at [Este](https://github.com/steida/este/) application boilerplate.

## License
Copyright (c) 2013 Daniel Steigerwald

Licensed under the MIT license.
