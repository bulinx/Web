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
	基础数据 <span class="c-gray en">&gt;</span> 入党信息
	<a class="btn btn-success radius r mr-20" style="line-height: 1.6em; margin-top: 3px"
	   href="javascript:location.replace(location.href);" title="刷新">
		<i class="icon-refresh"></i>
	</a>
</nav>
<div class="pd-20">
	<div class="text-c">
		<form action="partyApply!viewAll" method="post" id="sear">
			<input type="text" value="${obj.number}" name="data.number" class="input-text" style="width: 180px;" placeholder="学号">
			<input type="text" value="${obj.name}" name="data.name" class="input-text" style="width: 180px;" placeholder="姓名">
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
        </span>
		<span class="r">共有数据：<strong>${page.totalCount}</strong> 条</span>
	</div>
	<table class="table table-border table-bordered table-hover table-bg table-sort" width="100%">
		<thead>
		<tr class="text-c">
			<th><input type="checkbox"></th>
			<th>学号</th>
			<th>单位</th>
			<th>姓名</th>
			<th>身份证号码</th>
			<th>性别</th>
			<th>民族</th>
			<th>出生日期</th>
			<th>文化程度</th>
			<th>职业</th>
			<th>申请入党时间</th>
			<th>列入考察时间</th>
			<th>是否党校培训</th>
			<th>是否团员</th>
			<th>操作</th>
		</tr>
		</thead>
		<tbody>
		<c:forEach items="${lists}" var="list" varStatus="sta">
			<tr class="text-c" id="${list.id}">
				<td><input type="checkbox" value="${list.number}" name="chk"></td>
				<td>${list.number}</td>
				<td>${list.company}</td>
				<td>${list.name}</td>
				<td>${list.idCard}</td>
				<td>${list.sex}</td>
				<td>${list.nation}</td>
				<td>${list.birthday}</td>
				<td>${list.culture}</td>
				<td>${list.job}</td>
				<td>${list.partyDate}</td>
				<td>${list.viewDate}</td>
				<td>${list.partySchool}</td>
				<td>${list.youth}</td>
				<td class="f-14 user-manage">
                    <a roles="abb3-80" style="text-decoration: none" href="javascript:void(0);" onclick="page_show('360','','入党信息','xgdj/partyApply/party-show.jsp?id=${list.id}')" class="ml-5" title="查看更多">
                        <i class="icon-eye-open"></i>
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
<script type="text/javascript" src="lib/laypage-v1.3/laypage/laypage.js"></script>
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
				"aTargets" : [ 0,2,3,4,5,6,8,9,12,13,14]
			} // 制定列不参与排序
		]
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
	
	/*查看*/
	function page_show(w, h, title, url) {
		layer_show(w, h, title, url);
	}
</script>
</body>
</html>