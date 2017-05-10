/**
 * Catalog model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Catalog = require('../../sqldb').Catalog;
var CatalogEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CatalogEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Catalog.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    CatalogEvents.emit(event + ':' + doc._id, doc);
    CatalogEvents.emit(event, doc);
    done(null);
  }
}

module.exports = CatalogEvents;
