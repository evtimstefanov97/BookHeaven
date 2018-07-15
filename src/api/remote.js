import { get } from './http-client';
import { post } from './http-client';

async function register(data) {
    return await post("user", "", "Basic", JSON.stringify(data));
}

async function login(data) {
    return post("user", "login", "Basic", JSON.stringify(data));

}

async function getUserRole(id) {
    return get("user", `${id}/roles`, "Kinvey")
}
async function getUserInfo(id) {
    return get("user", id, "Kinvey");
}


export { register, login, getUserRole, getUserInfo }