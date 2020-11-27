$(function () {
    // 1.自定义密码校验规则
    var form = layui.form
    form.verify({
        // 密码
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新旧不重复
        samePwd: function (value) {
            // value是新密码 旧密码需要获取
            if (value == $('[name=oldPwd]').val()) {
                return '原密码和旧密码不能相同'
            }
        },
        // 两次新密码必须相同
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次新密码输入的不一致'
            }
        }
    })


    // 2.表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('恭喜您修改密码成功')
                $('.layui-form')[0].reset()
            }
        })
    })




})