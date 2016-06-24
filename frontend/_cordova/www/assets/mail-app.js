"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('mail-app/adapters/application', ['exports', 'ember-data/adapters/json-api', 'mail-app/config/environment'], function (exports, _emberDataAdaptersJsonApi, _mailAppConfigEnvironment) {
  exports['default'] = _emberDataAdaptersJsonApi['default'].extend({
    host: _mailAppConfigEnvironment['default'].serverHost
  });
});
define('mail-app/app', ['exports', 'ember', 'mail-app/resolver', 'ember-load-initializers', 'mail-app/config/environment'], function (exports, _ember, _mailAppResolver, _emberLoadInitializers, _mailAppConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _mailAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _mailAppConfigEnvironment['default'].podModulePrefix,
    Resolver: _mailAppResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _mailAppConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('mail-app/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'mail-app/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _mailAppConfigEnvironment) {

  var name = _mailAppConfigEnvironment['default'].APP.name;
  var version = _mailAppConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('mail-app/components/cdv-nav-bar', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'header'
  });
});
define('mail-app/components/email/new-form', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    store: _ember['default'].inject.service('store'),
    router: _ember['default'].inject.service('-routing'),
    tagName: 'form',

    submit: function submit(e) {
      var _this = this;

      e.preventDefault();
      var to = this.get('to'),
          subject = this.get('subject'),
          payload = this.get('payload');

      this.get('store').createRecord('email', { to: to, subject: subject, payload: payload }).save().then(function () {
        _this.get('router').transitionTo('mailbox.inbox');
      });
    }
  });
});
define('mail-app/components/inbox/emails-list', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      this.$('.collapsible').collapsible();
    }
  });
});
define('mail-app/components/login/login-form', ['exports', 'ember', 'mail-app/config/environment'], function (exports, _ember, _mailAppConfigEnvironment) {
  exports['default'] = _ember['default'].Component.extend({
    store: _ember['default'].inject.service(),
    router: _ember['default'].inject.service('-routing'),

    tagName: 'form',
    classNames: ['col s12', 'login--login-form'],

    submit: function submit(e) {
      var _this = this;

      e.preventDefault();
      var email = this.get('email'),
          password = this.get('password');

      _ember['default'].$.post(_mailAppConfigEnvironment['default'].serverHost + '/users/login', { email: email, password: password }).done(function (data) {
        _this.get('store').pushPayload(data);
        _this.get('router').transitionTo('mailbox');
      });
    }
  });
});
define('mail-app/components/page/nav-bar', ['exports', 'ember', 'mail-app/config/environment'], function (exports, _ember, _mailAppConfigEnvironment) {
  exports['default'] = _ember['default'].Component.extend({
    router: _ember['default'].inject.service('-routing'),
    tagName: 'nav',

    actions: {
      logout: function logout() {
        var _this = this;

        _ember['default'].$.post(_mailAppConfigEnvironment['default'].serverHost + '/users/logout').done(function () {
          _this.get('router').transitionTo('login');
        });
      }
    }
  });
});
define('mail-app/components/page/side-nav', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: 'page--side-nav'
  });
});
define('mail-app/electron/browser-qunit-adapter', ['exports'], function (exports) {
    (function (window) {
        'use strict';

        // Exit immediately if we're not running in Electron
        if (!window.ELECTRON) {
            return;
        }

        function setQUnitAdapter(serverURL) {
            var socket = io(serverURL);

            socket.on('connect', function () {
                return socket.emit('browser-login', 'Electron', 1);
            });
            socket.on('start-tests', function () {
                socket.disconnect();
                window.location.reload();
            });

            qunitAdapter(socket);
        }

        // Adapted from Testem's default qunit-adapter.
        function qunitAdapter(socket) {
            var currentTest = undefined,
                currentModule = undefined;
            var id = 1;
            var results = {
                failed: 0,
                passed: 0,
                total: 0,
                skipped: 0,
                tests: []
            };

            QUnit.log(function (details) {
                var item = {
                    passed: details.result,
                    message: details.message
                };

                if (!details.result) {
                    item.actual = details.actual;
                    item.expected = details.expected;
                }

                currentTest.items.push(item);
            });

            QUnit.testStart(function (details) {
                currentTest = {
                    id: id++,
                    name: (currentModule ? currentModule + ': ' : '') + details.name,
                    items: []
                };
                socket.emit('tests-start');
            });

            QUnit.testDone(function (details) {
                currentTest.failed = details.failed;
                currentTest.passed = details.passed;
                currentTest.total = details.total;

                results.total++;

                if (currentTest.failed > 0) {
                    results.failed++;
                } else {
                    results.passed++;
                }

                results.tests.push(currentTest);
                socket.emit('test-result', currentTest);
            });

            QUnit.moduleStart(function (details) {
                currentModule = details.name;
            });

            QUnit.done(function (details) {
                results.runDuration = details.runtime;
                socket.emit('all-test-results', results);
            });
        }

        window.addEventListener('load', function () {
            setQUnitAdapter(process.env.ELECTRON_TESTEM_SERVER_URL);
        });
    })(this);
});
define('mail-app/electron/reload', ['exports'], function (exports) {
    /* jshint browser: true */
    (function () {
        'use strict';

        // Exit immediately if we're not running in Electron
        if (!window.ELECTRON) {
            return;
        }

        // Reload the page when anything in `dist` changes
        var fs = window.requireNode('fs');
        var path = window.requireNode('path');

        /**
         * Watch a given directory for changes and reload
         * on change
         * 
         * @param sub directory
         */
        var watch = function watch(sub) {
            var dirname = __dirname || path.resolve(path.dirname());
            var isInTest = !!window.QUnit;

            if (isInTest) {
                // In tests, __dirname is `<project>/tmp/<broccoli-dist-path>/tests`.
                // In normal `ember:electron` it's `<project>/dist`.
                // To achieve the regular behavior in testing, go to parent dir, which contains `tests` and `assets`
                dirname = path.join(dirname, '..');
            }

            if (sub) {
                dirname = path.join(dirname, sub);
            }

            fs.watch(dirname, { recursive: true }, function (e) {
                window.location.reload();
            });
        };

        /**
         * Install Devtron in the current window.
         */
        var installDevtron = function installDevtron() {
            var devtron = window.requireNode('devtron');

            if (devtron) {
                devtron.install();
            }
        };

        document.addEventListener('DOMContentLoaded', function (e) {
            var dirname = __dirname || path.resolve(path.dirname());

            fs.stat(dirname, function (err, stat) {
                if (!err) {
                    watch();

                    // On linux, the recursive `watch` command is not fully supported:
                    // https://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener
                    //
                    // However, the recursive option WILL watch direct children of the
                    // given directory.  So, this hack just manually sets up watches on
                    // the expected subdirs -- that is, `assets` and `tests`.
                    if (process.platform === 'linux') {
                        watch('/assets');
                        watch('/tests');
                    }
                }
            });

            installDevtron();
        });
    })();
});
define('mail-app/electron/tap-qunit-adapter', ['exports'], function (exports) {
    (function (window) {
        'use strict';

        // Exit immediately if we're not running in Electron
        if (!window.ELECTRON) {
            return;
        }

        // Log QUnit results to the console so they show up
        // in the `Electron` process output.
        function log(content) {
            console.log('[qunit-logger] ' + content);
            window.process.stdout.write('[qunit-logger] ' + content);
        }

        function setQUnitAdapter() {
            var testCount = 0;

            QUnit.begin(function (details) {
                if (details.totalTests >= 1) {
                    log('1..' + details.totalTests);
                }
            });

            QUnit.testDone(function (details) {
                testCount++;
                if (details.failed === 0) {
                    log('ok ' + testCount + ' - ' + details.module + ' # ' + details.name);
                }
            });

            QUnit.log(function (details) {
                if (details.result !== true) {
                    var actualTestCount = testCount + 1;
                    log('# ' + JSON.stringify(details));
                    log('not ok ' + actualTestCount + ' - ' + details.module + ' - ' + details.name);
                }
            });

            QUnit.done(function (details) {
                log('# done' + (details.failed === 0 ? '' : ' with errors'));
            });
        }

        window.addEventListener('load', setQUnitAdapter);
    })(this);
});
define('mail-app/helpers/is-after', ['exports', 'ember', 'mail-app/config/environment', 'ember-moment/helpers/is-after'], function (exports, _ember, _mailAppConfigEnvironment, _emberMomentHelpersIsAfter) {
  exports['default'] = _emberMomentHelpersIsAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_mailAppConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('mail-app/helpers/is-before', ['exports', 'ember', 'mail-app/config/environment', 'ember-moment/helpers/is-before'], function (exports, _ember, _mailAppConfigEnvironment, _emberMomentHelpersIsBefore) {
  exports['default'] = _emberMomentHelpersIsBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_mailAppConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('mail-app/helpers/is-between', ['exports', 'ember', 'mail-app/config/environment', 'ember-moment/helpers/is-between'], function (exports, _ember, _mailAppConfigEnvironment, _emberMomentHelpersIsBetween) {
  exports['default'] = _emberMomentHelpersIsBetween['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_mailAppConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('mail-app/helpers/is-same-or-after', ['exports', 'ember', 'mail-app/config/environment', 'ember-moment/helpers/is-same-or-after'], function (exports, _ember, _mailAppConfigEnvironment, _emberMomentHelpersIsSameOrAfter) {
  exports['default'] = _emberMomentHelpersIsSameOrAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_mailAppConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('mail-app/helpers/is-same-or-before', ['exports', 'ember', 'mail-app/config/environment', 'ember-moment/helpers/is-same-or-before'], function (exports, _ember, _mailAppConfigEnvironment, _emberMomentHelpersIsSameOrBefore) {
  exports['default'] = _emberMomentHelpersIsSameOrBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_mailAppConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('mail-app/helpers/is-same', ['exports', 'ember', 'mail-app/config/environment', 'ember-moment/helpers/is-same'], function (exports, _ember, _mailAppConfigEnvironment, _emberMomentHelpersIsSame) {
  exports['default'] = _emberMomentHelpersIsSame['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_mailAppConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('mail-app/helpers/moment-calendar', ['exports', 'ember', 'mail-app/config/environment', 'ember-moment/helpers/moment-calendar'], function (exports, _ember, _mailAppConfigEnvironment, _emberMomentHelpersMomentCalendar) {
  exports['default'] = _emberMomentHelpersMomentCalendar['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_mailAppConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('mail-app/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _emberMomentHelpersMomentDuration) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMomentDuration['default'];
    }
  });
});
define('mail-app/helpers/moment-format', ['exports', 'ember', 'mail-app/config/environment', 'ember-moment/helpers/moment-format'], function (exports, _ember, _mailAppConfigEnvironment, _emberMomentHelpersMomentFormat) {
  exports['default'] = _emberMomentHelpersMomentFormat['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_mailAppConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('mail-app/helpers/moment-from-now', ['exports', 'ember', 'mail-app/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, _ember, _mailAppConfigEnvironment, _emberMomentHelpersMomentFromNow) {
  exports['default'] = _emberMomentHelpersMomentFromNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_mailAppConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('mail-app/helpers/moment-to-now', ['exports', 'ember', 'mail-app/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, _ember, _mailAppConfigEnvironment, _emberMomentHelpersMomentToNow) {
  exports['default'] = _emberMomentHelpersMomentToNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_mailAppConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('mail-app/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _emberMomentHelpersNow) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersNow['default'];
    }
  });
});
define('mail-app/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('mail-app/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('mail-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'mail-app/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _mailAppConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_mailAppConfigEnvironment['default'].APP.name, _mailAppConfigEnvironment['default'].APP.version)
  };
});
define('mail-app/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('mail-app/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('mail-app/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('mail-app/initializers/export-application-global', ['exports', 'ember', 'mail-app/config/environment'], function (exports, _ember, _mailAppConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_mailAppConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _mailAppConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_mailAppConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('mail-app/initializers/in-app-livereload', ['exports', 'mail-app/config/environment', 'ember-cli-cordova/initializers/in-app-livereload'], function (exports, _mailAppConfigEnvironment, _emberCliCordovaInitializersInAppLivereload) {

  var inAppReload = _emberCliCordovaInitializersInAppLivereload['default'].initialize;

  var initialize = function initialize(app) {
    if (typeof cordova === 'undefined' || _mailAppConfigEnvironment['default'].environment !== 'development' || _mailAppConfigEnvironment['default'].cordova && (!_mailAppConfigEnvironment['default'].cordova.liveReload || !_mailAppConfigEnvironment['default'].cordova.liveReload.enabled)) {
      return;
    }

    return inAppReload(app, _mailAppConfigEnvironment['default']);
  };

  exports.initialize = initialize;
  exports['default'] = {
    name: 'cordova:in-app-livereload',
    initialize: initialize
  };
});
/* globals cordova */
define('mail-app/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('mail-app/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('mail-app/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("mail-app/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('mail-app/instance-initializers/in-app-livereload', ['exports', 'ember'], function (exports, _ember) {
  exports.initialize = initialize;
  var run = _ember['default'].run;

  function initialize(app) {
    var config = undefined,
        env = undefined;

    if (app.resolveRegistration) {
      config = app.resolveRegistration('config:environment');
    } else {
      config = app.container.lookupFactory('config:environment');
    }
    env = config.environment;

    if (config.cordova && config.cordova.reloadUrl && (env === 'development' || env === 'test')) {
      (function () {

        var url = config.cordova.reloadUrl;
        if (window.location.href.indexOf('file://') > -1) {
          run.later(function () {
            window.location.replace(url);
          }, 50);
        }
      })();
    }
  }

  exports['default'] = {
    name: 'cordova:in-app-livereload',
    initialize: initialize
  };
});
define('mail-app/models/email', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _emberDataModel, _emberDataAttr, _emberDataRelationships) {
  exports['default'] = _emberDataModel['default'].extend({
    subject: (0, _emberDataAttr['default'])('string'),
    payload: (0, _emberDataAttr['default'])('string'),
    to: (0, _emberDataAttr['default'])('string'),
    createdAt: (0, _emberDataAttr['default'])('moment'),
    user: (0, _emberDataRelationships.belongsTo)('user')
  });
});
define('mail-app/models/user', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _emberDataModel, _emberDataAttr, _emberDataRelationships) {
  exports['default'] = _emberDataModel['default'].extend({
    emailAddress: (0, _emberDataAttr['default'])('string'),
    emails: (0, _emberDataRelationships.hasMany)('email')
  });
});
define('mail-app/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('mail-app/router', ['exports', 'ember', 'mail-app/config/environment'], function (exports, _ember, _mailAppConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _mailAppConfigEnvironment['default'].locationType,
    rootURL: _mailAppConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('login');
    this.route('mailbox', function () {
      this.route('inbox');
      this.route('new');
    });
  });

  exports['default'] = Router;
});
define('mail-app/routes/application', ['exports', 'ember', 'mail-app/config/environment'], function (exports, _ember, _mailAppConfigEnvironment) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      var _this = this;

      _ember['default'].$.getJSON(_mailAppConfigEnvironment['default'].serverHost + '/users/current_user').then(function (data) {
        _this.store.pushPayload(data);
        _this.transitionTo('mailbox.inbox');
      }).fail(function () {
        _this.transitionTo('login');
      });
    }
  });
});
define('mail-app/routes/login', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('mail-app/routes/mailbox/inbox', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('email');
    }
  });
});
define('mail-app/routes/mailbox/new', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('mail-app/routes/mailbox', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('mail-app/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('mail-app/services/cordova', ['exports', 'ember-cordova/services/cordova'], function (exports, _emberCordovaServicesCordova) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCordovaServicesCordova['default'];
    }
  });
});
define('mail-app/services/device/platform', ['exports', 'ember-cordova/services/device/platform'], function (exports, _emberCordovaServicesDevicePlatform) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCordovaServicesDevicePlatform['default'];
    }
  });
});
define('mail-app/services/device/splashscreen', ['exports', 'ember-cordova/services/device/splashscreen'], function (exports, _emberCordovaServicesDeviceSplashscreen) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCordovaServicesDeviceSplashscreen['default'];
    }
  });
});
define('mail-app/services/moment', ['exports', 'ember', 'mail-app/config/environment', 'ember-moment/services/moment'], function (exports, _ember, _mailAppConfigEnvironment, _emberMomentServicesMoment) {
  exports['default'] = _emberMomentServicesMoment['default'].extend({
    defaultFormat: _ember['default'].get(_mailAppConfigEnvironment['default'], 'moment.outputFormat')
  });
});
define("mail-app/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 10
          }
        },
        "moduleName": "mail-app/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [1, 0], [1, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("mail-app/templates/cdv-generic-nav-bar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.0-beta.1",
            "loc": {
              "source": null,
              "start": {
                "line": 3,
                "column": 4
              },
              "end": {
                "line": 5,
                "column": 4
              }
            },
            "moduleName": "mail-app/templates/cdv-generic-nav-bar.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("i");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createAttrMorph(element2, 'class');
            return morphs;
          },
          statements: [["attribute", "class", ["concat", ["icon ", ["get", "nav.leftButton.icon", ["loc", [null, [4, 23], [4, 42]]]]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.7.0-beta.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 8,
              "column": 0
            }
          },
          "moduleName": "mail-app/templates/cdv-generic-nav-bar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element3 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createElementMorph(element3);
          morphs[1] = dom.createMorphAt(element3, 1, 1);
          morphs[2] = dom.createMorphAt(element3, 3, 3);
          return morphs;
        },
        statements: [["element", "action", ["leftButton"], [], ["loc", [null, [2, 10], [2, 33]]]], ["block", "if", [["get", "nav.leftButton.icon", ["loc", [null, [3, 10], [3, 29]]]]], [], 0, null, ["loc", [null, [3, 4], [5, 11]]]], ["content", "nav.leftButton.text", ["loc", [null, [6, 4], [6, 27]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.0-beta.1",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 0
            },
            "end": {
              "line": 14,
              "column": 0
            }
          },
          "moduleName": "mail-app/templates/cdv-generic-nav-bar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h1");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["content", "nav.title.text", ["loc", [null, [12, 4], [12, 22]]]]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.0-beta.1",
            "loc": {
              "source": null,
              "start": {
                "line": 18,
                "column": 4
              },
              "end": {
                "line": 20,
                "column": 4
              }
            },
            "moduleName": "mail-app/templates/cdv-generic-nav-bar.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("i");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createAttrMorph(element0, 'class');
            return morphs;
          },
          statements: [["attribute", "class", ["concat", ["icon ", ["get", "nav.rightButton.icon", ["loc", [null, [19, 23], [19, 43]]]]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.7.0-beta.1",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 0
            },
            "end": {
              "line": 23,
              "column": 0
            }
          },
          "moduleName": "mail-app/templates/cdv-generic-nav-bar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createElementMorph(element1);
          morphs[1] = dom.createMorphAt(element1, 1, 1);
          morphs[2] = dom.createMorphAt(element1, 3, 3);
          return morphs;
        },
        statements: [["element", "action", ["rightButton"], [], ["loc", [null, [17, 10], [17, 34]]]], ["block", "if", [["get", "nav.rightButton.icon", ["loc", [null, [18, 10], [18, 30]]]]], [], 0, null, ["loc", [null, [18, 4], [20, 11]]]], ["content", "nav.rightButton.text", ["loc", [null, [21, 4], [21, 28]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 24,
            "column": 0
          }
        },
        "moduleName": "mail-app/templates/cdv-generic-nav-bar.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "nav.leftButton.text", ["loc", [null, [1, 6], [1, 25]]]]], [], 0, null, ["loc", [null, [1, 0], [8, 7]]]], ["block", "if", [["get", "nav.title.text", ["loc", [null, [10, 6], [10, 20]]]]], [], 1, null, ["loc", [null, [10, 0], [14, 7]]]], ["block", "if", [["get", "nav.rightButton.text", ["loc", [null, [16, 6], [16, 26]]]]], [], 2, null, ["loc", [null, [16, 0], [23, 7]]]]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define("mail-app/templates/components/cdv-nav-bar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "mail-app/templates/components/cdv-nav-bar.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("mail-app/templates/components/email/new-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 24,
            "column": 6
          }
        },
        "moduleName": "mail-app/templates/components/email/new-form.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "input-field col m6 s12");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "to");
        var el4 = dom.createTextNode("To");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "input-field col m6 s12");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "subject");
        var el4 = dom.createTextNode("Subject");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "input-field col s12");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "payload");
        var el4 = dom.createTextNode("Message");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "input-field col s12");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "submit");
        dom.setAttribute(el3, "class", "waves-effect waves-light btn right");
        dom.setAttribute(el3, "value", "Send");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(fragment, [2, 1]), 1, 1);
        return morphs;
      },
      statements: [["inline", "input", [], ["id", "to", "type", "email", "class", "validate", "value", ["subexpr", "@mut", [["get", "to", ["loc", [null, [3, 56], [3, 58]]]]], [], []]], ["loc", [null, [3, 4], [3, 60]]]], ["inline", "input", [], ["id", "subject", "type", "text", "class", "validate", "value", ["subexpr", "@mut", [["get", "subject", ["loc", [null, [8, 60], [8, 67]]]]], [], []]], ["loc", [null, [8, 4], [8, 69]]]], ["inline", "textarea", [], ["id", "payload", "class", "materialize-textarea", "value", ["subexpr", "@mut", [["get", "payload", ["loc", [null, [15, 63], [15, 70]]]]], [], []]], ["loc", [null, [15, 4], [15, 72]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("mail-app/templates/components/inbox/emails-list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.0-beta.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 10,
              "column": 2
            }
          },
          "moduleName": "mail-app/templates/components/inbox/emails-list.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "collapsible-header");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("article");
          dom.setAttribute(el2, "class", "collapsible-body");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("b");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("p");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [3]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element1, [1]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element1, [3]), 0, 0);
          return morphs;
        },
        statements: [["content", "email.subject", ["loc", [null, [4, 38], [4, 55]]]], ["inline", "moment-from-now", [["get", "email.createdAt", ["loc", [null, [6, 29], [6, 44]]]]], [], ["loc", [null, [6, 11], [6, 46]]]], ["content", "email.payload", ["loc", [null, [7, 11], [7, 28]]]]],
        locals: ["email"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 5
          }
        },
        "moduleName": "mail-app/templates/components/inbox/emails-list.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1, "class", "collapsible");
        dom.setAttribute(el1, "data-collapsible", "accordion");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "emails", ["loc", [null, [2, 10], [2, 16]]]]], [], 0, null, ["loc", [null, [2, 2], [10, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("mail-app/templates/components/login/login-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 6
          }
        },
        "moduleName": "mail-app/templates/components/login/login-form.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "input-field col s12");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "email");
        var el4 = dom.createTextNode("Email");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "input-field col s12");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "password");
        var el4 = dom.createTextNode("Password");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "input-field col s12");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "submit");
        dom.setAttribute(el3, "class", "waves-effect waves-light btn right");
        dom.setAttribute(el3, "value", "Login");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2, 1]), 1, 1);
        return morphs;
      },
      statements: [["inline", "input", [], ["id", "email", "type", "email", "class", "validate", "value", ["subexpr", "@mut", [["get", "email", ["loc", [null, [3, 59], [3, 64]]]]], [], []]], ["loc", [null, [3, 4], [3, 66]]]], ["inline", "input", [], ["id", "password", "type", "password", "class", "validate", "value", ["subexpr", "@mut", [["get", "password", ["loc", [null, [10, 65], [10, 73]]]]], [], []]], ["loc", [null, [10, 4], [10, 75]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("mail-app/templates/components/page/nav-bar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 6
          }
        },
        "moduleName": "mail-app/templates/components/page/nav-bar.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "nav-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2, "href", "#");
        dom.setAttribute(el2, "class", "brand-logo");
        var el3 = dom.createTextNode("Mail App");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2, "id", "nav-mobile");
        dom.setAttribute(el2, "class", "right");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "href", "logout");
        var el5 = dom.createTextNode("Logout");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 3, 1, 0]);
        var morphs = new Array(1);
        morphs[0] = dom.createElementMorph(element0);
        return morphs;
      },
      statements: [["element", "action", ["logout"], [], ["loc", [null, [4, 25], [4, 44]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("mail-app/templates/components/page/side-nav", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.0-beta.1",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 4
            },
            "end": {
              "line": 3,
              "column": 37
            }
          },
          "moduleName": "mail-app/templates/components/page/side-nav.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Inbox");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.0-beta.1",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 4
            },
            "end": {
              "line": 6,
              "column": 45
            }
          },
          "moduleName": "mail-app/templates/components/page/side-nav.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Write new email");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 5
          }
        },
        "moduleName": "mail-app/templates/components/page/side-nav.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1, "class", "collection");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        dom.setAttribute(el2, "class", "collection-item");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        dom.setAttribute(el2, "class", "collection-item");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 1, 1);
        return morphs;
      },
      statements: [["block", "link-to", ["mailbox.inbox"], [], 0, null, ["loc", [null, [3, 4], [3, 49]]]], ["block", "link-to", ["mailbox.new"], [], 1, null, ["loc", [null, [6, 4], [6, 57]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("mail-app/templates/login", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 6
          }
        },
        "moduleName": "mail-app/templates/login.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col s6 offset-s3");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1, 1]), 1, 1);
        return morphs;
      },
      statements: [["content", "login/login-form", ["loc", [null, [4, 6], [4, 26]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("mail-app/templates/mailbox/inbox", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 34
          }
        },
        "moduleName": "mail-app/templates/mailbox/inbox.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "inbox/emails-list", [], ["emails", ["subexpr", "@mut", [["get", "model", ["loc", [null, [1, 27], [1, 32]]]]], [], []]], ["loc", [null, [1, 0], [1, 34]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("mail-app/templates/mailbox/new", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 18
          }
        },
        "moduleName": "mail-app/templates/mailbox/new.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "email/new-form", ["loc", [null, [1, 0], [1, 18]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("mail-app/templates/mailbox", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.0-beta.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 12,
            "column": 6
          }
        },
        "moduleName": "mail-app/templates/mailbox.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col s12 m3");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col s12 m9");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2, 1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [3]), 1, 1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "page/nav-bar", ["loc", [null, [1, 0], [1, 16]]]], ["content", "page/side-nav", ["loc", [null, [6, 6], [6, 23]]]], ["content", "outlet", ["loc", [null, [9, 6], [9, 16]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("mail-app/transforms/moment", ["exports", "ember-data", "moment"], function (exports, _emberData, _moment2) {
  exports["default"] = _emberData["default"].Transform.extend({
    serialize: function serialize(value) {
      return this._moment(value).format();
    },

    deserialize: function deserialize(value) {
      return this._moment(value);
    },

    _moment: function _moment(value) {
      return (0, _moment2["default"])(value);
    }
  });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('mail-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'mail-app';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("mail-app/app")["default"].create({"name":"mail-app","version":"0.0.0+ab52f37f"});
}

/* jshint ignore:end */
//# sourceMappingURL=mail-app.map