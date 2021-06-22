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
	<div class="cl pd-5 bg-1 bk-gray mt-20" style="width: auto;">
        <span class="l">
			<small class="c-999 va-b">您已提交${lists.size()}份思想汇报</small>
        </span>
		<span class="r">共有数据：<strong>${lists.size()}</strong> 条</span>
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
			</tr>
		</c:forEach>
		</tbody>
	</table>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript">
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
				"aTargets" : [2,3,4]
			} // 制定列不参与排序
		]
	});
</script>
</body>
</html>