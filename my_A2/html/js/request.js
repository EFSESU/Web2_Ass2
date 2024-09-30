// http get
function GetRequest(path, query) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', 'http://localhost:3000/api/' + path + '?' + new URLSearchParams(query).toString(), true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            }
        }
        xhr.send();
    });
}