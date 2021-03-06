/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'login/login-form',
  'Integration: LoginLoginFormComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#login/login-form}}
      //     template content
      //   {{/login/login-form}}
      // `);

      this.render(hbs`{{login/login-form}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
