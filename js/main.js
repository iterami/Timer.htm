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
      'events': {
        'add-split': {
          'onclick': add_split,
        },
        'reset-key-display': {
          'onclick': reset_timer,
        },
        'start-key-display': {
          'onclick': start,
        },
        'stop': {
          'onclick': stop,
        },
      },
      'globals': {
        'current_time': {
          'hours': 0,
          'minutes': 0,
          'seconds': 0,
          'milliseconds': 0,
        },
        'start_time': -1,
        'time_ms': 0,
      },
      'keybinds': {
        32: {
          'todo': add_split,
        },
        84: {
          'todo': reset_timer,
        },
        88: {
          'todo': start,
        },
      },
      'title': 'Timer.htm',
    });

    core_html_store({
      'ids': [
        'hours',
        'milliseconds',
        'minutes',
        'seconds',
        'splits',
      ],
    });
    core_interval_modify({
      'id': 'timer',
      'paused': true,
      'todo': draw,
    });
}
