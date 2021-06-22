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
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
<meta http-equiv="Cache-Control" content="no-siteapp" />
<!--[if lt IE 9]>
<script type="text/javascript" src="lib/html5.js"></script>
<script type="text/javascript" src="lib/respond.min.js"></script>
<script type="text/javascript" src="lib/PIE_IE678.js"></script>
<![endif]-->
<link href="css/H-ui.min.css" rel="stylesheet" type="text/css" />
<link href="css/H-ui.admin.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
<link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet" type="text/css" />
<!--[if IE 7]>
<link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css" />
<![endif]-->
<link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css" />
<!--[if IE 6]>
<script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('*');</script>
<![endif]-->
<title>基本设置</title>
</head>
<body>
<nav class="breadcrumb"><i class="iconfont">&#xf012b;</i> 首页
  <span class="c-gray en">&gt;</span> 系统管理 <span class="c-gray en">&gt;</span>
  字典值 <a class="btn btn-success radius r mr-20" style="line-height:1.6em;margin-top:3px" href="javascript:location.replace(location.href);" title="刷新" >
    <i class="icon-refresh"></i></a>
</nav>
<div class="pd-20">
  <div class="text-c">
    <form action="dictionary!searchText" method="post" id="sea">
      <span class="select-box" style="width:150px">
      <select class="select" id="dicId" name="dictionaryText.dicId">
      </select>
      </span>
      <input type="hidden" name="id" value="${dicId}">
      <input type="hidden" name="currentPage" id="currentPage">
      <input type="text" class="input-text" style="width:150px" placeholder="字典值" name="dictionaryText.name" value="${text.name}">
      <input type="text" class="input-text" style="width:150px" placeholder="字典编码值" name="dictionaryText.value" value="${text.value}">
      <button type="submit" class="btn btn-success"><i class="icon-search"></i> 搜索</button>
  </form>
  </div>
  <div class="cl pd-5 bg-1 bk-gray mt-20">
    <span class="l">
      <a roles="88ba-62" href="javascript:void(0);" onclick="datadel()" class="btn btn-danger radius"><i class="icon-trash"></i> 批量删除</a>
    </span>
    <span class="r">共有数据：<strong>${page.totalCount}</strong> 条</span> </div>
  <table class="table table-border table-bordered table-bg table-hover table-sort">
    <thead>
      <tr class="text-c">
        <th width="25"><input type="checkbox"></th>
        <th>序号</th>
        <th>显示值</th>
        <th>编码值</th>
        <th>字典编码(ID)</th>
        <th>字典</th>
        <th>状态</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
    <c:forEach items="${lists}" var="list" varStatus="sta">
    <c:if test="${list.state==0}">
    <tr class="text-c">
        <td><input type="checkbox" value="${list.id}" name="ck"></td>
        <td>${sta.index+1}</td>
        <td>${list.name}</td>
        <td>${list.value}</td>
        <td>${list.dicId}</td>
        <td>${list.dicName}</td>
        <td class="article-status"><span class="label label-success radius">已启用</span></td>
        <td class="f-14 article-manage">
          <a roles="ceea-62" style="text-decoration:none" onClick="stop(this,'${list.id}')" href="javascript:void(0);" title="停用"><i class="icon-hand-down"></i></a>
          <a roles="ea3b-62" style="text-decoration:none" class="ml-5" onclick="edit('450','250','编辑','pages/manager/system-data-detail-edit.jsp?id=${list.id}')" href="javascript:void(0);" title="编辑"><i class="icon-edit"></i></a>
          <a roles="9ebd-62" title="删除" href="javascript:void(0);" onclick="del(this,'${list.id}')" class="ml-5" style="text-decoration:none"><i class="icon-trash"></i></a>
        </td>
      </tr>
    </c:if>
    <c:if test="${list.state==1}">
    <tr class="text-c">
        <td><input type="checkbox" value="${list.id}" name="ck"></td>
        <td>${sta.index+1}</td>
        <td>${list.name}</td>
        <td>${list.value}</td>
        <td>${list.dicId}</td>
        <td>${list.dicName}</td>
        <td class="article-status"><span class="label radius">已启用</span></td>
        <td class="f-14 article-manage">
          <a roles="ceea-62" style="text-decoration:none" onClick="start(this,'${list.id}')" href="javascript:void(0);" title="停用"><i class="icon-hand-up"></i></a>
          <a roles="ea3b-62" style="text-decoration:none" class="ml-5" onclick="edit('450','250','编辑','pages/manager/system-data-detail-edit.jsp?id=${list.id}')" href="javascript:void(0);" title="编辑"><i class="icon-edit"></i></a>
          <a roles="9ebd-62" title="删除" href="javascript:void(0);" onclick="del(this,'${list.id}')" class="ml-5" style="text-decoration:none"><i class="icon-trash"></i></a>
        </td>
      </tr>
    </c:if>
    </c:forEach>
    </tbody>
  </table>
  <div class="text-c mt-10" id="page_id"></div>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script> 
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script> 
<script type="text/javascript" src="lib/laypage-v1.3/laypage/laypage.js"></script>
<script type="text/javascript" src="lib/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script> 
<script type="text/javascript" src="js/H-ui.admin.js"></script> 
<script type="text/javascript" src="js/H-ui.admin.doc.js"></script>
<script type="text/javascript">
$(function(){
	roles();
});
$(function(){
	$('.table-sort').dataTable({
		"lengthMenu":false,//显示数量选择 
		"bFilter": false,//过滤功能
		"bPaginate": false,//翻页信息
		"bInfo": false,//数量信息
		"aaSorting": [[ 1, "desc" ]],//默认第几个排序
		"bStateSave": true,//状态保存
		"aoColumnDefs": [
		  //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
		  {"orderable":false,"aTargets":[0,2,5,6,7]}// 制定列不参与排序
		]
	});
	init('${dicId}');
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
        	$("sea").submit();
        }
    }
});

