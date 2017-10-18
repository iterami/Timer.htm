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

function start(){
    stop();
    document.getElementById('reset-key-display').value = 'Reset [T]';
    document.getElementById('start-key-display').value = 'Start [H]';
    start_time = time_date_to_timestamp() - (start_time === -1 ? 0 : time_ms);
    interval = setInterval(
      draw,
      core_storage_data['frame-ms']
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