// 1.开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net';

$.ajaxPrefilter(function (options) {
    // 拼接对应环境的服务器地址 在发起真正ajax请求之前统一拼接请求的根路径
    options.url = baseURL + options.url
})