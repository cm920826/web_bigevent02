$(function () {
    // 一、 实现文章类别列表在整个页面展示的功能

    // 调用
    initArtCateList()

    // 引出 layui 中的 layer  写在外面 其他函数内也能调用
    var layer = layui.layer

    // 封装
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                var htmlStr = template('tpl-art-cate', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    // 二、 给右上角的添加类别按钮绑定点击事件 实现显示添加文章分类的列表
    $('#btnAdd').on('click', function () {
        // 这儿显示的弹出层框 是框架提供的代码  
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#tpl-leibie-add').html()
        });
    })


    // 三、 确认添加文章分类功能的实现  (submit表单提交)
    // 因为里面的结构是动态创建的 所以要通过  事件委托  的方式进行绑定事件
    var indexAdd = null
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 添加文章成功的话 重新渲染页面中的数据 并关闭弹出层框
                initArtCateList()
                layer.msg('恭喜您文章类别添加成功！')
                layer.close(indexAdd)
            }
        })
    })


    // 四、 修改 展示表单功能实现  给动态生成的 编辑 按钮绑定点击事件 (事件委托)
    var indexEdit = null
    // 引出 layui 中的 form   写在外面 其他函数内也能调用
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function () {
        // 4.1 再次利用框架提供的代码 显示添加文章类别的提示框
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#tpl-leibie-edit').html()
        });
        // 4.2 获取Id值 发送ajax请求获取数据 并渲染到页面
        var Id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                // console.log(res);
                // form.val('filter', object);
                // 用于给指定表单集合的元素赋值和取值
                // 如果 object 参数存在 则为赋值；如果 object 参数不存在 则为取值
                form.val('form-edit', res.data)
            }
        })
    })


    // 四、修改 提交功能的实现 （事件委托）
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                initArtCateList()
                layer.msg('恭喜您文章类别更新成功！')
                layer.close(indexEdit)
            }
        })
    })


    // 五、删除功能的实现 （事件委托）
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取到所要删除的数据的Id 通过Id来删除对应的数据
        // 这个变量要写在外面 写在下面的话this的指向就改变了
        var Id = $(this).attr('data-id')
        // 引用框架提供的代码显示出删除的询问框
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('文章类别删除失败')
                    }
                    // 删除成功 重新渲染页面中的数据 并提示成功 然后关闭弹出层
                    initArtCateList()
                    layer.msg('恭喜您，文章类别删除成功')
                    layer.close(index);
                }
            })
        });
    })



})