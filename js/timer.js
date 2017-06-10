'use strict';

function add_split(){
    if(!interval_running){
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
    time_ms = time_date_to_timestamp() - start_time;
    current_time['hours'] = Math.floor(time_ms / 3600000);
    current_time['minutes'] = Math.floor(time_ms / 60000) % 60;
    current_time['seconds'] = Math.floor(time_ms / 1000) % 60;
    current_time['milliseconds'] = time_ms % 1000;

    // Extra zero for minutes?
    if(current_time['minutes'] < 10){
        current_time['minutes'] = '0' + current_time['minutes'];
    }

    // Extra zero for seconds?
    if(current_time['seconds'] < 10){
        current_time['seconds'] = '0' + current_time['seconds'];
    }

    // Extra zero(s) for milliseconds?
    if(current_time['milliseconds'] < 100){
        current_time['milliseconds'] = '0' + current_time['milliseconds'];
        if(current_time['milliseconds'] < 10){
            current_time['milliseconds'] = '0' + current_time['milliseconds'];
        }
    }
}

function draw(){
    calculate_time();
    var ids = [
      'hours',
      'milliseconds',
      'minutes',
      'seconds',
    ];
    for(var id in ids){
        document.getElementById(ids[id]).innerHTML = current_time[ids[id]];
    }
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
        187: {
          'todo': function(){
              settings_toggle(true);
          },
        },
        189: {
          'todo': function(){
              settings_toggle(false);
          },
        },
      },
      'title': 'Timer.htm',
    });

    document.getElementById('settings').innerHTML =
      'Start: <input disabled value=H><br>'
        + 'Split: <input disabled value=Space><br>'
        + 'Stop: <input disabled value=ESC><br>'
        + 'Reset: <input disabled value=T>';

    document.getElementById('add-split').onclick = add_split;
    document.getElementById('reset-key-display').onclick = reset_timer;
    document.getElementById('reset-key-display').value = 'Reset [T]';
    document.getElementById('settings-toggle').onclick = function(){
        settings_toggle();
    };
    document.getElementById('start-key-display').onclick = start;
    document.getElementById('start-key-display').value = 'Start [H]';
    document.getElementById('stop').onclick = stop;
}

function reset_timer(){
    if(!window.confirm('Clear splits and reset timer?')){
        return;
    }

    stop();

    start_time = -1;

    var ids = {
      'hours': '0',
      'milliseconds': '000',
      'minutes': '00',
      'seconds': '00',
      'splits': '',
    };
    for(var id in ids){
        document.getElementById(id).innerHTML = ids[id];
    }
}

function settings_toggle(state){
    state = state == void 0
      ? document.getElementById('controls').style.display === 'none'
      : state;

    document.getElementById('controls').style.display =
      state
        ? 'inline'
        : 'none';
    document.getElementById('settings').style.display =
      state
        ? 'inline'
        : 'none';
}

function start(){
    stop();
    document.getElementById('reset-key-display').value = 'Reset [T]';
    document.getElementById('start-key-display').value = 'Start [H]';
    start_time = time_date_to_timestamp() - (start_time === -1 ? 0 : time_ms);
    interval = setInterval(
      draw,
      20
    );
    interval_running = true;
}

function stop(){
    clearInterval(interval);
    interval_running = false;
}

var current_time = {
  'hours': 0,
  'minutes': 0,
  'seconds': 0,
  'milliseconds': 0,
};
var interval = 0;
var interval_running = false;
var start_time = -1;
var time_ms = 0;
