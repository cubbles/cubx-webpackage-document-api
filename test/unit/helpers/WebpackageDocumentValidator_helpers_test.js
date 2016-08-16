/*global require,describe,before,it,expect,beforeEach,afterEach, sinon*/
describe('WebpackageDocumentValidator (helpers)', function () {
  var WebpackageDocumentValidator;
  before(function () {
    WebpackageDocumentValidator = require('../../../lib/WebpackageDocumentValidator');
  });
  describe('#_changeVersionInNumber', function () {
    var spyConsoleError;
    beforeEach(function () {
      spyConsoleError = sinon.spy(console, 'error');
    });
    afterEach(function () {
      console.error.restore();
    });
    it('\'9.0.0\' should be get 900', function () {
      var num = WebpackageDocumentValidator._changeVersionInNumber('9.0.0');
      expect(num).to.be.equal(900);
      spyConsoleError.should.not.be.called;
    });
    it('\'9.1.0\' should be get 910', function () {
      var num = WebpackageDocumentValidator._changeVersionInNumber('9.1.0');
      expect(num).to.be.equal(910);
      spyConsoleError.should.not.be.called;
    });
    it('\'9.3.2\' should be get 932', function () {
      var num = WebpackageDocumentValidator._changeVersionInNumber('9.3.2');
      expect(num).to.be.equal(932);
      spyConsoleError.should.not.be.called;
    });
    it('\'9.5\' should be log an error', function () {
      var num = WebpackageDocumentValidator._changeVersionInNumber('9.5');
      expect(num).to.be.equal(-1);
      spyConsoleError.should.be.calledOnce;
    });
    it('\'9.vvv.eee\' should be log an error', function () {
      var num = WebpackageDocumentValidator._changeVersionInNumber('9.vvv.eee');
      expect(num).to.be.equal(-1);
      spyConsoleError.should.be.calledTwice;
    });
  });
  describe('#_getCompleteVersionNumber', function () {
    var spyConsoleError;
    beforeEach(function () {
      spyConsoleError = sinon.spy(console, 'error');
    });
    afterEach(function () {
      console.error.restore();
    });
    it('\'9.4.5\' should be not changed ', function () {
      var origVers = '9.4.5';
      var vers = WebpackageDocumentValidator._getCompleteVersionNumber(origVers);
      vers.should.be.equal(origVers);
      spyConsoleError.should.not.be.called;
    });
    it('\'9.3\' should be changed to \'9.3.0\' ', function () {
      var origVers = '9.3';
      var vers = WebpackageDocumentValidator._getCompleteVersionNumber(origVers);
      vers.should.be.equal('9.3.0');
      spyConsoleError.should.not.be.called;
    });
    it('\'9\' should be changed to \'9.0.0\' ', function () {
      var origVers = '9';
      var vers = WebpackageDocumentValidator._getCompleteVersionNumber(origVers);
      vers.should.be.equal('9.0.0');
      spyConsoleError.should.not.be.called;
    });
    it('\'9\' should be changed to \'9.0.0\' ', function () {
      var origVers = '9';
      var vers = WebpackageDocumentValidator._getCompleteVersionNumber(origVers);
      vers.should.be.equal('9.0.0');
      spyConsoleError.should.not.be.called;
    });
    it('\'9.9.0.x\' should be log an error', function () {
      var origVers = '9.9.0.x';
      var vers = WebpackageDocumentValidator._getCompleteVersionNumber(origVers);
      vers.should.be.equal(origVers);
      spyConsoleError.should.be.calledOnce;
    });
  });
  describe('#_modelVersionValid', function () {
    it('9 should be valid for  min version 9', function () {
      expect(WebpackageDocumentValidator._modelVersionValid('9', '9')).to.be.true;
    });
    it('9 should be valid for min version 8', function () {
      expect(WebpackageDocumentValidator._modelVersionValid('8', '9')).to.be.true;
    });
    it('8 should be not valid for min version 9', function () {
      expect(WebpackageDocumentValidator._modelVersionValid('9', '8')).to.be.false;
    });
    it('9 should be valid for min version 8.2.2', function () {
      expect(WebpackageDocumentValidator._modelVersionValid('8.2.2', '9')).to.be.true;
    });
    it('9.1.2 should be valid for min version 9.1', function () {
      expect(WebpackageDocumentValidator._modelVersionValid('9.1', '9.1.2')).to.be.true;
    });
    it('9.1.2 should be valid for min version 9.1', function () {
      expect(WebpackageDocumentValidator._modelVersionValid('9.1', '9.1.2')).to.be.true;
    });
    it('9.1 should be not valid for min version 9.1.2', function () {
      expect(WebpackageDocumentValidator._modelVersionValid('9.1.2', '9.1')).to.be.false;
    });
    it('9 should be not valid for min version 9.1.2', function () {
      expect(WebpackageDocumentValidator._modelVersionValid('9.1.2', '9')).to.be.false;
    });
  });
});
