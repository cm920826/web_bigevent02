$(function () {
    // 点击 去注册账号 的链接 显示注册的区域 隐藏登录的区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击 去登录 的链接 显示登录的区域 隐藏注册的区域
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })



    // 自定义表单的验证规则
    var form = layui.form
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,16}$/,
            '密码必须6到16位，且不能出现空格'
        ],
        // 确认密码的规则
        repwd: function (value) {
            var pwd = $('.reg-box input[name=password]').val()
            // 两个密码输入框的值进行比较
            if (value !== pwd) {
                return '两次输入的密码不一致！'
            }
        }
    })



    // 实现注册页功能
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val()
            },
            success: function (res) {
                // 判断返回的状态
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提交成功的话
                layer.msg('恭喜您注册成功了，请登录')
                // 注册成功后自动切换到登录表单  手动调用登录表单的点击事件
                $('#link_login').click()
                // 清空注册页面中跳转到登录页后的个人信息  重置form表单
                $('#form_reg')[0].reset()
            }
        })
    })



    // 实现登录页的功能
    $('#form_login').on('submit', function (e) {
        // 阻止表单的默认提交行为  不写这一句代码实现不了跳转到首页
        e.preventDefault()      
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }   
                layer.msg('恭喜您，登录成功！');
                // 保存 token  之后的接口要使用 token
                localStorage.setItem("token", res.token)
                // 跳转到大事件的首页
                location.href = "/index.html";
            }
        })
    })



})