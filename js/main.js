'use strict';

function repo_escape(){
    stop();
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(){
            if(start_time > -1){
                return 'Timer and splits not yet saveable. Leave?';
            }
        },
      },
      'globals': {
        'current_time': {
          'hours': 0,
          'minutes': 0,
          'seconds': 0,
          'milliseconds': 0,
        },
        'interval': 0,
        'interval_running': false,
        'start_time': -1,
        'time_ms': 0,
      },
      'info-events': {
        'add-split': {
          'todo': add_split,
        },
        'stop': {
          'todo': stop,
        },
      },
      'keybinds': {
        32: {
          'todo': add_split,
        },
        72: {
          'todo': start,
        },
        84: {
          'todo': reset_timer,
        },
      },
      'title': 'Timer.htm',
    });

    core_html_modify({
      'id': 'reset-key-display',
      'properties': {
        'onclick': reset_timer,
        'value': 'Reset [T]',
      },
    });
    core_html_modify({
      'id': 'start-key-display',
      'properties': {
        'onclick': start,
        'value': 'Start [H]',
      },
    });
}
