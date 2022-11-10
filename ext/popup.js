function listener (event) {
    let elem = event.target;
    change_state(elem);
    chrome.runtime.sendMessage(elem.id);
}

function change_state (elem) {
        elem.classList.toggle("switch-on")
}

function make_check_and_onclick (elems_names) {
    for (let i = 0; i < elems_names.length; i++) {
        let elem = document.getElementById(elems_names[i]);
        elem.onclick = listener;
        let now_property = read_property(elem.id);
        if (!now_property) {
            elem.classList.remove("switch-on")
        } 
    }
}

window.onload = function() {
    let elems_names = ["headers", "method", "initiator", "url", "timestamp", "type", "document", "frame", "request"];
    make_check_and_onclick(elems_names);
};

function read_property(prop_name) {
    if (localStorage[prop_name] == null) {
        return true;
    }
    if (localStorage[prop_name] == 'true') {
        return true
    }
    return false;
}