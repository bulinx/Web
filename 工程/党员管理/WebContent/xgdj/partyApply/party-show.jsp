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
  <dl style="margin-left:90px; color:#fff">
    <dt><span class="f-18" id="name"></span> <span class="pl-10 f-12" id="number"></span></dt>
    <dd class="pt-10 f-12" style="margin-left:0" id="ad"></dd>
  </dl>
</div>	
<div class="pd-20">
  <table class="table">
    <tbody>
    <tr>
      <th class="text-r" width="90">学历：</th>
      <td id="culture"></td>
    </tr>
    <tr>
      <th class="text-r" width="90">推荐推优方式：</th>
      <td id="promote"></td>
    </tr>
      <tr>
        <th class="text-r" width="90">列为积极分子：</th>
        <td id="positiveDate"></td>
      </tr>
    <tr>
      <th class="text-r" width="90">第一联系人：</th>
      <td id="linkan1"></td>
    </tr>
    <tr>
      <th class="text-r" width="90">第二联系人：</th>
      <td id="linkan2"></td>
    </tr>
    <tr>
      <th class="text-r" width="90">培训情况：</th>
      <td id="train"></td>
    </tr>
    <tr>
      <th class="text-r" width="90">表彰情况：</th>
      <td id="honor"></td>
    </tr>
    <tr>
      <th class="text-r" width="90">支部通过：</th>
      <td id="passDate"></td>
    </tr>
    <tr>
      <th class="text-r" width="90">分党委审批：</th>
      <td id="approveDate"></td>
    </tr>
    <tr>
      <th class="text-r" width="90">志愿书编号：</th>
      <td id="volunteer"></td>
    </tr>
    </tbody>
  </table>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript">
	function init(id) {
		$.post("positive!findById",{"key":id},function(v){
    		var r = eval("("+v+")");
    		$("#number").html(r.number);
    		$("#name").html(r.name);
			$("#ad").html(r.idCard);			
			$("#culture").html(r.culture);
			$("#promote").html(r.promote);
			$("#positiveDate").html(r.positiveDate);
			$("#linkan1").html(r.linkMan1);
			$("#linkan2").html(r.linkMan2);
			$("#train").html(r.train);
			$("#honor").html(r.honor);
			$("#volunteer").html(r.volunteer);
			$("#approveDate").html(r.approveDate);
			$("#passDate").html(r.passDate);
    	});
	}
</script>
</body>
</html>