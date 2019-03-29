import * as request from 'request';

const login_data = {
    'email': '',
    'password': '',
    'remember_me': false,
    'client_key': ''
};

const device_list = {
    url: 'https://login.partizancloud.com:443/restProtected/getUserDevicesLite',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': ''
    },
    body: "json={}"
};

const device_id = {
    url: 'https://login.partizancloud.com:443/restProtected/getPrivateStream',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': ''
    },
    body: ''
}; 
function loginToPartizan() {
    let options = {
        url: 'https://login.partizancloud.com:443/rest/securityLogin',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: "json=" + JSON.stringify(login_data)
    };
    return new Promise(function(resolve, reject) {
        request.post(options, function(err, resp: any, body) {
            if (err) {
                reject(err);
            } else {
                //If error code in body and === "O" login succeeded
                console.log("BODY is: ", body)
                resolve(resp);
            }
        });
    });
};

/* loginToPartizan().then((data) => {
    device_list.headers.Cookie = data.headers["set-cookie"][0];
    console.log(device_list);
}); */

function GetDevicelist(): string | void {
    loginToPartizan().then((data) => {
        try {
            device_list.headers.Cookie = data.headers["set-cookie"][0];
            request.post(device_list, (error, response, body: any) => {
                //TODO: Publish body to mqtt
                console.log(body) 
            });
        } catch {(e: any) => {
            //TODO: if server return error or unreachable publish error to mqtt
            console.log(e)
        }};
    });
};

function GetVideoThread(id: number): string | void {
    device_id.body = `json={'camera_id': ${id}}`;
    loginToPartizan().then((data) => {
        try {
            device_id.headers.Cookie = data.headers["set-cookie"][0];
            request.post(device_id, (error, response, body: any) => {
                //TODO: Publish body to mqtt
                console.log(body);
            });
        } catch {(e: any) => console.log(e)};
    });
};

GetDevicelist()
//GetVideoThread(20677);

//TODO:
//Subscribe on topics : <client>/partyzan/command/video_id, <client>/partyzan/command/video_list
//If get message "get list" in topic <client>/partyzan/command/video_list,
//run GetDevicelist() and publish response (body from request) to <client>/partyzan/command/video_list
//If get message like {'id': 9999} in topic <client>/partyzan/command/video_id,
//run GetVideoThread(put message here) and publish response (body from request) to <client>/partyzan/command/video_id

//All clients must be in location "Червоноткацька 93" for production
