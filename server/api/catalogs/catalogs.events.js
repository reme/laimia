/**
 * Catalogs model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Catalogs = require('../../sqldb').Catalogs;
var CatalogsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CatalogsEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Catalogs.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    CatalogsEvents.emit(event + ':' + doc._id, doc);
    CatalogsEvents.emit(event, doc);
    done(null);
  }
}

module.exports = CatalogsEvents;
