/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'inbox/emails-list',
  'Integration: InboxEmailsListComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#inbox/emails-list}}
      //     template content
      //   {{/inbox/emails-list}}
      // `);

      this.render(hbs`{{inbox/emails-list}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
