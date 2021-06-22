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
<script type="text/javascript" src="lib/My97DatePicker/WdatePicker.js"></script>
    <link rel="stylesheet" href="lib/kindeditor/4.1.7/themes/default/default.css" />
    <style>
        .ke-icon-example1 {
            background-image: url(images/document_save.png);
            width: 16px;
            height: 16px;
        }
    </style>
<title>title</title>
</head>
<body>
<div class="pd-20">
  <form action="process!update" method="post" class="form form-horizontal" id="form-user-add">
  	<input type="hidden" name="process.id" id="id" value="<%=request.getParameter("id")%>">
  	<input type="hidden" name="process.state" id="state">
      <div class="row cl">
          <label class="form-label col-1">标题：</label>
          <div class="formControls col-11">
              <input type="text" class="input-text" name="process.title" id="title" placeholder="例：入党申请" datatype="*" nullmsg="*必填">
          </div>
      </div>
      <div class="row cl">
          <label class="form-label col-1">内容：</label>
          <div class="formControls col-11" style="height: 300px;">
              <textarea name="process.content"  id="content" class="textarea" datatype="*"></textarea>
          </div>
      </div>
      <div class="row cl">
          <div class="col-9 col-offset-3">
              <input class="btn btn-primary radius" type="submit" value="&nbsp;&nbsp;提交&nbsp;&nbsp;">
          </div>
      </div>
  </form>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script> 
<script type="text/javascript" src="js/H-ui.js"></script> 
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script charset="utf-8" src="lib/kindeditor/4.1.7/kindeditor-min.js"></script>
<script charset="utf-8" src="lib/kindeditor/4.1.7/lang/zh_CN.js"></script>
<script type="text/javascript">
    $(function(){
        $("#form-user-add").Validform({
            tiptype:2,
            ajaxPost:true,
            callback:function(data){
                $.Hidemsg();
                if (data.success) {
                    layer.msg(data.msg, 2, 1);
                    setTimeout(function(){
                        parent.location.replace(parent.location.href);
                    },1500);
                } else {
                    layer.msg(data.msg, 2);
                }
            }
        });
        init();
    });
    KindEditor.ready(function(K) {
    	editor = K.create('textarea[id="content"]', {
            resizeType : 2,
            allowPreviewEmoticons : false,
            allowImageUpload : true,
            fullscreenMode : false,
            height:'300px',
            items : ['source', '|', 'undo', 'redo', '|',
                'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                'removeformat', 'subscript', 'superscript', '|', 'justifyleft', 'justifycenter', 'justifyright',
                'insertorderedlist', 'insertunorderedlist', '|', 'emoticons', 'image', 'link', '|' , 'wordpaste', 'fullscreen']
        });
    });
  	//init
    function init() {
    	var id = $("#id").val();
    	$.post("process!findById",{"key":id},function(v){
    		var res = $.parseJSON(v);
    		$("#title").val(res.title);
    		$("#state").val(res.state);
    		editor.html(res.content);
    	});
    }
</script>
</body>
</html>