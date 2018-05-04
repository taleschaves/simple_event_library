_ = (function() {
  var events = {};
  var id = 0;

  function functionAlreadyRegistered(event_name, fn) {
    return typeof(events[event_name][fn.__uniqueId]) !== 'undefined';
  }

  function isEventRegistered(event_name) {
    return typeof(events[event_name]) !== 'undefined';
  }

  function deregisterFunctionFromEvent(event_name, fn) {
    delete events[event_name][fn.__uniqueId];
  }

  function assignIdToFunction(fn) {
    id++;
    fn.__uniqueId = id;
    return id;
  }

  return Object.assign({}, {
    on: function(event_name, callback) {
      if (isEventRegistered(event_name)) {
        if (!functionAlreadyRegistered(event_name, callback)) {
          const functionId = assignIdToFunction(callback);
          events[event_name][functionId] = callback;
        }
      } else {
        const functionId = assignIdToFunction(callback);
        events[event_name] = {};
        events[event_name][functionId] = callback;
      }
    },
    off: function(event_name, fn) {
      if (isEventRegistered(event_name)) {
        if (fn) {
          if (!functionAlreadyRegistered(event_name, fn)) {
            throw new Error('function not registered for event');
          }

          deregisterFunctionFromEvent(event_name, fn);
        }
        else {
          delete events[event_name];
        }
      } else {
        throw new Error('event not registered');
      }
    },
    trigger: function(event_name, args) {
       if (isEventRegistered(event_name)) {
        Object.keys(events[event_name]).forEach((key) => events[event_name][key](args));
      } else {
        throw new Error('Event not registered');
      }
    }
  });
})();


_.on('EVENT1', () => {console.log('event1')});
_.on('EVENT2', () => {console.log('event2')});
_.on('EVENT3', () => {console.log('event3')});

_.trigger('EVENT1');
_.trigger('EVENT2');
_.trigger('EVENT3');

_.off('EVENT1');

try {
  _.trigger('EVENT1');
} catch(e) { console.log(e) }

const func1 = (args) => {console.log('event1 - 1', args)};
const func2 = (args) => {console.log('event1 - 2')};

_.on('EVENT1', func1);
_.on('EVENT1', func2);
_.on('EVENT1', () => {console.log('event1 - 3')});

_.trigger('EVENT1', {a: 1});

_.off('EVENT1', func1);
_.trigger('EVENT1', {a: 1});
