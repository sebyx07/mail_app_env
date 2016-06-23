import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  subject: attr('string'),
  payload: attr('string'),
  to: attr('string'),
  createdAt: attr('moment'),
  user: belongsTo('user')
});
