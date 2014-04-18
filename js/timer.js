function add_split(){
    if(interval != 0){
        calculate_time();
        document.getElementById('splits').innerHTML += current_time[0] + ':'
          + current_time[1] + ':'
          + current_time[2] + '.'
          + current_time[3] + '<br>';
    }
}

function calculate_time(){
    time_ms = new Date().getTime() - start_time;
    current_time = [
      Math.floor(time_ms / 3600000),// hours
      Math.floor(time_ms / 60000) % 60,// minutes
      Math.floor(time_ms / 1000) % 60,// seconds
      time_ms % 1000// milliseconds
    ];

    // extra zero for minutes?
    if(current_time[1] < 10){
        current_time[1] = '0' + current_time[1];
    }

    // extra zero for seconds?
    if(current_time[2] < 10){
        current_time[2] = '0' + current_time[2];
    }

    // extra zeros for milliseconds?
    if(current_time[3] < 10){
        current_time[3] = '00' + current_time[3];
    }else if(current_time[3] < 100){
        current_time[3] = '0' + current_time[3];
    }
}

function draw(){
    calculate_time();
    document.getElementById(0).innerHTML = current_time[0];
    document.getElementById(1).innerHTML = current_time[1];
    document.getElementById(2).innerHTML = current_time[2];
    document.getElementById(3).innerHTML = current_time[3];
}

function reset_timer(){
    if(confirm('Clear splits and reset timer?')){
        stop();
        start_time = -1;
        document.getElementById(0).innerHTML = 0;
        document.getElementById(1).innerHTML = '00';
        document.getElementById(2).innerHTML = '00';
        document.getElementById(3).innerHTML = '000';
        document.getElementById('splits').innerHTML = '';
    }
}

function reset_settings(){
    if(confirm('Reset settings?')){
        document.getElementById('start-key').value = 'H';
        document.getElementById('start-key-display').value = 'Start [H]';

        document.getElementById('reset-key').value = 'T';
        document.getElementById('reset-key-display').value = 'Reset [T]';

        save();
    }
}

function save(){
    i = 1;
    do{
        if(document.getElementById(['start-key','reset-key'][i]).value == ['H', 'T'][i]){
            window.localStorage.removeItem('timer' + i);

        }else{
            window.localStorage.setItem(
              'timer' + i,
              document.getElementById(['start-key','reset-key'][i]).value
            );
        }
    }while(i--);

    document.getElementById('reset-key-display').value = 'Reset [' + document.getElementById('reset-key').value + ']';
    document.getElementById('start-key-display').value = 'Start [' + document.getElementById('start-key').value + ']';
}

function showhide(){
    document.getElementById('controls').style.display = document.getElementById('controls').style.display === 'none'
      ? 'inline'
      : 'none';
    document.getElementById('settings').style.display = document.getElementById('settings').style.display === 'none'
      ? 'inline'
      : 'none';
}

function start(){
    stop();
    start_time = new Date().getTime() - (start_time === -1 ? 0 : time_ms);
    interval = setInterval('draw()', 20);
}

function stop(){
    clearInterval(interval);
    interval = 0;
}

var current_time = 0;
var i = 0;
var interval = 0;
var start_time = -1;
var time_ms = 0;

// fetch start key from localStorage
if(window.localStorage.getItem('timer0')){
    document.getElementById('start-key').value = window.localStorage.getItem('timer0');
    document.getElementById('start-key-display').value = 'Start [' + window.localStorage.getItem('timer0') + ']';

}else{
    document.getElementById('start-key').value = 'H';
}

// fetch reset key from localStorage
if(window.localStorage.getItem('timer1')){
    document.getElementById('reset-key').value = window.localStorage.getItem('timer1');
    document.getElementById('reset-key-display').value = 'Reset [' + window.localStorage.getItem('timer1') + ']';

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

    if(key === 32){// Space
        e.preventDefault();
        add_split();

    }else if(key === 27){// ESC
        stop();

    }else{
        key = String.fromCharCode(key);

        if(key === document.getElementById('start-key').value){
            start();

        }else if(key === document.getElementById('reset-key').value){
            reset_timer();
        }
    }
}
