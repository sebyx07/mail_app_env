import Ember from 'ember';
import config from 'mail-app/config/environment';

export default Ember.Component.extend({
  router: Ember.inject.service('-routing'),
  tagName: 'nav',

  actions: {
    logout(){
      Ember.$.post(config.serverHost +  '/users/logout')
        .done(() => {
          this.get('router').transitionTo('login');
        });
    }
  }
});
