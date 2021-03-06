// Generated by CoffeeScript 1.6.2
(function() {
  var testCurrent, testWithBrowser, _ref;

  _ref = require('../common/basic-test-base'), testWithBrowser = _ref.testWithBrowser, testCurrent = _ref.testCurrent;

  describe("wd-sync", function() {
    return describe("local", function() {
      var browserName, _i, _len, _ref1;

      _ref1 = ['firefox'];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        browserName = _ref1[_i];
        testWithBrowser({
          type: 'remote',
          desired: {
            browserName: browserName
          }
        });
      }
      return testCurrent({
        type: 'remote',
        desired: {
          browserName: 'firefox'
        }
      });
    });
  });

}).call(this);
