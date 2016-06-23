/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'email/new-form',
  'Integration: EmailNewFormComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#email/new-form}}
      //     template content
      //   {{/email/new-form}}
      // `);

      this.render(hbs`{{email/new-form}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
