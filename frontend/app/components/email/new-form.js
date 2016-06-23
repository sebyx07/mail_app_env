import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  router: Ember.inject.service('-routing'),
  tagName: 'form',

  submit(e){
    e.preventDefault();
    const to = this.get('to'),
      subject = this.get('subject'),
      payload = this.get('payload');

    this.get('store').createRecord('email', {to: to, subject: subject, payload: payload}).save().then(() => {
      this.get('router').transitionTo('mailbox.inbox');
    });
  }
});
