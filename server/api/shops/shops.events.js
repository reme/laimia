/**
 * Shops model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Shops = require('../../sqldb').Shop;
var ShopsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ShopsEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Shops.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ShopsEvents.emit(event + ':' + doc._id, doc);
    ShopsEvents.emit(event, doc);
    done(null);
  }
}

module.exports = ShopsEvents;
