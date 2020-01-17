// web worker


function fib(n) {
    if (n > 2) {
        return fib(n - 1) + fib(n - 2);
    } else {
        return 1;
    }
}
function ping() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/v1/ping");
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.responseText = "json";

        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status >= 400) {
                let response = xhr.response;

                console.log("error", response);
                reject("no pong");
            }
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                let response = xhr.response;
                resolve(response);
            }
        }

        xhr.send();
    });
}
onmessage = (evt) => {
    postMessage(fib(10))
};

setInterval(() => {
    ping().then((response) => postMessage(response)).catch((err) => postMessage(response));
}, 1500);


