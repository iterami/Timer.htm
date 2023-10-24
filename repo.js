'use strict';

function add_split(){
    if(core_intervals['timer']['paused']){
        return;
    }

    calculate_time();
    document.getElementById('splits').innerHTML +=
      current_time['hours'] + ':'
      + current_time['minutes'] + ':'
      + current_time['seconds'] + '.'
      + current_time['milliseconds'] + '<br>';
}

function calculate_time(){
    time_ms = date_to_timestamp() - start_time;
    current_time['hours'] = Math.floor(time_ms / 3600000);
    current_time['minutes'] = Math.floor(time_ms / 60000) % 60;
    current_time['seconds'] = Math.floor(time_ms / 1000) % 60;
    current_time['milliseconds'] = time_ms % 1000;

    current_time['minutes'] = core_digits_min({
      'number': current_time['minutes'],
    });
    current_time['seconds'] = core_digits_min({
      'number': current_time['seconds'],
    });
    current_time['milliseconds'] = core_digits_min({
      'digits': 3,
      'number': current_time['milliseconds'],
    });
}

function draw(){
    calculate_time();
    core_ui_update({
      'ids': {
        'hours': current_time['hours'],
        'milliseconds': current_time['milliseconds'],
        'minutes': current_time['minutes'],
        'seconds': current_time['seconds'],
      },
    });
    document.title = current_time['hours'] + ':'
      + current_time['minutes'] + ':'
      + current_time['seconds'] + '.'
      + current_time['milliseconds'] + ' - ' + core_repo_title;
}

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
        'KeyT': {
          'todo': reset_timer,
        },
        'KeyX': {
          'todo': start,
        },
        'Space': {
          'todo': add_split,
        },
      },
      'title': 'Timer.htm',
    });
    core_interval_modify({
      'id': 'timer',
      'paused': true,
      'todo': draw,
    });
}

function reset_timer(){
    if(core_menu_open
      || !globalThis.confirm('Clear splits and reset timer?')){
        return;
    }

    stop();

    start_time = -1;

    core_ui_update({
      'ids': {
        'hours': '0',
        'milliseconds': '000',
        'minutes': '00',
        'seconds': '00',
      },
    });
    document.title = '0:00:00.000';
}

function start(){
    if(core_menu_open){
        return;
    }

    document.getElementById('reset-key-display').value = 'Reset [T]';
    document.getElementById('start-key-display').value = 'Start [X]';
    start_time = date_to_timestamp() - (start_time === -1 ? 0 : time_ms);
    core_interval_resume_all();
}

function stop(){
    core_interval_pause_all();
}
