// http get
function GetRequest(path, query) {
    return new Promise((resolve, reject) => {
        //创建一个新的 XMLHttpRequest 对象 
        const xhr = new XMLHttpRequest();
        xhr.open('get', 'http://localhost:3000/api/' + path + '?' + new URLSearchParams(query).toString(), true);
        xhr.onreadystatechange = function() {
            // // 检查请求是否已完成且响应状态为200为成功
            if (xhr.readyState === 4 && xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            }
        }

        //发送请求
        xhr.send();
    });
}