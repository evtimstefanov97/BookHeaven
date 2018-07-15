import { get, post, _delete, put } from './http-client';
import { APP_KEY, BASE_URL } from './../constants/constants';

async function getAll(data) {
    return await get("appdata", "Books");
}
async function create(data) {
    return await post("appdata", "Books", "Kinvey", JSON.stringify(data));
}

async function remove(id) {
    let query = `Books?query={"_id":"${id}"}`;

    return await _delete("appdata", query, 'Kinvey')
}
async function uploadPicture(file, bookId) {

    let metadata = {
        '_filename': file.name,
        'size': file.size,
        'mimeType': file.type,
        "_public": true
    };
    if (bookId) {
        metadata.bookId = bookId;
    }
    let requestUrl = BASE_URL + 'blob/' + APP_KEY;

    let requestHeaders = {
        'Authorization': `Kinvey ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
        'X-Kinvey-Content-Type': metadata.mimeType
    };

    const res = await fetch(requestUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(metadata)
    });
    let resJson = await res.json();
    let urlObj = await uploadToCloud(resJson, file);
    console.log(urlObj);
    urlObj["fileId"] = resJson._id;
    urlObj["fileJson"] = resJson

    console.log(urlObj);
    return urlObj;
    // return await {"status" : res.status, "body" : res.json()};

}
async function uploadToCloud(success, file) {

    let innerHeaders = success._requiredHeaders;
    innerHeaders['Content-Type'] = file.type;
    innerHeaders = innerHeaders;

    let uploadURL = success._uploadURL;
    let element_id = success._id;

    const res = await fetch(uploadURL, {
        method: 'PUT',
        headers: innerHeaders,
        body: file
    });
    let indexOfFileExt = res.url.indexOf("." + file.name.split('.')[1]);
    let sliceLastIndex = indexOfFileExt + file.name.split('.')[1].length;
    let imageUrl = res.url.slice(0, sliceLastIndex + 1)
    return { "url": imageUrl };

}
async function getBookPictureById(id) {
    let query = `?query={\"bookId\":\"${id}\"}`;
    return get("blob", query, "Kinvey")
}
async function getBookById(id) {
    let query = `Books?query={\"_id":\"${id}\"}`;
    return get("appdata", query, "Kinvey");
}
async function removeOldImage(imageId) {
    return await _delete("blob", imageId, 'Kinvey')
}

async function updateBook(id, data) {
    return await put('appdata', `Books/${id}`, "Kinvey", JSON.stringify(data));
}
async function connectFileToBook(id, data) {
    return await put('blob', id, "Kinvey", JSON.stringify(data));
}

export { getAll, create, remove, uploadPicture, getBookPictureById, getBookById, removeOldImage, updateBook, connectFileToBook }