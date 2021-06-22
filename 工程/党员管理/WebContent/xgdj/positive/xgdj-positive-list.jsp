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
	申请审核 <span class="c-gray en">&gt;</span> 积极分子申请
	<a class="btn btn-success radius r mr-20" style="line-height: 1.6em; margin-top: 3px"
	   href="javascript:location.replace(location.href);" title="刷新">
		<i class="icon-refresh"></i>
	</a>
</nav>
<div class="pd-20">
	<div class="text-c">
		<form action="partyApply!viewAll" method="post" id="sear">
			<input type="text" name="data.number" class="input-text" style="width: 180px;" placeholder="学号">
			<input type="text" name="data.name" class="input-text" style="width: 180px;" placeholder="姓名">
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
            <a roles="d30f-83" href="javascript:void(0);" onclick="stop();" class="btn btn-danger radius">
				<i class="icon-trash"></i> 批量退回
			</a>
            <a roles="2f4e-83" href="javascript:void(0);" onclick="pass();" class="btn btn-primary radius">
				<i class="icon-plus"></i> 批量通过
			</a>
			<a roles="8dc5-83" href="javascript:print('xgdj/positive/xgdj-positive-print.jsp')" class="btn btn-default radius">
                <i class="icon-print"></i> 积极分子备案表
            </a>
            <a roles="7641-83" href="ReportServer?reportlet=xgdj_positive_pub.cpt" target="_blank" class="btn btn-default radius">
                <i class="icon-print"></i> 积极分子公示表
            </a>
        </span>
		<span class="r">共有数据：<strong>${page.totalCount}</strong> 条</span>
	</div>
	<table class="table table-border table-bordered table-hover table-bg table-sort" width="100%">
		<thead>
		<tr class="text-c">
			<th><input type="checkbox"></th>
			<th>学号</th>
			<th>姓名</th>
			<th>性别</th>
			<th>民族</th>
			<th>单位</th>
			<th>出生日期</th>
			<th>身份证号码</th>
			<th>学历</th>
			<th>申请入党时间</th>
			<th>推荐或推优方式</th>
			<th>确定为积极分子时间</th>
			<th>培养联系人</th>
			<th>备注</th>
		</tr>
		</thead>
		<tbody>
		<c:forEach items="${lists}" var="list" varStatus="sta">
			<tr class="text-c" id="${list.id}">
				<td><input type="checkbox" value="${list.number}" name="chk"></td>
				<td>${list.number}</td>
				<td>${list.name}</td>
				<td>${list.sex}</td>
				<td>${list.nation}</td>
				<td>${list.company}</td>
				<td>${list.birthday}</td>
				<td>${list.idCard}</td>
				<td>${list.culture}</td>
				<td>${list.partyDate}</td>
				<td>${list.promote}</td>
				<td>${list.positiveDate}</td>
				<td>${list.linkMan1},${list.linkMan2}</td>
				<td></td>
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
<script type="text/javascript">
	$(function() {
		roles();
	});
	$('.table-sort').dataTable({
		"lengthMenu" : false,//显示数量选择
		"bFilter" : false,//过滤功能
		"bPaginate" : false,//翻页信息
		"bInfo" : false,//数量信息
		"aaSorting" : [ [ 1, "desc" ] ],//默认第几个排序
		"bStateSave" : true,//状态保存
		"aoColumnDefs" : [
			//{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
			{
				"orderable" : false,
				"aTargets" : [ 0,2,3,4,5,7,8,10,12,13]
			} // 制定列不参与排序
		]
	});

	/*批量退回*/
	function stop() {
		var chk_value = [];
		$('input[name="chk"]:checked').each(function() {
			chk_value.push($(this).val());
		});
		//判断
		if (chk_value.length == 0) {
			layer.msg('请选择操作数据', 2);
		} else {
			layer.confirm('确认要退回吗？', function(index) {
				layer.load('正在处理', 3);
				$.post("positive!updatePositive", {
					"key" : chk_value.toString(),
					"state" : 0
				}, function(v) {
					var r = eval("(" + v + ")");
					if (r.success) {
						$('input[name="chk"]:checked').each(function() {
							$(this).parents("tr").remove();
						});
						layer.msg(r.msg, 2, 1);
					} else {
						layer.msg(r.msg, 2);
					}
				});
			});
		}
	}

	/*批量通过*/
	function pass() {
		var chk_value = [];
		$('input[name="chk"]:checked').each(function() {
			chk_value.push($(this).val());
		});
		//判断
		if (chk_value.length == 0) {
			layer.msg('请选择操作数据', 2);
		} else {
			layer.confirm('确认要通过申请吗？', function(index) {
				layer.load('正在处理', 3);
				$.post("positive!updatePositive", {
					"key" : chk_value.toString(),
					"state" : 2,
				}, function(v) {
					var r = eval("(" + v + ")");
					if (r.success) {
						$('input[name="chk"]:checked').each(function() {
							$(this).parents("tr").remove();
						});
						layer.msg(r.msg, 2, 1);
					} else {
						layer.msg(r.msg, 2);
					}
				});
			});
		}
	}
	
	function print(url) {
        $.layer({
            type : 2,
            title: '打印',
            shadeClose: true,
            maxmin: true,
            fix : false,
            area: ['400px', 250],
            iframe: {
                src : url
            }
        });
    }
</script>
</body>
</html>