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
<LINK rel="Bookmark" href="/favicon.ico" >
<LINK rel="Shortcut Icon" href="/favicon.ico" />
<!--[if lt IE 9]>
<script type="text/javascript" src="lib/html5.js"></script>
<script type="text/javascript" src="lib/respond.min.js"></script>
<script type="text/javascript" src="lib/PIE_IE678.js"></script>
<![endif]-->
<link href="css/H-ui.min.css" rel="stylesheet" type="text/css" />
<link href="css/H-ui.admin.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
<link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css" />
<link href="lib/Hui-iconfont/1.0.7/iconfont.css" rel="stylesheet" type="text/css" />
<link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet" type="text/css" />
<!--[if IE 7]>
<link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css" />
<![endif]-->
<!--[if IE 6]>
<script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('*');</script>
<![endif]-->
<title>${web.name}</title>
  <meta name="keywords" content="${web.keywords}">
  <meta name="description" content="${web.description}">
  <link href="images/favicon.ico" mce_href="favicon.ico" rel="bookmark" type="image/x-icon" />
  <link href="images/favicon.ico" mce_href="favicon.ico" rel="icon" type="image/x-icon" />
  <link href="images/favicon.ico" mce_href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
</head>
<body>
<header class="Hui-header cl"> 
<a class="Hui-logo l" title="H-ui.admin v2.2">${web.name}</a> 
<a class="Hui-logo-m l" title="H-ui.admin">H-ui</a> <span class="Hui-subtitle l">V1.0</span> 
<span class="c-white">
<ul class="Hui-userbar">
		<li>欢迎${user.role.name} :</li>
		<li class="dropDown dropDown_hover">
			<a href="javascript:void(0);" class="dropDown_A">${user.name}<i class="Hui-iconfont">&#xe6d5;</i></a>
			<ul class="dropDown-menu radius box-shadow">
				<li><a href="#">个人信息</a></li>
				<li><a href="#">切换账户</a></li>
				<li><a href="#">退出</a></li>
			</ul>
		</li>
		<li id="Hui-msg"> 
			<a href="javascript:msg();" title="消息">
				<span class="badge badge-danger" id="unr">${unread}</span>
				<i class="Hui-iconfont" style="font-size:18px">&#xe68a;</i>
			</a> 
		</li>
		<li id="Hui-skin" class="dropDown right dropDown_hover"><a href="login!loginOut" class="btn btn-danger radius ml-10 size-S" title="退出"><i class="icon-off"></i>退出</a>
		</li>
</ul>
<a href="javascript:;" class="Hui-nav-toggle Hui-iconfont" aria-hidden="false">&#xe667;</a>
</span> 
</header>
<aside class="Hui-aside">
  <div class="menu_dropdown bk_2">
  <c:forEach items="${menuResults}" var="list">
  <dl id="menu-user">
      <dt>
      	<i class="${list.menu.icon}"></i> ${list.menu.name}
      	<i class="iconfont menu_dropdown-arrow">&#xf02a9;</i>
      </dt>
      <dd>
        <ul>
        <c:forEach items="${list.subMenus}" var="sub">
          <li><a _href="${sub.url}" href="javascript:void(0);">${sub.name}</a></li>
        </c:forEach>
        	<li style="display: none;"><a _href="msg" id="me" href="javascript:void(0);">站内信</a></li>
        </ul>
      </dd>
    </dl>
	</c:forEach>
  </div>
</aside>
<div class="dislpayArrow"><a class="pngfix" href="javascript:void(0);" onClick="displaynavbar(this)"></a></div>
<section class="Hui-article-box">
  <div id="Hui-tabNav" class="Hui-tabNav">
    <div class="Hui-tabNav-wp">
      <ul id="min_title_list" class="acrossTab cl">
        <li class="active"><span title="我的桌面" data-href="welcome.html">我的桌面</span><em></em></li>
      </ul>
    </div>
    <div class="Hui-tabNav-more btn-group"><a id="js-tabNav-prev" class="btn radius btn-default size-S" href="javascript:;"><i class="icon-step-backward"></i></a><a id="js-tabNav-next" class="btn radius btn-default size-S" href="javascript:;"><i class="icon-step-forward"></i></a></div>
  </div>
  <div id="iframe_box" class="Hui-article">
    <div class="show_iframe">
      <div style="display:none" class="loading"></div>
      <iframe scrolling="yes" frameborder="0" src="welcome.jsp"></iframe>
    </div>
  </div>
</section>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script> 
<script type="text/javascript" src="js/H-ui.js"></script> 
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript">
	function msg() {
		$("#unr").html(0);
		$("#me").click();
	}
</script>
</body>
</html>