<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
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
<![endif]--><title>基本设置</title>
</head>
<body>
<nav class="breadcrumb"><i class="iconfont">&#xf012b;</i> 首页 <span class="c-gray en">&gt;</span> 系统管理 <span class="c-gray en">&gt;</span> 基本设置  <a class="btn btn-success radius r mr-20" style="line-height:1.6em;margin-top:3px" href="javascript:location.replace(location.href);" title="刷新" ><i class="icon-refresh"></i></a></nav>
<div class="pd-20">
  <form method="post" id="form-add">
  <input type="hidden" name="website.id" value="${web.id}">
  <table class="table table-border table-bordered table-hover table-bg">
  <tbody>
  <tr>
    <th class="text-r" width="100">网站名称：</th>
    <td><input type="text" id="website-title" name="website.name" placeholder="控制在25个字、50个字节以内" value="${web.name}" style="width:500px" class="input-text">
    </td>
  </tr>
  <tr>
    <th class="text-r">关键词：</th>
    <td>
      <input type="text" id="website-Keywords" name="website.keywords" placeholder="5个左右,8汉字以内,用英文,隔开" value="${web.keywords}" style="width:500px" class="input-text">
    </td>
  </tr>
  <tr>
    <th class="text-r">描述：</th>
    <td>
      <input type="text" name="website.description" id="website-description" placeholder="空制在80个汉字，160个字符以内" value="${web.description}" style="width:500px" class="input-text">
    </td>
  </tr>
  <tr>
    <th class="text-r">css、js、images路径配置：</th>
    <td>
      <input type="text" id="website-static" name="website.statics" placeholder="默认为空，为相对路径" value="${web.statics}" style="width:500px" class="input-text">
    </td>
  </tr>
  <tr>
    <th class="text-r">上传目录配置：</th>
    <td>
      <input type="text" id="website-uploadfile" name="website.uploadfile" placeholder="默认为uploadfile" value="${web.uploadfile}" style="width:500px" class="input-text">
    </td>
  </tr>
  <tr>
    <th class="text-r">底部版权信息：</th>
    <td>
      <input type="text" id="website-copyright" name="website.copyright" placeholder="&copy; 2014 H-ui.net" value="${web.copyright}" style="width:500px" class="input-text">
    </td>
  </tr>
  <tr>
    <th class="text-r">备案号：</th>
    <td>
      <input type="text" id="website-icp" name="website.icp" placeholder="京ICP备00000000号" value="${web.icp}" style="width:500px" class="input-text">
    </td>
  </tr>
  <tr>
    <th class="text-r"></th>
    <td><button name="system-base-save" id="system-base-save" class="btn btn-success radius" type="submit"><i class="icon-ok"></i> 确定</button></td>
  </tr>
  </tbody>
  </table>
  </form>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script> 
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script> 
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script> 
<script type="text/javascript" src="lib/laypage/laypage.js"></script> 
<script type="text/javascript" src="js/H-ui.js"></script> 
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript">
//异步提交
$("#form-add").submit(function() {
	$.ajax({
		url : "website",
		data : $('#form-add').serialize(),
		type : "POST",
		dataType : 'text',
		success : function(v) {
			var r = eval("(" + v + ")");
			var index = parent.layer.getFrameIndex(window.name);
			if (r.success) {
				layer.msg(r.msg, 2, 1);
				parent.layer.close(index);
			} else {
				layer.msg(r.msg, 2);
			}
		}
	});
	return false;
});
</script>
</body>
</html>