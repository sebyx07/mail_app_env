import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  router: Ember.inject.service(),

  tagName: 'form',
  classNames: ['col s12', 'login--login-form'],

  submit(e){
    e.preventDefault();
    const email = this.get('email'),
      password = this.get('password');
    debugger;

    Ember.$.post('/users/login', {email: email, password: password})
      .done((data) => {
        this.get('store').pushPayload(data);
      });
  }
});