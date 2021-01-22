const mocks = require('./mocks')
const thepiratebay_org = require('../src/source/thepiratebay_org')
//const btdb_eu = require('../src/source/btdb_eu')
//const kat_rip = require('../src/source/kat_rip')
const _1337x_to = require('../src/source/1337x_to')
const yts_mx = require('../src/source/yts_mx')
const expect = require('chai').expect

describe('Do thepiratebay.org testing', function() {
  it('the result size should be greater than 0', async function() {
    this.timeout(30000)
    var keyword = 'mulan'
    var result = await new thepiratebay_org().execute(keyword)
    expect(result.length).to.be.greaterThan(0)
  })
})

//describe('Do btdb.eu testing', function() {
  //it('the result size should be greater than 0', async function() {
    //this.timeout(30000)
    //var keyword = 'mulan'
    //var result = await new btdb_eu().execute(keyword)
    //expect(result.length).to.be.greaterThan(0)
  //})
//})

//describe('Do kat.rip testing', function() {
  //it('the result size should be greater than 0', async function() {
    //this.timeout(30000)
    //var keyword = 'mulan'
    //var result = await new kat_rip().execute(keyword)
    //expect(result.length).to.be.greaterThan(0)
  //})
//})

describe('Do 1337x.to testing', function() {
  it('the result size should be greater than 0', async function() {
    this.timeout(30000)
    var keyword = 'mulan'
    var result = await new _1337x_to().execute(keyword)
    expect(result.length).to.be.greaterThan(0)
  })
})

describe('Do yts.mx testing', function() {
  it('the result size should be greater than 0', async function() {
    this.timeout(30000)
    var keyword = 'mulan'
    var result = await new yts_mx().execute(keyword)
    expect(result.length).to.be.greaterThan(0)
  })
})

