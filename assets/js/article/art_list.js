$(function () {
    // 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数 在个位数的左侧补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 一、定义提交参数
    var q = {
        pagenum: 1,        // 页码值
        pagesize: 3,       // 每页显示多少条数据
        cate_id: "",       // 文章分类的Id
        state: ""          // 文章的发布状态
    };

    // 引出 layui 中的 layer
    var layer = layui.layer

    // 二、初始化文章列表
    // 调用
    initTable()
    // 封装
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }


    // 三、初始化下拉列表的所有分类那一栏

    // 引出 layui 中的 form    form 获取表单中的数据
    var form = layui.form

    // 调用
    initCate()

    // 封装
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                // 赋值 渲染form
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }


    // 四、筛选功能的实现
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })


    // 五、分页功能
    var laypage = layui.laypage
    function renderPage(total) {
        // console.log(total);     // 打印出来的是发表的文章的篇数
        laypage.render({
            elem: 'pageBox',       // 这里的pageBox是id
            count: total,          // 数据总数，从服务端得到
            limit: q.pagesize,     // 每页显示的条数
            curr: q.pagenum,       // 起始页或当前页码

            // 分页的模块 排版 显示样式设置
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],         // 显示每页的条数

            // 触发jump：分页初始化的时候 页码改变的时候
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                // 赋值页面
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    // 调用初始化文章列表函数
                    initTable()
                }
            }
        });
    }


    // 六、删除功能实现
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        // console.log(Id);
        layer.confirm('是否确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('恭喜您文章删除成功！')
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable()
                    layer.close(index);
                }
            })
        });
    })





})