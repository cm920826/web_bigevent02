$(function () {
    var form = layui.form
    var layer = layui.layer
    initCate()

    // 一、初始化分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 必须调用插件里下拉菜单的这个渲染的方法 不然渲染不了
                form.render()
            }
        })
    }


    // 二、初始化富文本编辑器
    initEditor()

    // 三、 初始化图片裁剪器
    var $image = $('#image')
    // 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 初始化裁剪区域
    $image.cropper(options)


    // 四、给选择封面绑定点击事件 实现选择图片功能
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 五、设置 更换图片
    $('#coverFile').change(function (e) {
        // 获取到用户选择的文件
        var file = e.target.files[0]
        if (file.length == 0) {
            return layer.msg('请选择图片')
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 六、设置点击之后 发布和存为草稿的按钮状态
    var state = '已发布';
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })


    // 七、发布文章功能
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 创建FormData对象  收集数据
        var fd = new FormData(this)
        // 放入状态的数据  已发布或者草稿
        fd.append('state', state)  //前面是要存的数据 后面是变量或形参
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)  //前面是要存的数据 后面是变量或形参
                // console.log(...fd);     // 打印出来的是已发布 和 用户上传的图片
                publishArticle(fd)
            })
    })



    // 八、封装添加文章功能的函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // FormData类型的数据ajax提交时有两个设置必须写
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，文章发布成功！')
                // 跳转到文章的列表页
                location.href = '/article/art_list.html'
            }
            
        })
    }
   


})