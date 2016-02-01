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
    time_ms = new Date().getTime() - start_time;
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
    if(current_time['milliseconds'] < 10){
        current_time['milliseconds'] = '00' + current_time['milliseconds'];

    }else if(current_time['milliseconds'] < 100){
        current_time['milliseconds'] = '0' + current_time['milliseconds'];
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

function reset_settings(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    var ids = {
      'reset-key': 'T',
      'reset-key-display': 'Reset [T]',
      'start-key': 'H',
      'start-key-display': 'Start [H]',
    };
    for(var id in ids){
        document.getElementById(id).innerHTML = ids[id];
    }

    save();
}

// Save settings into window.localStorage if they differ from default.
function save(){
    var ids = {
      'start-key': 'H',
      'reset-key': 'T',
    };
    for(var id in ids){
        var value = document.getElementById(id).value;
        if(value === ids[id]){
            window.localStorage.removeItem('Timer.htm-' + id);

        }else{
            window.localStorage.setItem(
              'Timer.htm-' + id,
              value
            );
        }
    }

    // Update button labels.
    document.getElementById('reset-key-display').value =
      'Reset [' + document.getElementById('reset-key').value + ']';
    document.getElementById('start-key-display').value =
      'Start [' + document.getElementById('start-key').value + ']';
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
    start_time = new Date().getTime() - (start_time === -1 ? 0 : time_ms);
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

window.onbeforeunload = function(){
    if(start_time > -1){
        return 'Timer and splits not yet saveable. Leave?';
    }
};

window.onload = function(e){
    // Fetch reset key from window.localStorage.
    if(window.localStorage.getItem('Timer.htm-reset-key')){
        document.getElementById('reset-key').value = window.localStorage.getItem('Timer.htm-reset-key');
        document.getElementById('reset-key-display').value =
          'Reset [' + window.localStorage.getItem('Timer.htm-reset-key') + ']';

    }else{
        document.getElementById('reset-key').value = 'T';
    }

    // Fetch start key from window.localStorage.
    if(window.localStorage.getItem('Timer.htm-start-key')){
        document.getElementById('start-key').value = window.localStorage.getItem('Timer.htm-start-key');
        document.getElementById('start-key-display').value =
          'Start [' + window.localStorage.getItem('Timer.htm-start-key') + ']';

    }else{
        document.getElementById('start-key').value = 'H';
    }

    // Make settings save when settings inputs are updated.
    document.getElementById('reset-key').oninput
      = document.getElementById('start-key').oninput = save;
};

window.onkeydown = function(e){
    var key = e.keyCode || e.which;

    // Space: add split.
    if(key === 32){
        e.preventDefault();
        add_split();

    // ESC: stop timer.
    }else if(key === 27){
        stop();

    // +: show settings.
    }else if(key === 187){
        settings_toggle(true);

    // -: hide settings.
    }else if(key === 189){
        settings_toggle(false);

    }else{
        key = String.fromCharCode(key);

        if(key === document.getElementById('start-key').value){
            start();

        }else if(key === document.getElementById('reset-key').value){
            reset_timer();
        }
    }
};
