'use strict';

module.exports = {
  require: ['@babel/register', 'test/setup.jsdom'],
  spec:'./test/*.spec.js',
  color:true
};