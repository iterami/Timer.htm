function add_split(){
    if(interval != 0){
        calculate_time();
        document.getElementById('splits').innerHTML +=
          current_time['hours'] + ':'
          + current_time['minutes'] + ':'
          + current_time['seconds'] + '.'
          + current_time['milliseconds'] + '<br>';
    }
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
    document.getElementById('hours').innerHTML = current_time['hours'];
    document.getElementById('minutes').innerHTML = current_time['minutes'];
    document.getElementById('seconds').innerHTML = current_time['seconds'];
    document.getElementById('milliseconds').innerHTML = current_time['milliseconds'];
}

function reset_timer(){
    if(!confirm('Clear splits and reset timer?')){
        return;
    }

    stop();

    start_time = -1;

    document.getElementById('hours').innerHTML = 0;
    document.getElementById('minutes').innerHTML = '00';
    document.getElementById('seconds').innerHTML = '00';
    document.getElementById('milliseconds').innerHTML = '000';

    document.getElementById('splits').innerHTML = '';
}

function reset_settings(){
    if(!confirm('Reset settings?')){
        return;
    }

    document.getElementById('start-key').value = 'H';
    document.getElementById('start-key-display').value = 'Start [H]';

    document.getElementById('reset-key').value = 'T';
    document.getElementById('reset-key-display').value = 'Reset [T]';

    save();
}

function save(){
    var loop_counter = 1;
    do{
        var id = [
          'start-key',
          'reset-key',
        ][loop_counter];

        if(document.getElementById(id).value == ['H', 'T',][loop_counter]){
            window.localStorage.removeItem('Timer.htm-' + id);

        }else{
            window.localStorage.setItem(
              'timer' + id,
              document.getElementById(id).value
            );
        }
    }while(loop_counter--);

    document.getElementById('reset-key-display').value =
      'Reset [' + document.getElementById('reset-key').value + ']';
    document.getElementById('start-key-display').value =
      'Start [' + document.getElementById('start-key').value + ']';
}

function showhide(){
    document.getElementById('controls').style.display =
      document.getElementById('controls').style.display === 'none'
        ? 'inline'
        : 'none';
    document.getElementById('settings').style.display =
      document.getElementById('settings').style.display === 'none'
        ? 'inline'
        : 'none';
}

function start(){
    stop();
    start_time = new Date().getTime() - (start_time === -1 ? 0 : time_ms);
    interval = setInterval(
      'draw()',
      20
    );
}

function stop(){
    clearInterval(interval);
    interval = 0;
}

var current_time = {
  'hours': 0,
  'minutes': 0,
  'seconds': 0,
  'milliseconds': 0,
};
var interval = 0;
var start_time = -1;
var time_ms = 0;

// Fetch start key from window.localStorage.
if(window.localStorage.getItem('Timer.htm-start-key')){
    document.getElementById('start-key').value = window.localStorage.getItem('Timer.htm-start-key');
    document.getElementById('start-key-display').value =
      'Start [' + window.localStorage.getItem('Timer.htm-start-key') + ']';

}else{
    document.getElementById('start-key').value = 'H';
}

// Fetch reset key from window.localStorage.
if(window.localStorage.getItem('Timer.htm-reset-key')){
    document.getElementById('reset-key').value = window.localStorage.getItem('Timer.htm-reset-key');
    document.getElementById('reset-key-display').value =
      'Reset [' + window.localStorage.getItem('Timer.htm-reset-key') + ']';

}else{
    document.getElementById('reset-key').value = 'T';
}

window.onbeforeunload = function(){
    if(start_time > -1){
        return 'Timer and splits not yet saveable. Leave?';
    }
};

window.onkeydown = function(e){
    var key = window.event ? event : e;
    key = key.charCode ? key.charCode : key.keyCode;

    // Space: add split.
    if(key === 32){
        e.preventDefault();
        add_split();

    // ESC: stop timer.
    }else if(key === 27){
        stop();

    }else{
        key = String.fromCharCode(key);

        if(key === document.getElementById('start-key').value){
            start();

        }else if(key === document.getElementById('reset-key').value){
            reset_timer();
        }
    }
};
