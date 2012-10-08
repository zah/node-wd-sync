// Generated by CoffeeScript 1.3.3
(function() {
  var CoffeeScript, Express, Wd, WdWrap, async, express, should, test, wd, _ref;

  _ref = require('../../index'), wd = _ref.wd, Wd = _ref.Wd, WdWrap = _ref.WdWrap;

  should = require('should');

  CoffeeScript = require('coffee-script');

  async = require('async');

  express = require('express');

  test = function(type, browserName) {
    var browser, capabilities;
    browser = null;
    WdWrap = WdWrap({
      "with": (function() {
        return browser;
      })
    });
    capabilities = null;
    return describe("local tests using " + browserName, function() {
      var funcSuffix, _fn, _i, _len, _ref1;
      it("wd.remote or wd.headless", function(done) {
        switch (type) {
          case 'remote':
            browser = wd.remote();
            browser.on("status", function(info) {
              return console.log("\u001b[36m%s\u001b[0m", info);
            });
            browser.on("command", function(meth, path) {
              return console.log(" > \u001b[33m%s\u001b[0m: %s", meth, path);
            });
            Wd = Wd({
              "with": browser
            });
            return done();
          case 'headless':
            browser = wd.headless();
            Wd = Wd({
              "with": browser
            });
            return done();
        }
      });
      it("status", WdWrap(function() {
        return should.exist(this.status());
      }));
      it("init", WdWrap(function() {
        return this.init({
          browserName: browserName
        });
      }));
      it("sessionCapabilities", WdWrap(function() {
        capabilities = this.sessionCapabilities();
        should.exist(capabilities);
        should.exist(capabilities.browserName);
        return should.exist(capabilities.platform);
      }));
      it("get", WdWrap(function() {
        return this.get("http://127.0.0.1:8181/local-test-page.html");
      }));
      it("eval", WdWrap(function() {
        (this["eval"]("1+2")).should.equal(3);
        (this["eval"]("document.title")).should.equal("TEST PAGE");
        (this["eval"]("$('#eval').length")).should.equal(1);
        return (this["eval"]("$('#eval li').length")).should.equal(2);
      }));
      it("execute (with args)", WdWrap(function() {
        var script;
        script = "window.wd_sync_execute_test = 'It worked! ' + (arguments[0] + arguments[1])";
        this.execute(script, [10, 5]);
        return (this["eval"]("window.wd_sync_execute_test")).should.equal('It worked! 15');
      }));
      it("executeAsync (async mode, no args)", function(done) {
        var scriptAsCoffee, scriptAsJs;
        scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"              ";
        scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
          bare: 'on'
        });
        return browser.executeAsync(scriptAsJs, function(err, res) {
          res.should.equal("OK");
          return done();
        });
      });
      it("executeAsync (sync mode, no args)", WdWrap(function() {
        var res, scriptAsCoffee, scriptAsJs;
        scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"              ";
        scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
          bare: 'on'
        });
        res = this.executeAsync(scriptAsJs);
        return res.should.equal("OK");
      }));
      it("executeAsync (sync mode, with args)", WdWrap(function() {
        var res, scriptAsCoffee, scriptAsJs;
        scriptAsCoffee = "[args...,done] = arguments\ndone(\"OK \" + (args[0] + args[1]))              ";
        scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
          bare: 'on'
        });
        res = this.executeAsync(scriptAsJs, [10, 2]);
        return res.should.equal("OK 12");
      }));
      it("safeExecuteAsync (sync mode, with args)", WdWrap(function() {
        var res, scriptAsCoffee, scriptAsJs,
          _this = this;
        scriptAsCoffee = "[args...,done] = arguments\ndone(\"OK \" + (args[0] + args[1]))              ";
        scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
          bare: 'on'
        });
        res = this.safeExecuteAsync(scriptAsJs, [10, 2]);
        res.should.equal("OK 12");
        switch (type) {
          case 'remote':
            return (function() {
              return _this.safeExecuteAsync("!!!a wrong expr", [10, 2]);
            }).should["throw"](/Error response status/);
          case 'headless':
            return (function() {
              return _this.safeExecuteAsync("!!!a wrong expr", [10, 2]);
            }).should["throw"](/Execution failure/);
        }
      }));
      it("element", WdWrap(function() {
        should.exist(this.element("name", "elementByName"));
        return (function() {
          return this.element("name", "elementByName2");
        }).should["throw"]();
      }));
      it("elementOrNull", WdWrap(function() {
        return should.exist(this.elementOrNull("name", "elementByName"));
      }));
      it("hasElement", WdWrap(function() {
        (this.hasElement("name", "elementByName")).should.be["true"];
        return (this.hasElement("name", "elementByName2")).should.be["false"];
      }));
      it("elements", WdWrap(function() {
        (this.elements("name", "elementsByName")).should.have.length(3);
        return (this.elements("name", "elementsByName2")).should.eql([]);
      }));
      _ref1 = ['ById', 'ByCss'];
      _fn = function() {
        var elementFuncName, elementsFuncName, hasElementFuncName, searchSeveralText, searchSeveralText2, searchText, searchText2;
        elementFuncName = 'element' + funcSuffix;
        hasElementFuncName = 'hasElement' + funcSuffix;
        elementsFuncName = 'elements' + funcSuffix;
        searchText = elementFuncName;
        if (searchText.match(/ByLinkText/)) {
          searchText = "click " + searchText;
        }
        if (searchText.match(/ByCss/)) {
          searchText = "." + searchText;
        }
        if (searchText.match(/ByXPath/)) {
          searchText = "//div[@id='elementByXPath']/input";
        }
        if (searchText.match(/ByTagName/)) {
          searchText = "span";
        }
        searchText2 = searchText + '2';
        if (searchText.match(/ByXPath/)) {
          searchText2 = "//div[@id='elementByXPath2']/input";
        }
        if (searchText.match(/ByTagName/)) {
          searchText2 = "span2";
        }
        searchSeveralText = searchText.replace('element', 'elements');
        searchSeveralText2 = searchText2.replace('element', 'elements');
        it(elementFuncName, WdWrap(function() {
          should.exist(this[elementFuncName](searchText));
          return (function() {
            return this[elementFuncName](searchText2);
          }).should["throw"]();
        }));
        it(elementFuncName + 'IfExists', WdWrap(function() {
          should.exist(this[elementFuncName + 'IfExists'](searchText));
          return should.not.exist(this[elementFuncName + 'IfExists'](searchText2));
        }));
        it(hasElementFuncName, WdWrap(function() {
          (this[hasElementFuncName](searchText)).should.be["true"];
          return (this[hasElementFuncName](searchText2)).should.be["false"];
        }));
        return it(elementsFuncName, WdWrap(function() {
          var res;
          res = this[elementsFuncName](searchSeveralText);
          if (elementsFuncName.match(/ById/)) {
            res.should.have.length(1);
          } else if (elementsFuncName.match(/ByTagName/)) {
            (res.length > 1).should.be["true"];
          } else {
            res.should.have.length(3);
          }
          res = this[elementsFuncName](searchSeveralText2);
          return res.should.eql([]);
        }));
      };
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        funcSuffix = _ref1[_i];
        _fn();
      }
      it("getAttribute", WdWrap(function() {
        var testDiv;
        testDiv = this.elementById("getAttribute");
        should.exist(testDiv);
        (this.getAttribute(testDiv, "weather")).should.equal("sunny");
        return should.not.exist(this.getAttribute(testDiv, "timezone"));
      }));
      it("getValue (input)", WdWrap(function() {
        var inputField;
        inputField = this.elementByCss("#getValue input");
        should.exist(inputField);
        return (this.getValue(inputField)).should.equal("Hello getValueTest!");
      }));
      it("click", WdWrap(function() {
        var buttonNumberDiv, numOfClicksDiv, scriptAsCoffee, scriptAsJs;
        numOfClicksDiv = this.elementByCss("#click .numOfClicks");
        buttonNumberDiv = this.elementByCss("#click .buttonNumber");
        scriptAsCoffee = 'jQuery ->\n  window.numOfClick = 0\n  numOfClicksDiv = $(\'#click .numOfClicks\')\n  buttonNumberDiv = $(\'#click .buttonNumber\')\n  numOfClicksDiv.mousedown (eventObj) ->\n    button = eventObj.button\n    button = \'default\' unless button?\n    window.numOfClick = window.numOfClick + 1\n    numOfClicksDiv.html "clicked #{window.numOfClick}"\n    buttonNumberDiv.html "#{button}"    \n    false                                         ';
        scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
          bare: 'on'
        });
        this.execute(scriptAsJs);
        (this.text(numOfClicksDiv)).should.equal("not clicked");
        this.moveTo(numOfClicksDiv);
        this.click(0);
        (this.text(numOfClicksDiv)).should.equal("clicked 1");
        (this.text(buttonNumberDiv)).should.equal("0");
        this.moveTo(numOfClicksDiv);
        this.click();
        (this.text(numOfClicksDiv)).should.equal("clicked 2");
        return (this.text(buttonNumberDiv)).should.equal("0");
      }));
      it("type", WdWrap(function() {
        var altKey, inputField, nullKey;
        altKey = wd.SPECIAL_KEYS['Alt'];
        nullKey = wd.SPECIAL_KEYS['NULL'];
        inputField = this.elementByCss("#type input");
        should.exist(inputField);
        this.type(inputField, "Hello");
        (this.getValue(inputField)).should.equal("Hello");
        this.type(inputField, [altKey, nullKey, " World"]);
        (this.getValue(inputField)).should.equal("Hello World");
        this.type(inputField, [wd.SPECIAL_KEYS.Return]);
        return (this.getValue(inputField)).should.equal("Hello World");
      }));
      it("keys", WdWrap(function() {
        var altKey, inputField, nullKey;
        altKey = wd.SPECIAL_KEYS['Alt'];
        nullKey = wd.SPECIAL_KEYS['NULL'];
        inputField = this.elementByCss("#keys input");
        should.exist(inputField);
        this.clickElement(inputField);
        this.keys("Hello");
        (this.getValue(inputField)).should.equal("Hello");
        this.keys([altKey, nullKey, " World"]);
        (this.getValue(inputField)).should.equal("Hello World");
        this.type(inputField, [wd.SPECIAL_KEYS.Return]);
        return (this.getValue(inputField)).should.equal("Hello World");
      }));
      it("text (passing element)", WdWrap(function() {
        var textDiv;
        textDiv = this.elementByCss("#text");
        should.exist(textDiv);
        (this.text(textDiv)).should.include("text content");
        return (this.text(textDiv)).should.not.include("div");
      }));
      it("acceptAlert", WdWrap(function() {
        var a, res, scriptAsCoffee, scriptAsJs;
        a = this.elementByCss("#acceptAlert a");
        should.exist(a);
        scriptAsCoffee = "a = $('#acceptAlert a')\na.click ->\n  alert \"coffee is running out\"\n  false";
        scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
          bare: 'on'
        });
        res = this.execute(scriptAsJs);
        this.clickElement(a);
        return this.acceptAlert();
      }));
      it("active", WdWrap(function() {
        var i1, i2;
        i1 = this.elementByCss("#active .i1");
        i2 = this.elementByCss("#active .i2");
        i1.click();
        this.active().value.should.equal(i1.value);
        this.clickElement(i2);
        return this.active().value.should.equal(i2.value);
      }));
      it("url", WdWrap(function() {
        var url;
        url = this.url();
        url.should.include("local-test-page.html");
        return url.should.include("http://");
      }));
      it("allCookies / setCookies / deleteAllCookies / deleteCookie", WdWrap(function() {
        var cookies;
        this.deleteAllCookies();
        this.allCookies().should.eql([]);
        this.setCookie({
          name: 'fruit1',
          value: 'apple'
        });
        cookies = this.allCookies();
        (cookies.filter(function(c) {
          return c.name === 'fruit1' && c.value === 'apple';
        })).should.have.length(1);
        this.setCookie({
          name: 'fruit2',
          value: 'pear'
        });
        cookies = this.allCookies();
        cookies.should.have.length(2);
        (cookies.filter(function(c) {
          return c.name === 'fruit2' && c.value === 'pear';
        })).should.have.length(1);
        this.setCookie({
          name: 'fruit3',
          value: 'orange'
        });
        this.allCookies().should.have.length(3);
        this.deleteCookie('fruit2');
        cookies = this.allCookies();
        cookies.should.have.length(2);
        (cookies.filter(function(c) {
          return c.name === 'fruit2' && c.value === 'pear';
        })).should.have.length(0);
        this.deleteAllCookies();
        this.allCookies().should.eql([]);
        this.setCookie({
          name: 'fruit3',
          value: 'orange',
          secure: true
        });
        return this.deleteAllCookies();
      }));
      it("waitForCondition", WdWrap(function() {
        var exprCond, scriptAsCoffee, scriptAsJs,
          _this = this;
        scriptAsCoffee = 'setTimeout ->\n  $(\'#waitForCondition\').html \'<div class="child">a waitForCondition child</div>\'\n, 1500';
        scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
          bare: 'on'
        });
        this.execute(scriptAsJs);
        should.not.exist(this.elementByCssIfExists("#waitForCondition .child"));
        exprCond = "$('#waitForCondition .child').length > 0";
        (this.waitForCondition(exprCond, 2000, 200)).should.be["true"];
        (this.waitForCondition(exprCond, 2000)).should.be["true"];
        (this.waitForCondition(exprCond)).should.be["true"];
        switch (type) {
          case 'remote':
            return (function() {
              return _this.waitForCondition("sdsds ;;sdsd {}");
            }).should["throw"](/Error response status/);
          case 'headless':
            return (function() {
              return _this.waitForCondition("sdsds ;;sdsd {}");
            }).should["throw"](/Evaluation failure/);
        }
      }));
      it("element.text", WdWrap(function() {
        var el;
        el = this.element("id", "el_text");
        return el.text().should.include("I am some text");
      }));
      it("element.getValue", WdWrap(function() {
        var el;
        el = this.element("id", "el_getValue");
        el.should.have.property("getValue");
        return el.getValue().should.equal("value");
      }));
      it("err.inspect", WdWrap(function() {
        var err;
        err = null;
        try {
          browser.safeExecute("invalid-code> here");
        } catch (_err) {
          err = _err;
        }
        should.exist(err);
        (err instanceof Error).should.be["true"];
        switch (type) {
          case 'remote':
            err.inspect().should.include('"screen": "[hidden]"');
            return err.inspect().should.include('browser-error:');
        }
      }));
      it("close", WdWrap(function() {
        return this.close();
      }));
      return it("quit", WdWrap(function() {
        return this.quit();
      }));
    });
  };

  Express = (function() {

    function Express() {}

    Express.prototype.start = function(done) {
      this.app = express.createServer();
      this.app.use(express["static"](__dirname + '/assets'));
      return this.app.listen(8181);
    };

    Express.prototype.stop = function(done) {
      return this.app.close();
    };

    return Express;

  })();

  exports.test = test;

  exports.Express = Express;

}).call(this);
