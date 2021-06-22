<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	String id = request.getParameter("id");
%>
<!DOCTYPE HTML>
<html>
<head>
<base href="<%=basePath%>"/>
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
<link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet" type="text/css" />
<!--[if IE 7]>
<link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css" />
<![endif]-->
<link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css" />
<!--[if IE 6]>
<script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('*');</script>
<![endif]--><title>用户查看</title>
</head>
<body onload="init('<%=id%>');">
<div class="cl pd-20" style=" background-color:#5bacb6">
  <img class="avatar size-XL l" src="images/user.png">
  <dl style="margin-left:80px; color:#fff">
    <dt><span class="f-18" id="name"></span> <span class="pl-10 f-12" id="dor"></span></dt>
    <dd class="pt-10 f-12" style="margin-left:0" id="ad"></dd>
  </dl>
</div>
<div class="pd-20">
  <table class="table">
    <tbody>
    <tr>
      <th class="text-r" width="80">学号：</th>
      <td id="number"></td>
    </tr>
    <tr>
      <th class="text-r" width="80">班级：</th>
      <td id="cl"></td>
    </tr>
    <tr>
      <th class="text-r" width="80">出生日期：</th>
      <td id="bir"></td>
    </tr>
      <tr>
        <th class="text-r" width="80">性别：</th>
        <td id="sex"></td>
      </tr>
    <tr>
      <th class="text-r" width="80">身份证号码：</th>
      <td id="card"></td>
    </tr>
    <tr>
      <th class="text-r" width="80">生源地：</th>
      <td id="source"></td>
    </tr>
    <tr>
      <th class="text-r" width="80">高考准考证：</th>
      <td id="ticket"></td>
    </tr>
    <tr>
      <th class="text-r" width="80">籍贯：</th>
      <td id="nation"></td>
    </tr>
    <tr>
      <th class="text-r" width="80">政治面貌：</th>
      <td id="ide"></td>
    </tr>
    <tr>
      <th class="text-r" width="80">入学时间：</th>
      <td id="adm"></td>
    </tr>
      <tr>
        <th class="text-r">手机：</th>
        <td id="tel"></td>
      </tr>
      <tr>
        <th class="text-r">邮箱：</th>
        <td id="em"></td>
      </tr>
      <tr>
        <th class="text-r">QQ：</th>
        <td id="qq"></td>
      </tr>
    </tbody>
  </table>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/icheck/jquery.icheck.min.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="lib/laypage/laypage.js"></script>
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript">
	function init(num) {
		$.post("foundation!findByID",{"key":num},function(v){
    		var r = eval("("+v+")");
    		$("#name").html(r.realName);
			$("#dor").html("宿舍："+r.dormitory);
			$("#ad").html(r.address);
			$("#number").html(r.number);
			$("#cl").html(r.classes);
			$("#bir").html(r.birthday);
			$("#sex").html(r.sex);
			$("#card").html(r.idCard);
			$("#source").html(r.source);
			$("#nation").html(r.nation);
			$("#ide").html(r.identity);
			$("#adm").html(r.admission);
			$("#tel").html(r.phone);
			$("#em").html(r.email);
			$("#qq").html(r.qq);
			$("#ticket").html(r.ticket);
    	});
	}
</script>
</body>
</html>