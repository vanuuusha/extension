var ext_seassion_time;
var ext_scanner;        // для интервалов
var ext_req_scanner;    // для интервалов
var now_x = 0;
var now_y = 0;
var host_now = window.location.host;
var user_agent = navigator.userAgent;
var ext_key;
var timer_check;
var timer_request;
var body;
var host = '127.0.0.1:5000'

async function shoud_analyze() {
    let response = await fetch(`http://${host}/extinsion/api`, {
        method: "DELETE",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userAgent: user_agent})
      });
    if (response.ok) { 
        let json = await response.json();
        let answ = json.checked;
        return answ;
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
    return false;
}
  
async function check_storage() {
    var storage = Number(localStorage.getItem(ext_key));
    if (isNaN(storage)) {
        return 0;
    }
    else {
        if (storage == 15005) {
        var answ = await shoud_analyze();
            if (!answ) {
                return 0;
            }
        }
        return storage;
    }
}

async function ask_for_block () {
    let response = await fetch(`http://${host}/extinsion/block`, {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userAgent: user_agent})
      });
    if (response.ok) { 
        let json = await response.json();
        let answ = json.block;
        if (answ) {
            document.write('Вы заблокированы')
        } 
    } 
    return false;
}

function get_info() {
    if (ext_seassion_time > 15000) {
        clearInterval(ext_scanner);
        clearInterval(ext_req_scanner);
        send_request();
        var p = document.getElementById('ext_best_counter');
        p.style.backgroundColor = 'green'; // срабатывает в самом конце
        p.innerHTML = 'Вы авторизованы'; // тут будет блокировка)))
        ask_for_block();
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
    fetch(`http://${host}/extinsion/api`, {
  method: "PUT",
  headers: {
    "Accept": "*/*",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body)
});
    localStorage.setItem(ext_key, ext_seassion_time);
    body = {
        userAgent: user_agent, 
        host: host_now
    };
}

window.onload = async function () {
    body = {
        userAgent: user_agent, 
        host: host_now
    };
    ext_key = 'ext_key';
    timer_request = 4000;
    timer_check = 5;
    ext_seassion_time = await check_storage();
    ext_scanner = setInterval(get_info, timer_check);
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
p.style.fontSize = '20px';
p.innerHTML = 'Вы авторизованы';
p.style.height = '40px';
parent.insertBefore(p, parent.firstElementChild);
