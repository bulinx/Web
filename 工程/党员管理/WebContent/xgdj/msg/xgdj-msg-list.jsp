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
    站内信 <span class="c-gray en">&gt;</span> 查看消息
    <a class="btn btn-success radius r mr-20" style="line-height: 1.6em; margin-top: 3px"
        href="javascript:location.replace(location.href);" title="刷新">
        <i class="icon-refresh"></i>
    </a>
</nav>
<div class="pd-20">
    <ul id="Huifold1" class="Huifold">
    <c:forEach items="${lists}" var="list" varStatus="sta">
    <c:if test="${list.state == 0}">
    	<li class="item">
            <h4>${sta.index+1}、${list.title}
                <span class="c-red">(未读)</span>
                <span class="c-999 r" style="font-size: 10px;">${list.sendMan} 于 ${list.sendTime}</span>
                <b>+</b>
            </h4>
            <div class="info">${list.content}</div>
        </li>
    </c:if>
    <c:if test="${list.state == 1}">
    	<li class="item">
            <h4>${sta.index+1}、${list.title}
                <span class="c-green">(已读)</span>
                <span class="c-999 r" style="font-size: 10px;">${list.sendMan} 于 ${list.sendTime}</span>
                <b>+</b>
            </h4>
            <div class="info">${list.content}</div>
        </li>
    </c:if>
    </c:forEach>
    </ul>
    <div class="text-c mt-10" id="page_id"></div>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="lib/laypage-v1.3/laypage/laypage.js"></script>
<script type="text/javascript">
	$(function() {
        $.Huifold("#Huifold1 .item h4","#Huifold1 .item .info","fast",1,"click"); /*5个参数顺序不可打乱，分别是：相应区,隐藏显示的内容,速度,类型,事件*/
	});
	
	//page
    laypage({
        cont: 'page_id',
        pages: '${page.totalPage}', //总页数
        skip: true, //是否开启跳页
        curr: '${page.currentPage}',
        jump: function(e, first){ //触发分页后的回调
            if(!first){ //一定要加此判断，否则初始时会无限刷新
            	window.location.href="msg?currentPage="+e.curr;
            }
        }
    });
</script>
</body>
</html>