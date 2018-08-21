'use strict'

// Set BABEL_ENV to use proper env config
process.env.BABEL_ENV = 'test'

// Enable use of ES6+ on required files
require('babel-register')({
  ignore: /node_modules/
})

// Attach Chai APIs to global scope
const chai = require('chai')
chai.should()

// Require all JS files in for Mocha to consume
require('require-dir')('.')
// require('require-dir')('./crawlers')
