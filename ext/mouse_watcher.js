var ext_seassion_time;
var ext_scanner;        // для интервалов
var ext_req_scanner;    // для интервалов
var shoud_analyze;      // должны ли посылаться данные
var now_x = window.innerWidth / 2;
var now_y = window.innerWidth / 2;
var host_now = window.location.host;
var user_agent = navigator.userAgent;
var ext_key;
var timer_check;
var timer_request;
var body;
var host = '127.0.0.1:5000';


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
        if (storage >= 15005) {
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
        } else {
            p.style.backgroundColor = 'green'; // срабатывает в самом конце
            p.innerHTML = `Вы авторизованы ${json.count_checks}`;

        } 
    } 
}

function get_info() {
    if (ext_seassion_time > 15000) {
        clearInterval(ext_scanner);
        clearInterval(ext_req_scanner);
        send_request();
        var p = document.getElementById('ext_best_counter');
        ask_for_block();
        console.log('ask_for_block');
    } else {
        ext_seassion_time += timer_check;
        body[ext_seassion_time / timer_check] = {
            X: now_x,
            Y :now_y,
            timestamp: ext_seassion_time,
            url: window.location.href
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
        x: window.innerWidth,
        y: window.innerHeight
    };
}

var start = async function () {
    body = {
        userAgent: user_agent, 
        x: window.innerWidth,
        y: window.innerHeight
    };
    ext_key = 'ext_key';
    timer_request = 4000;
    timer_check = 10;
    ext_seassion_time = await check_storage();

    if (ext_seassion_time < 15000) {
        ext_scanner = setInterval(get_info, timer_check);
        ext_req_scanner = setInterval(send_request, timer_request);
    } else {
        ask_for_block();
        p.style.backgroundColor = 'green'; // срабатывает если все хорошо
        p.innerHTML = `Вы авторизованы`;
    }
}

window.onload = function() {
    var first_mouth_move = true;
    document.onmousemove = function (event) {
        now_x = event.pageX;
        now_y = event.pageY;
        if (first_mouth_move) {
            start();
            first_mouth_move = false;
        }
    }
}

function exit_from_page() {
    clearInterval(ext_scanner);
    clearInterval(ext_req_scanner);
    send_request();
}

window.addEventListener("beforeunload", exit_from_page);
let parent = document.querySelector('body')
let p = document.createElement('div');
p.id = 'ext_best_counter';
p.style.backgroundColor = 'red';
p.style.position =  'fixed';
p.style.zIndex = '3000';
p.style.bottom = '5px';
p.style.left = `${window.innerWidth / 2 - 150}px`;
p.style.fontSize = '20px';
p.innerHTML = 'Проверка';
p.style.height = '40px';
parent.insertBefore(p, parent.firstElementChild);
