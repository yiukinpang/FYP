// 创建XMLHttpRequest对象
var xhr = new XMLHttpRequest();

// 设置请求方法和URL
xhr.open('GET', 'https://us-central1-fyp-a08.cloudfunctions.net/login', true);

// 设置回调函数来处理响应
xhr.onload = function() {
  if (xhr.status === 200) {
    // 处理成功响应
    console.log(xhr.responseText);
  } else {
    // 处理错误情况
    console.error('Request failed. Error code: ' + xhr.status);
  }
};

// 发送请求
xhr.send();