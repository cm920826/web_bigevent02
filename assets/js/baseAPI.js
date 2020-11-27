// 1.开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net';

$.ajaxPrefilter(function (options) {
    // 拼接对应环境的服务器地址 在发起真正ajax请求之前统一拼接请求的根路径
    options.url = baseURL + options.url

    // 对需要权限的接口配置头信息
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization:localStorage.getItem('token') || ''
        }
    }
    // 拦截响应 判断身份认证信息 防止用户在地址栏也能进入主页
    options.complete = function (res) {
        // console.log(res);
        // console.log(res.responseJSON);
        var obj = res.responseJSON
        if (obj.status == 1 && obj.message == '身份认证失败！') {
            // 清空token
            localStorage.removeItem('token')
            // 强制跳转到登录页
            location.href = '/login.html'
        }
    }
})