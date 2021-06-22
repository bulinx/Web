<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE HTML>
<html>
<head>
	<base href="<%=basePath%>" />
	<meta charset="utf-8">
	<meta name="renderer" content="webkit|ie-comp|ie-stand">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport"
		  content="width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
	<meta http-equiv="Cache-Control" content="no-siteapp" />
	<!--[if lt IE 9]>
	<script type="text/javascript" src="lib/html5.js"></script>
	<script type="text/javascript" src="lib/respond.min.js"></script>
	<script type="text/javascript" src="lib/PIE_IE678.js"></script>
	<![endif]-->
	<link href="css/H-ui.min.css" rel="stylesheet" type="text/css" />
	<link href="css/H-ui.admin.css" rel="stylesheet" type="text/css" />
	<link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet"
		  type="text/css" />
	<!--[if IE 7]>
	<link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css"/>
	<![endif]-->
	<link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css" />
	<!--[if IE 6]>
	<script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js"></script>
	<script>DD_belatedPNG.fix('*');</script>
	<![endif]-->
	<title>title</title>
</head>
<body>
<nav class="breadcrumb">
	<i class="iconfont">&#xf012b;</i> 首页 <span class="c-gray en">&gt;</span>
	入党材料 <span class="c-gray en">&gt;</span> 思想汇报
	<a class="btn btn-success radius r mr-20" style="line-height: 1.6em; margin-top: 3px"
	   href="javascript:location.replace(location.href);" title="刷新">
		<i class="icon-refresh"></i>
	</a>
</nav>
<div class="pd-20">
	<div class="text-c">
		<form action="report" method="post" id="sear">
			<input type="text" name="obj.numbers" value="${obj.numbers}" class="input-text" style="width: 180px;" placeholder="学号">
			<input type="text" name="obj.name" value="${obj.name}" class="input-text" style="width: 180px;" placeholder="姓名">
			<input type="hidden" id="currentPage" name="currentPage">
			<button type="submit" class="btn btn-success">
				<i class="icon-search"></i> 搜索
			</button>
			<button type="reset" class="btn btn-success">
				<i class="icon-refresh"></i> 清空
			</button>
		</form>
	</div>
	<div class="cl pd-5 bg-1 bk-gray mt-20" style="width: auto;">
        <span class="l">
            <input type="text" id="key" class="input-text radius" style="width: 180px;" placeholder="输入学号添加思想汇报">
			<button class="btn btn-default radius"  data-toggle="tooltip" data-placement="right" title="右边显示" onclick="save();">
				<i class="icon-plus-sign-alt"></i> 添加
			</button>
			<small class="c-999 va-b">可以直接点击Enter确认</small>
        </span>
		<span class="r">共有数据：<strong>${page.totalCount}</strong> 条</span>
	</div>
	<table class="table table-border table-bordered table-hover table-bg table-sort" width="100%">
		<thead>
		<tr class="text-c">
			<th>序号</th>
			<th>学号</th>
			<th>姓名</th>
			<th>第一联系人</th>
			<th>第二联系人</th>
			<th>审核时间</th>
			<th>审核人</th>
			<th>操作</th>
		</tr>
		</thead>
		<tbody>
		<c:forEach items="${lists}" var="list" varStatus="sta">
			<tr class="text-c">
				<td>${sta.index+1}</td>
				<td>${list.numbers}</td>
				<td>${list.name}</td>
				<td>${list.linkMan1}</td>
				<td>${list.linkMan2}</td>
				<td>${list.createTime}</td>
				<td>${list.operateMan}</td>
				<td class="f-14 article-manage">
					<a roles="cd6a-89" title="删除" href="javascript:void(0);" onclick="del(this,'${list.id}')" style="text-decoration:none">
						<i class="icon-trash"></i>
					</a>
				</td>
			</tr>
		</c:forEach>
		</tbody>
	</table>
	<div class="text-c mt-10" id="page_id"></div>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="js/H-ui.admin.doc.js"></script>
<script type="text/javascript" src="lib/laypage-v1.3/laypage/laypage.js"></script>
<script type="text/javascript">
    $(function () {
        roles();
    });

	$('.table-sort').dataTable({
		"lengthMenu" : false,//显示数量选择
		"bFilter" : false,//过滤功能
		"bPaginate" : false,//翻页信息
		"bInfo" : false,//数量信息
		"aaSorting" : [ [ 0, "desc" ] ],//默认第几个排序
		"bStateSave" : true,//状态保存
		"aoColumnDefs" : [
			//{"bVisible": false, "aTargets": [ 0 ]} //控制列的隐藏显示
			{
				"orderable" : false,
				"aTargets" : [2,3,4,6,7]
			} // 制定列不参与排序
		]
	});

	//监听回车键
    $(document).keyup(function(event){
        if(event.keyCode == 13){
           save();
        }
    });

    //page
    laypage({
        cont: 'page_id',
        pages: '${page.totalPage}', //总页数
        skip: true, //是否开启跳页
        curr: '${page.currentPage}',
        jump: function(e, first){ //触发分页后的回调
            if(!first){ //一定要加此判断，否则初始时会无限刷新
				$("#currentPage").val(e.curr);
               	$("#sear").submit();
            }
        }
    });

    //添加思想汇报
	function save() {
	    var key = $("#key").val();
	    if (key.length < 1) {
            layer.msg('请输入学号',2);
		} else {
            layer.load('正在处理', 3);
            $.post("report!save",{"key":key},function(v){
                var res = $.parseJSON(v);
                if (res.success) {
                    layer.msg(res.msg,1,1);
                    location.reload();
                } else {
                    layer.msg(res.msg,2);
                }
            });
		}
	}

	/*删除*/
    function del(obj,id){
        layer.confirm('确认要删除吗？',function(index){
            layer.load('正在处理', 3);
            $.post("report!delete",{"key":id},function(v){
                var res = $.parseJSON(v);
                if (res.success) {
                    $(obj).parents("tr").remove();
                    layer.msg(res.msg,1,1);
                } else {
                    layer.msg(res.msg,2);
                }
            });
        });
    }
</script>
</body>
</html>