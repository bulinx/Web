<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
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
	<![endif]--><title>角色编辑</title>
</head>
<body>
<div class="pd-20">
	<form class="Huiform" id="form-role-add" method="post" action="role!editRole">
		<input type="hidden" name="role.id" value="${roles.id}">
		<input type="hidden" name="role.state" value="${roles.state}">
		<table class="table table-border table-bordered table-bg">
			<tbody>
			<tr>
				<th class="text-r" width="80">角色名称：</th>
				<td><input value="${roles.name}" name="role.name" type="text" class="input-text" datatype="*1-20" nullmsg="*必填" placeholder="角色名称">
				</td>
			</tr>
			<tr>
				<th class="text-r va-t">权限：</th>
				<td>
					<table class="table table-border table-bordered table-bg">
						<tbody>
						<c:forEach items="${lists}" var="list">
						<tr>
							<th>${list.menu.name}</th>
							<td class="permission-list">
							<c:forEach items="${list.subMenus}" var="sub">
								<label class="item">
								<c:set value="0" var="sf" scope="page"/>
								<c:forEach items="${roleMenus}" var="rm">
									<c:if test="${rm.menuId==sub.id}">
										<c:set value="1" var="sf" scope="page"/>
										<input name="menus" type="checkbox" checked="checked" value="${sub.id}"> ${sub.name}
									</c:if>
								</c:forEach>
								<c:if test="${sf==0}">
									<input name="menus" type="checkbox" value="${sub.id}"> ${sub.name}
								</c:if>
								</label>
							</c:forEach>
							</td>
						</tr>
						</c:forEach>
						</tbody>
					</table>
				</td>
			</tr>
			<tr>
				<th class="text-r va-t">描述：</th>
				<td><textarea name="role.content" class="textarea" datatype="*" placeholder="描述下角色所具有的权限">${roles.content}</textarea>
				</td>
			</tr>

			<tr>
				<th></th>
				<td>
					<button type="submit" class="btn btn-success radius" id="admin-role-save" name="admin-role-save"><i class="icon-ok"></i> 确定</button>
				</td>
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
<script>
	$(function() {
		$("#form-role-add").Validform({
			tiptype : 2,
			ajaxPost:true,
            callback:function(data){
    			$.Hidemsg();
    			if (data.success) {
                    layer.msg(data.msg, 2, 1);
                    setTimeout("closeLayer()",1500);
                } else {
                    layer.msg(data.msg, 2);
                }
    		}
		});
		var flag = '${flag}';
		if (flag != 1) {
			init();
		}
		
	});
  
 	//关闭layer
	function closeLayer() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.location.replace(parent.location.href);
		parent.layer.close(index);
	}
	
	//初始化
	function init() {
		location.href = "role!beforeEditRole?key="+<%=id%>;
	}
</script>
</body>
</html>