import Ember from 'ember';
import config from 'mail-app/config/environment';

export default Ember.Route.extend({
  model(){
    Ember.$.getJSON(config.serverHost + '/users/current_user')
    .then((data) => {
      this.store.pushPayload(data);
      this.transitionTo('mailbox.inbox');
    })
    .fail(() => {
      this.transitionTo('login');
    });
  }
});
