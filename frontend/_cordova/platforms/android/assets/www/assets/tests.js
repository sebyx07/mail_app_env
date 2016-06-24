define('mail-app/tests/adapters/application.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | adapters/application.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('adapters/application.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('mail-app/tests/components/email/new-form.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | components/email/new-form.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('components/email/new-form.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/components/inbox/emails-list.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | components/inbox/emails-list.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('components/inbox/emails-list.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/components/login/login-form.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | components/login/login-form.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('components/login/login-form.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/components/page/nav-bar.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | components/page/nav-bar.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('components/page/nav-bar.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/components/page/side-nav.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | components/page/side-nav.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('components/page/side-nav.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/electron', ['exports'], function (exports) {
    /* jshint undef: false */

    var _require = require('electron');

    var BrowserWindow = _require.BrowserWindow;
    var app = _require.app;

    var mainWindow = null;

    app.on('window-all-closed', function onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('ready', function onReady() {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600
        });

        delete mainWindow.module;

        if (process.env.EMBER_ENV === 'test') {
            mainWindow.loadURL('file://' + __dirname + '/index.html');
        } else {
            mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
        }

        mainWindow.on('closed', function onClosed() {
            mainWindow = null;
        });
    });

    /* jshint undef: true */
});
define('mail-app/tests/electron.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | electron.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('electron.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('mail-app/tests/helpers/destroy-app.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | helpers/destroy-app.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('helpers/destroy-app.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'mail-app/tests/helpers/start-app', 'mail-app/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _mailAppTestsHelpersStartApp, _mailAppTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _mailAppTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _mailAppTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define('mail-app/tests/helpers/module-for-acceptance.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | helpers/module-for-acceptance.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('helpers/module-for-acceptance.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/helpers/resolver', ['exports', 'mail-app/resolver', 'mail-app/config/environment'], function (exports, _mailAppResolver, _mailAppConfigEnvironment) {

  var resolver = _mailAppResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _mailAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _mailAppConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('mail-app/tests/helpers/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | helpers/resolver.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('helpers/resolver.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/helpers/start-app', ['exports', 'ember', 'mail-app/app', 'mail-app/config/environment'], function (exports, _ember, _mailAppApp, _mailAppConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _mailAppConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _mailAppApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('mail-app/tests/helpers/start-app.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | helpers/start-app.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('helpers/start-app.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/integration/components/email/new-form-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeComponent)('email/new-form', 'Integration: EmailNewFormComponent', {
    integration: true
  }, function () {
    (0, _emberMocha.it)('renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#email/new-form}}
      //     template content
      //   {{/email/new-form}}
      // `);

      this.render(Ember.HTMLBars.template((function () {
        return {
          meta: {
            'revision': 'Ember@2.7.0-beta.1',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 18
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
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
          statements: [['content', 'email/new-form', ['loc', [null, [1, 0], [1, 18]]]]],
          locals: [],
          templates: []
        };
      })()));
      (0, _chai.expect)(this.$()).to.have.length(1);
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/integration/components/email/new-form-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | integration/components/email/new-form-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('integration/components/email/new-form-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/integration/components/inbox/emails-list-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeComponent)('inbox/emails-list', 'Integration: InboxEmailsListComponent', {
    integration: true
  }, function () {
    (0, _emberMocha.it)('renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#inbox/emails-list}}
      //     template content
      //   {{/inbox/emails-list}}
      // `);

      this.render(Ember.HTMLBars.template((function () {
        return {
          meta: {
            'revision': 'Ember@2.7.0-beta.1',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 21
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
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
          statements: [['content', 'inbox/emails-list', ['loc', [null, [1, 0], [1, 21]]]]],
          locals: [],
          templates: []
        };
      })()));
      (0, _chai.expect)(this.$()).to.have.length(1);
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/integration/components/inbox/emails-list-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | integration/components/inbox/emails-list-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('integration/components/inbox/emails-list-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/integration/components/login/login-form-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeComponent)('login/login-form', 'Integration: LoginLoginFormComponent', {
    integration: true
  }, function () {
    (0, _emberMocha.it)('renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#login/login-form}}
      //     template content
      //   {{/login/login-form}}
      // `);

      this.render(Ember.HTMLBars.template((function () {
        return {
          meta: {
            'revision': 'Ember@2.7.0-beta.1',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 20
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
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
          statements: [['content', 'login/login-form', ['loc', [null, [1, 0], [1, 20]]]]],
          locals: [],
          templates: []
        };
      })()));
      (0, _chai.expect)(this.$()).to.have.length(1);
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/integration/components/login/login-form-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | integration/components/login/login-form-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('integration/components/login/login-form-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/integration/components/page/nav-bar-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeComponent)('page/nav-bar', 'Integration: PageNavBarComponent', {
    integration: true
  }, function () {
    (0, _emberMocha.it)('renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#page/nav-bar}}
      //     template content
      //   {{/page/nav-bar}}
      // `);

      this.render(Ember.HTMLBars.template((function () {
        return {
          meta: {
            'revision': 'Ember@2.7.0-beta.1',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 16
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
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
          statements: [['content', 'page/nav-bar', ['loc', [null, [1, 0], [1, 16]]]]],
          locals: [],
          templates: []
        };
      })()));
      (0, _chai.expect)(this.$()).to.have.length(1);
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/integration/components/page/nav-bar-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | integration/components/page/nav-bar-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('integration/components/page/nav-bar-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/integration/components/page/side-nav-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeComponent)('page/side-nav', 'Integration: PageSideNavComponent', {
    integration: true
  }, function () {
    (0, _emberMocha.it)('renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#page/side-nav}}
      //     template content
      //   {{/page/side-nav}}
      // `);

      this.render(Ember.HTMLBars.template((function () {
        return {
          meta: {
            'revision': 'Ember@2.7.0-beta.1',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 17
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
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
          statements: [['content', 'page/side-nav', ['loc', [null, [1, 0], [1, 17]]]]],
          locals: [],
          templates: []
        };
      })()));
      (0, _chai.expect)(this.$()).to.have.length(1);
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/integration/components/page/side-nav-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | integration/components/page/side-nav-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('integration/components/page/side-nav-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/models/email.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | models/email.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('models/email.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/models/user.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | models/user.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('models/user.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass jshint.');
  });
});
define('mail-app/tests/router.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | router.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('router.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/routes/application.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | routes/application.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('routes/application.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/routes/login.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | routes/login.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('routes/login.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/routes/mailbox/inbox.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | routes/mailbox/inbox.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('routes/mailbox/inbox.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/routes/mailbox/new.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | routes/mailbox/new.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('routes/mailbox/new.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/routes/mailbox.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | routes/mailbox.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('routes/mailbox.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/test-helper', ['exports', 'mail-app/tests/helpers/resolver', 'ember-mocha'], function (exports, _mailAppTestsHelpersResolver, _emberMocha) {

  (0, _emberMocha.setResolver)(_mailAppTestsHelpersResolver['default']);
});
define('mail-app/tests/test-helper.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | test-helper.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('test-helper.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/transforms/moment.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | transforms/moment.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('transforms/moment.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/unit/adapters/application-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeModule)('adapter:application', 'Unit | Adapter | application', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  }, function () {
    // Replace this with your real tests.
    (0, _emberMocha.it)('exists', function () {
      var adapter = this.subject();
      (0, _chai.expect)(adapter).to.be.ok;
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/unit/adapters/application-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | unit/adapters/application-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('unit/adapters/application-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/unit/models/email-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeModel)('email', 'Unit | Model | email', {
    // Specify the other units that are required for this test.
    needs: []
  }, function () {
    // Replace this with your real tests.
    (0, _emberMocha.it)('exists', function () {
      var model = this.subject();
      // var store = this.store();
      (0, _chai.expect)(model).to.be.ok;
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/unit/models/email-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | unit/models/email-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('unit/models/email-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/unit/models/user-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeModel)('user', 'Unit | Model | user', {
    // Specify the other units that are required for this test.
    needs: []
  }, function () {
    // Replace this with your real tests.
    (0, _emberMocha.it)('exists', function () {
      var model = this.subject();
      // var store = this.store();
      (0, _chai.expect)(model).to.be.ok;
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/unit/models/user-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | unit/models/user-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('unit/models/user-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/unit/routes/application-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeModule)('route:application', 'ApplicationRoute', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  }, function () {
    (0, _emberMocha.it)('exists', function () {
      var route = this.subject();
      (0, _chai.expect)(route).to.be.ok;
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/unit/routes/application-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | unit/routes/application-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('unit/routes/application-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/unit/routes/login-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeModule)('route:login', 'LoginRoute', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  }, function () {
    (0, _emberMocha.it)('exists', function () {
      var route = this.subject();
      (0, _chai.expect)(route).to.be.ok;
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/unit/routes/login-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | unit/routes/login-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('unit/routes/login-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/unit/routes/mailbox/inbox-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeModule)('route:mailbox/inbox', 'MailboxInboxRoute', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  }, function () {
    (0, _emberMocha.it)('exists', function () {
      var route = this.subject();
      (0, _chai.expect)(route).to.be.ok;
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/unit/routes/mailbox/inbox-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | unit/routes/mailbox/inbox-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('unit/routes/mailbox/inbox-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/unit/routes/mailbox/new-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeModule)('route:mailbox/new', 'MailboxNewRoute', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  }, function () {
    (0, _emberMocha.it)('exists', function () {
      var route = this.subject();
      (0, _chai.expect)(route).to.be.ok;
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/unit/routes/mailbox/new-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | unit/routes/mailbox/new-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('unit/routes/mailbox/new-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('mail-app/tests/unit/routes/mailbox-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeModule)('route:mailbox', 'MailboxRoute', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  }, function () {
    (0, _emberMocha.it)('exists', function () {
      var route = this.subject();
      (0, _chai.expect)(route).to.be.ok;
    });
  });
});
/* jshint expr:true */
define('mail-app/tests/unit/routes/mailbox-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | unit/routes/mailbox-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('unit/routes/mailbox-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
/* jshint ignore:start */

require('mail-app/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map