var ext_seassion_time = check_storage();
var ext_scanner;        // для интервалов
var ext_req_scanner;    // для интервалов
var now_x = 0;
var now_y = 0;
var host = window.location.hostname;
var user_agent = navigator.userAgent;
var timer_check = 5;
var timer_request = 4000;

var body = {
    userAgent: user_agent, 
    host: host
};
  
function check_storage() {
    if (localStorage.getItem(host) == null) {
        return 0;
    }
    else {
        alert("ТЫ ЗДЕСЬ");
        return Number(localStorage.getItem(host));
    }
}

function give_info() {
    if (ext_seassion_time > 15000) {
        clearInterval(ext_scanner);
        clearInterval(ext_req_scanner);
        send_request();
        localStorage[host] = null;
        var p = document.getElementById('ext_best_counter');
        p.style.backgroundColor = 'green';
    } else {
        ext_seassion_time += timer_check;
        body[ext_seassion_time / timer_check] = {
            X: now_x,
            Y :now_y,
            timestamp: ext_seassion_time
        };
        var p = document.getElementById('ext_best_counter');
        p.innerHTML = `${ext_seassion_time}`;
    }
}

function send_request() {
    fetch('http://127.0.0.1:5000/extinsion/api', {
  method: "PUT",
  headers: {
    "Accept": "*/*",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body)
});
    localStorage.setItem(host, ext_seassion_time);
    body = {
        userAgent: user_agent, 
        host: host
    }
}

window.onload = function () {
    ext_scanner = setInterval(give_info, timer_check);
    ext_req_scanner = setInterval(send_request, timer_request);
}

document.onmousemove = function (event) {
    now_x = event.pageX;
    now_y = event.pageY;
}

window.addEventListener("unload", send_request());
let parent = document.querySelector('body')
let p = document.createElement('div');
p.id = 'ext_best_counter';
p.style.backgroundColor = 'red';
p.style.position =  'fixed';
p.style.zIndex = '3000';
p.style.bottom = '5px';
p.style.left = '500px';
p.width = '200px';
p.style.height = '40px';
parent.insertBefore(p, parent.firstElementChild);