/*停用*/
function stop(obj,id){
  layer.confirm('确认要停用吗？',function(index){
	  $.post("dictionary!updateText",{"name":id,"state":1},function(v){
		  var res = $.parseJSON(v);
		  if (res.success) {
			  $(obj).parents("tr").find(".article-manage").prepend('<a style="text-decoration:none" onClick="start(this,'+id+')" href="javascript:void(0);" title="启用"><i class="icon-hand-up"></i></a>');
			  $(obj).parents("tr").find(".article-status").html('<span class="label radius">已停用</span>');
			  $(obj).remove();
			  layer.msg(res.msg,2,1);
		  } else {
			  layer.msg(res.msg,2);
		  }
	  });
  });
}

/*启用*/
function start(obj,id){
  layer.confirm('确认要启用吗？',function(index){
	  $.post("dictionary!updateText",{"name":id,"state":0},function(v){
		  var res = $.parseJSON(v);
		  if (res.success) {
			  $(obj).parents("tr").find(".article-manage").prepend('<a style="text-decoration:none" onClick="stop(this,'+id+')" href="javascript:void(0);" title="停用"><i class="icon-hand-down"></i></a>');
			  $(obj).parents("tr").find(".article-status").html('<span class="label label-success radius">已启用</span>');
			  $(obj).remove();
			  layer.msg(res.msg,2,1);
		  } else {
			  layer.msg(res.msg,2);
		  }
	  });
  });
}

/*删除*/
function del(obj,id){
  layer.confirm('确认要删除吗？',function(index){
	  $.post("dictionary!delText",{"name":id},function(v){
		  var res = $.parseJSON(v);
		  if (res.success) {
			  $(obj).parents("tr").remove();
			  layer.msg(res.msg,2,1);
		  } else {
			  layer.msg(res.msg,2);
		  }
	  });
  });
}

/*批量删除*/
function datadel(){
  var chk_value =[];
  $('input[name="ck"]:checked').each(function(){
    chk_value.push($(this).val());
  });

  if (chk_value.length <= 0) {
    //没有选择
    layer.msg('请选择操作对象',2);
  } else {
    layer.confirm('确认要删除吗？',function(index){
      $.post("dictionary!delText",{"name":chk_value.toString()},function(v){
		  var res = $.parseJSON(v);
		  if (res.success) {
			  $('input[name="ck"]:checked').each(function(){
		        $(this).parents("tr").remove();
		      });
			  layer.msg(res.msg,2,1);
		  } else {
			  layer.msg(res.msg,2);
		  }
	  });
    });
  }
}
//初始化
function init(id) {
	$.post("dictionary!findDictionaryStr",{},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			if(id == res[i].id) {
				$("#dicId").append('<option selected="selected" value="'+res[i].id+'">'+res[i].name+'</option>');
			} else {
				$("#dicId").append('<option value="'+res[i].id+'">'+res[i].name+'</option>');
			}
		}
	});
}
</script>
</body>
</html>