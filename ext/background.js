var configuration = {
    headers: read_property("headers"),
    method: read_property("method"),
    initiator: read_property("initiator"),
    url: read_property("url"),
    timestamp: read_property("timestamp"),
    type: read_property("type"),
    document: read_property("document"),
    frame: read_property("frame"),
    request: read_property("request"),
}

function read_property(prop_name) {
    if (localStorage[prop_name] == null) {
        return true;
    }
    if (localStorage[prop_name] == 'true') {
        return true
    }
    return false;
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    let now_state = read_property(msg);
    localStorage[msg] = !now_state;
    configuration[msg] = !now_state;
    return true;
})


function MyHeader (name, value) {
    this.name = name;
    this.value = value;
}

function check_add_handler (details, json_body) {
    if (configuration.headers) {
        let header_length = details.requestHeaders.length;
        json_body.headers = Array(header_length);
        for (let i = 0; i < header_length; i++) {
            let now_header = details.requestHeaders[i];
            json_body.headers[i] = new MyHeader(now_header.name, now_header.value);
        }
    }
}

function check_add_method (details, json_body) {
    if (configuration.method) {
        json_body.method = details.method;
    }
}

function check_add_initiator (details, json_body) {
    if (configuration.initiator) {
        json_body.initiator = details.initiator;
    }
}

function check_add_url (details, json_body) {
    if (configuration.url) {
        json_body.url = details.url;
    }
}

function check_add_timestamp (details, json_body) {
    if (configuration.timestamp) {
        json_body.timestamp = details.timeStamp;
    }
}

function check_add_type (details, json_body) {
    if (configuration.type) {
        json_body.type = details.type;
    }
}

function check_add_document (details, json_body) {
    if (configuration.document) {
        json_body.document = {
            document_id: details.documentId,
            document_life_cycle: details.documentLifecycle,
            parent_document_id: details.parentDocumentId,
        };
    }
}

function check_add_frame (details, json_body) {
    if (configuration.frame) {
        json_body.frame = {
            frame_id: details.frameId,
            frame_type: details.frameType,
            parent_frame_id: details.parentFrameId,
        };
    }
}

function check_add_request (details, json_body) {
    if (configuration.request) {
        json_body.request = {
            request_id: details.requestId,
            table_id: details.tabId,
        };
    }
}

chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
    var req_url = details.url // берем url сайта, на который идет запрос
    if (!req_url.includes("127.0.0.1:5001")) {
        var x = new XMLHttpRequest();
        var json_body = {}
        x.open("POST", "http://127.0.0.1:5001/extinsion/api", true); // открывает ассинхронный запрос
        check_add_handler(details, json_body);
        check_add_method(details, json_body);
        check_add_initiator(details, json_body);
        check_add_url(details, json_body);
        check_add_timestamp(details, json_body);
        check_add_type(details, json_body);
        check_add_document(details, json_body);
        check_add_frame(details, json_body);
        check_add_request(details, json_body);
        x.send(JSON.stringify(json_body));
    }
    return {requestHeaders: details.requestHeaders};
  },
  {urls: [ "<all_urls>" ]},['requestHeaders']);