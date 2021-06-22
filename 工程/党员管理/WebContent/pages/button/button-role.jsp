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
    <![endif]-->
    <title>title</title>
</head>
<body>
<div class="pd-20">
    <form class="Huiform" id="form-role-add" action="button!updateButtonRole" method="post">
    	<input type="hidden" name="key" value="${role.id}">
        <table class="table table-border table-bordered table-bg">
            <tbody>
            <tr>
                <th class="text-r" width="80">角色名称：</th>
                <td><input value="${role.name}" type="text" class="input-text" readonly="readonly" placeholder="角色名称">
                </td>
            </tr>
            <tr>
                <th class="text-r va-t">按钮权限：</th>
                <td>
                    <table class="table table-border table-bordered table-bg">
                        <tbody>
                        <c:forEach items="${lists}" var="list1">
                        <tr>
                            <th>${list1.menu.name}</th>
                            <td class="permission-list">
                            <c:forEach items="${list1.list}" var="list2">
                            <div class="cl">
                                    <b class="item">${list2.subMenu.name}：</b>
                                    <c:forEach items="${list2.buttons}" var="list3">
                                    <c:if test="${list3.temp==1}">
                                    <label class="item">
                                    	<input name="btns" checked="checked" type="checkbox" value="${list3.id}-${list3.subId}"> ${list3.name}
                                    </label>
                                    </c:if>
                                    <c:if test="${list3.temp!=1}">
                                    <label class="item">
                                    	<input name="btns" type="checkbox" value="${list3.id}-${list3.subId}"> ${list3.name}
                                    </label>
                                    </c:if>
                                    </c:forEach>
                                </div>
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
                <td><textarea class="textarea" placeholder="描述下角色所具有的权限" readonly="readonly">${role.content}</textarea>
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
  	//初始化
	function init() {
		location.href = "button!editButtonRole?key="+<%=id%>;
	}
	//关闭layer
    function closeLayer() {
        var index = parent.layer.getFrameIndex(window.name);
        parent.location.replace(parent.location.href);
        parent.layer.close(index);
    }
</script>
</body>
</html>