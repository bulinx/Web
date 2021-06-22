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
    <link href="lib/icheck/icheck.css" rel="stylesheet" type="text/css" />
    <link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <!--[if IE 7]>
    <link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css" />
    <![endif]-->
    <link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css" />
    <!--[if IE 6]>
    <script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js" ></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
    <title>添加用户</title>
</head>
<body>
<div class="pd-20">
    <form method="post" class="form form-horizontal" id="form-add">
        <input type="hidden" id="codes" name="menu.codes">
        <input type="hidden" id="id" name="menu.id">
        <input type="hidden" id="state" name="menu.state">
        <input type="hidden" id="flag" name="menu.flag">
        <input type="hidden" id="open" name="menu.open">
        <input type="hidden" id="isParent" name="menu.isParent">
        <div class="row cl">
            <label class="form-label col-3">名称：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" placeholder="菜单名称" id="name" name="menu.name" datatype="*1-50" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div id="pr" style="display: none;">
            <div class="row cl">
                <label class="form-label col-3">图标：</label>
                <div class="formControls col-6">
                    <input type="text" class="input-text" placeholder="菜单图标，H-ui" id="icon" name="menu.icon" datatype="*0-50" nullmsg="*必填">
                </div>
                <div class="col-3"> </div>
            </div>
        </div>
        <div id="ch" style="display: none;">
            <div class="row cl" id="mr">
                <label class="form-label col-3">父级菜单：</label>
                <div class="formControls col-6"> <span class="select-box">
                    <select class="select" size="1" id="pcode" onchange="code(this);" datatype="*" nullmsg="*必选">
                        <option value="">--请选择--</option>
                    </select></span>
                </div>
                <div class="col-3"> </div>
            </div>
            <div class="row cl">
                <label class="form-label col-3">URL：</label>
                <div class="formControls col-6">
                    <input type="text" class="input-text" placeholder="访问地址" id="url" name="menu.url" datatype="en" nullmsg="*必填" errormsg="不能输入中文">
                </div>
                <div class="col-3"> </div>
            </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">序号：</label>
            <div class="formControls col-6">
                <input id="order" type="text" class="input-text" placeholder="排序序号" name="menu.orderNum" datatype="n" nullmsg="*必填" errormsg="*数字">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
	      	<label class="form-label col-3">描述：</label>
	      	<div class="formControls col-6">
	        	<textarea name="menu.content" id="content" class="textarea"  placeholder="菜单说明" datatype="*1-100" dragonfly="true" nullmsg="备注不能为空！" onKeyUp="textarealength(this,100)"></textarea>
	       		<p class="textarea-numberbar"><em class="textarea-length">0</em>/100</p>
	      	</div>
	      	<div class="col-3"> </div>
    	</div>
        <div class="row cl">
            <div class="col-9 col-offset-3">
                <input class="btn btn-primary radius" type="submit" value="&nbsp;&nbsp;提交&nbsp;&nbsp;">
            </div>
        </div>
    </form>
</div>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/icheck/jquery.icheck.min.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript">
    $(function(){
        $("#form-add").Validform({
            tiptype:2,
            datatype : {
                "en":/^[^\u4e00-\u9fa5]{0,}$/
            }
        });
        menu();
        setTimeout("init(<%=id%>)", 300);
    });

    function init(id) {
        $.post("menu!getMenuById",{"key":id}, function (v) {
            var r = eval("("+v+")");
            $("#id").val(r.id);
            $("#codes").val(r.codes);
            $("#state").val(r.state);
            $("#flag").val(r.flag);
            $("#name").val(r.name);
            $("#order").val(r.orderNum);
            $("#content").val(r.content);
            $("#open").val(r.open);
            $("#isParent").val(r.isParent);
            if (r.codes == 0) {
                $("#pr").show();
                $("#icon").val(r.icon);
            } else {
                $("#ch").show();
                $("#url").val(r.url);
                $("#pcode option").map(function(){
                    if ($(this).val() == r.codes) {
                        $(this).attr("selected","selected");
                    }
                });
            }
        });
    }

    function code(obj) {
        var v = $(obj).val();
        $("#codes").val(v);
    }

    //异步提交
    $("#form-add").submit(function() {
        $.ajax({
            url : "menu!update",
            data : $('#form-add').serialize(),
            type : "POST",
            dataType : 'text',
            success : function(v) {
                var r = eval("(" + v + ")");
                if (r.success) {
                    layer.msg(r.msg, 2, 1);
                    setTimeout("closeLayer()", 1500);
                } else {
                    layer.msg(r.msg, 2);
                }
            }
        });
        return false;
    });

    //关闭layer
    function closeLayer() {
        var index = parent.layer.getFrameIndex(window.name);
        parent.location.replace(parent.location.href);
        parent.layer.close(index);
    }

    function menu() {
        $.post("menu!parentMenu",{},function(v){
            var r = eval("("+v+")");
            for (var i = 0; i < r.length; ++i) {
                $("#pcode").append('<option value="'+ r[i].id+'">'+ r[i].name+'</option>');
            }
        });
    }
</script>
</body>
</html>