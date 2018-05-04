_ = (function() {
  var events = {};

  function findFunctionIndex(event_name, fn) {
    return events[event_name].findIndex((_callback) => {
      return _callback === fn;
    });
  }

  function isEventRegistered(event_name) {
    return typeof(events[event_name]) !== 'undefined';
  }

  return Object.assign({}, {
    on: function(event_name, callback) {
      if (isEventRegistered(event_name)) {
        if (findFunctionIndex(event_name, callback) == -1) {
          events[event_name] = [].concat(events[event_name], [callback]);
        }
      } else {
        events[event_name] = [callback];
      }
    },
    off: function(event_name, fn) {
      if (isEventRegistered(event_name)) {
        if (fn) {
          const index = findFunctionIndex(event_name, fn);

          if (index !== -1) {
            const elementsBefore = events[event_name].slice(0, index);
            const elementsAfter = events[event_name].slice(index+1);

            events[event_name] = [].concat(elementsBefore, elementsAfter);
          } else {
            throw new Error('function not registered for event');
          }
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
        events[event_name].forEach((fn) => fn(args));
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
