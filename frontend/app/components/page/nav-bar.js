import Ember from 'ember';

export default Ember.Component.extend({
  router: Ember.inject.service('-routing'),
  tagName: 'nav',

  actions: {
    logout(){
      Ember.$.post('/users/logout')
        .done(() => {
          this.get('router').transitionTo('login');
        });
    }
  }
});
