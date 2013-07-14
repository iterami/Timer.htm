function add_split(){
    if(interval != 0){
        calculate_time();
        get('splits').innerHTML += current_time[0] + ':'
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
    get(0).innerHTML = current_time[0];
    get(1).innerHTML = current_time[1];
    get(2).innerHTML = current_time[2];
    get(3).innerHTML = current_time[3];
}

function get(i){
    return document.getElementById(i);
}

function reset_timer(){
    if(confirm('Clear splits and reset timer?')){
        stop();
        start_time = -1;
        get(0).innerHTML = 0;
        get(1).innerHTML = '00';
        get(2).innerHTML = '00';
        get(3).innerHTML = '000';
        get('splits').innerHTML = '';
    }
}

function reset_settings(){
    if(confirm('Reset settings?')){
        get('start-key').value = 'H';
        get('start-key-display').innerHTML = 'H';

        get('reset-key').value = 'T';
        get('reset-key-display').innerHTML = 'T';

        save();
    }
}

function save(){
    i = 1;
    do{
        if(get(['start-key','reset-key'][i]).value == ['H', 'T'][i]){
            ls.removeItem('timer' + i);

        }else{
            ls.setItem(
                'timer' + i,
                get(['start-key','reset-key'][i]).value
            );
        }
    }while(i--);

    get('reset-key-display').innerHTML = get('reset-key').value;
    get('start-key-display').innerHTML = get('start-key').value;
}

function showhide(){
    get('controls').style.display = get('controls').style.display === 'none' ? 'inline' : 'none';
    get('settings').style.display = get('controls').style.display === 'none' ? 'inline' : 'none';
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
var ls = window.localStorage;
var start_time = -1;
var time_ms = 0;

// fetch start key from localStorage
if(ls.getItem('timer0')){
    get('start-key').value = ls.getItem('timer0');
    get('start-key-display').innerHTML = ls.getItem('timer0');

}else{
    get('start-key').value = 'H';
}

// fetch reset key from localStorage
if(ls.getItem('timer1')){
    get('reset-key').value = ls.getItem('timer1');
    get('reset-key-display').innerHTML = ls.getItem('timer1');

}else{
    get('reset-key').value = 'T';
}

window.onbeforeunload = function(){
    if(start_time > -1){
        return 'Timer and splits not yet saveable. Leave?';
    }
};

window.onkeydown = function(e){
    i = window.event ? event : e;
    i = i.charCode ? i.charCode : i.keyCode;

    if(i === 32){// Space
        e.preventDefault();
        add_split();

    }else if(i === 27){// ESC
        stop();

    }else if(String.fromCharCode(i) === get('start-key').value){
        start();

    }else if(String.fromCharCode(i) === get('reset-key').value){
        reset_timer();
    }
}
