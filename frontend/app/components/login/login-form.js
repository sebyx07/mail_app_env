import Ember from 'ember';
import config from 'mail-app/config/environment';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  router: Ember.inject.service('-routing'),

  tagName: 'form',
  classNames: ['col s12', 'login--login-form'],

  submit(e){
    e.preventDefault();
    const email = this.get('email'),
      password = this.get('password');

    Ember.$.post(config.serverHost + '/users/login', {email: email, password: password})
      .done((data) => {
        this.get('store').pushPayload(data);
        this.get('router').transitionTo('mailbox');
      });
  }
});
