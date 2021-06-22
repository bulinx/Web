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
    <link href="lib/iconfont/1.0.7/iconfont.css" rel="stylesheet"
          type="text/css" />
    <!--[if IE 6]>
    <script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js"></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
    <title>用户管理</title>
</head>
<body>
<nav class="breadcrumb">
    <i class="iconfont">&#xf012b;</i> 首页 <span class="c-gray en">&gt;</span>
    系统管理 <span class="c-gray en">&gt;</span> 开发文档
    <a class="btn btn-success radius r mr-20" style="line-height: 1.6em; margin-top: 3px" href="javascript:location.replace(location.href);" title="刷新">
        <i class="icon-refresh"></i>
    </a>
    <a class="btn btn-primary radius r mr-20" style="line-height: 1.6em; margin-top: 3px" href="pages/manager/info-add.jsp">
        <i class="icon-plus"></i> 发布文档
    </a>
</nav>
<div class="pd-20">
<c:forEach items="${lists}" var="list">
	<div style="width: 90%;margin:0 auto;padding-left: 5px;padding-bottom: 5px;" class="box-shadow">
        <h3><a href="info!view?id=${list.id}">${list.title}</a></h3>
        <p class="text-overflow lh-20" style="width:90%;">${list.summary}</p>
        <i class="icon-user"></i>  ${list.publishMan}<span class="pipe">|</span><i class="icon-time"></i>  ${list.publishTime}
    	<span class="pipe">|</span><a href="info!goView?id=${list.id}"><i class="icon-edit"></i>  编辑</a>
        <span class="pipe">|</span><a href="javascript:del('${list.id}');"><i class="icon-trash"></i>  删除</a>
    </div>
</c:forEach>
    <div class="text-c mt-10" id="page_id"></div>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script src="lib/laypage-v1.3/laypage/laypage.js"></script>
<script type="text/javascript">
    //page
    laypage({
        cont: 'page_id',
        pages: '${page.totalPage}', //总页数
        skip: true, //是否开启跳页
        curr: '${page.currentPage}',
        jump: function(e, first){ //触发分页后的回调
            if(!first){ //一定要加此判断，否则初始时会无限刷新
                location.href = 'info?currentPage='+e.curr;
            }
        }
    });
    /*删除*/
    function del(id){
      layer.confirm('确认要删除吗？',function(index){
    	  window.location.href="info!delete?id="+id;
      });
    }
</script>
</body>
</html>