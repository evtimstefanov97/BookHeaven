import { BASE_URL, APP_KEY, APP_SECRET } from './../constants/constants';

async function get(startpoint, endpoint, auth) {

    let url = createUrl(startpoint, endpoint);

    const res = await fetch(url, {
        method: 'GET',
        headers: createAuthHeaders(auth)
    });

    return await { "status": res.status, "body": res.json() };
}

async function post(startpoint, endpoint, auth, body) {
    let url = createUrl(startpoint, endpoint);

    const res = await fetch(url, {
        method: 'POST',
        headers: createAuthHeaders(auth),
        body: body
    });

    return await { "status": res.status, "body": res.json() };
}

async function put(startpoint, endpoint, auth, body) {
    let url = createUrl(startpoint, endpoint);

    const res = await fetch(url, {
        method: 'PUT',
        headers: createAuthHeaders(auth),
        body: body
    });

    return await { "status": res.status, "body": res.json() };
}

async function _delete(startpoint, endpoint, auth) {
    let url = createUrl(startpoint, endpoint);

    const res = await fetch(url, {
        method: 'DELETE',
        headers: createAuthHeaders(auth)
    });

    return await { "status": res.status, "body": res.json() };
}

function createAuthHeaders(type) {
    if (type === 'Basic') {
        return {
            'Authorization': `Basic ${btoa(`${APP_KEY}:${APP_SECRET}`)}`,
            'Content-Type': 'application/json'
        }
    } else if (type === "Kinvey") {
        return {
            'Authorization': `Kinvey ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
        }
    } else if (type === "UserBasic") {
        return {
            'Authorization': `Basic ${btoa(localStorage.getItem('authToken'))}`,
            'Content-Type': 'application/json'
        }
    } 
    else {
        return {
            'Authorization': `Basic ${btoa(`guest:guest`)}`,
            'Content-Type': 'application/json'
        }
    }
}


function createUrl(startpoint, endpoint) {
    debugger;
    return BASE_URL + startpoint + '/' + APP_KEY + '/' + endpoint;
}

export { get, post, put, _delete };