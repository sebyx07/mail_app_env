import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    Ember.$.getJSON('/users/current_user').then((data) => {
      this.store.pushPayload(data);
    });
  }
});
