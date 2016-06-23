import JSONAPIAdapter from 'ember-data/adapters/json-api';
import config from 'mail-app/config/environment';

export default JSONAPIAdapter.extend({
  host: config.serverHost
});
