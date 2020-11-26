// 入口函数
$(function () {
    // 获取用户信息
    getUserInof()

    // 右上角退出功能实现
    $('#btnLogout').on('click', function () {
        // 框架提供的退出询问
        layer.confirm('是否确认退出？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空本地的token
            localStorage.removeItem('token')
            // 跳转到登录页
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
        });
    })





})

// 获取用户信息的函数
function getUserInof() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功的话  渲染头像
            renderAvatar(res.data)
        }
    })
}



// 渲染用户头像的函数
function renderAvatar(user) {
    // 1.渲染用户名
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 2.渲染头像
    if (user.user_pic !== null) {
        // 有头像的情况
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text-avatar').hide()
    } else {
        // 没有头像的情况
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase()
        $('.text-avatar').show().html(text)
    }
}