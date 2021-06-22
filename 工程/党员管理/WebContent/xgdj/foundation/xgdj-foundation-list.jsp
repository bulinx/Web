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
    基础数据 <span class="c-gray en">&gt;</span> 查看数据
    <a class="btn btn-success radius r mr-20" style="line-height: 1.6em; margin-top: 3px"
       href="javascript:location.replace(location.href);" title="刷新">
        <i class="icon-refresh"></i>
    </a>
</nav>
<div class="pd-20">
    <div class="text-c">
        <form action="foundation" method="post" id="sear">
            <input type="text" value="${obj.number}" name="foundation.number" class="input-text" style="width: 180px;" placeholder="学号">
            <input type="text" value="${obj.realName}" name="foundation.realName" class="input-text" style="width: 180px;" placeholder="姓名">
            <input type="hidden" id="currentPage" name="currentPage">
            <button type="submit" class="btn btn-success">
                <i class="icon-search"></i> 搜索
            </button>
            <button type="reset" class="btn btn-success">
                <i class="icon-refresh"></i> 清空
            </button>
        </form>
    </div>
    <div class="cl pd-5 bg-1 bk-gray mt-20">
        <span class="l">
            <a roles="5442-74" href="javascript:void(0);" onclick="add('550','220','录入数据','xgdj/foundation/xgdj-foundation-man-add.jsp')" class="btn btn-success radius">
                <i class="icon-plus"></i> 新增数据
            </a>
            <a roles="f802-74" href="javascript:void(0);" onclick="excel('导入数据','xgdj/foundation/excel.jsp?url=foundation!excel')" class="btn btn-primary radius">
                <i class="icon-upload-alt"></i> 导入数据
            </a>
            <a roles="443a-74" href="foundation!template"  class="btn btn-default radius">
                <i class="icon-download-alt"></i> 下载模板
            </a>
        </span>
        <span class="r">共有数据：<strong>${page.totalCount}</strong> 条</span>
    </div>
    <table class="table table-border table-bordered table-hover table-bg table-sort" cellspacing="0" width="100%">
        <thead>
        <tr class="text-c">
            <th>序号</th>
            <th>学号</th>
            <th>姓名</th>
            <th>性别</th>
            <th>身份证号码</th>
            <th>电话</th>
            <th>宿舍</th>
            <th>班级</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <c:forEach items="${lists}" var="list" varStatus="sta">
            <tr class="text-c">
                <td>${sta.index+1}</td>
                <td>${list.number}</td>
                <td>${list.realName}</td>
                <td>${list.sex}</td>
                <td>${list.idCard}</td>
                <td>${list.phone}</td>
                <td>${list.dormitory}</td>
                <td>${list.classes}</td>
                <td class="f-14 user-manage">
                    <a roles="c838-74" style="text-decoration: none" href="javascript:void(0);" onclick="page_show('10001','360','','个人信息','xgdj/foundation/foundation-show.jsp?id=${list.id}')" class="ml-5" title="查看更多">
                        <i class="icon-eye-open"></i>
                    </a>
                    <a roles="f52b-74" title="删除" href="javascript:void(0);" onclick="del(this,'${list.id}');" class="ml-5" style="text-decoration: none">
                        <i class="icon-trash"></i>
                    </a>
                </td>
            </tr>
        </c:forEach>
        </tbody>
    </table>
    <div class="text-c mt-10" id="page_id"></div>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript" src="lib/laypage-v1.3/laypage/laypage.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="js/H-ui.admin.doc.js"></script>
<script type="text/javascript">
    $(function() {
        roles();
    });
    $('.table-sort').dataTable({
        "lengthMenu" : false,//显示数量选择
        "bFilter" : false,//过滤功能
        "bPaginate" : false,//翻页信息
        "bInfo" : false,//数量信息
        "aaSorting" : [ [ 0, "desc" ] ],//默认第几个排序
        "bStateSave" : true,//状态保存
        "aoColumnDefs" : [
            //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
            {
                "orderable" : false,
                "aTargets" : [2,3,4,5,6,7,8]
            } // 制定列不参与排序
        ]
    });

    //page
    laypage({
        cont: 'page_id',
        pages: '${page.totalPage}', //总页数
        skip: true, //是否开启跳页
        curr: '${page.currentPage}',
        jump: function(e, first){ //触发分页后的回调
            if(!first){ //一定要加此判断，否则初始时会无限刷新
            	$("#currentPage").val(e.curr);
                $("#sear").submit();
            }
        }
    });

    /*导入*/
    function excel(title,url){
    	$.layer({
	      type : 2,
	      title: title,
	      shadeClose: true,
	      maxmin: true,
	      fix : false,  
	      area: ['1024px', 500],           
	      iframe: {
	        src : url
	      } 
   	    });
    }

    /*删除*/
    function del(obj,id){
        layer.confirm('确认要删除吗？',function(index){
            $.post("foundation!delete",{"key":id},function(v){
                var res = $.parseJSON(v);
                if (res.success) {
                    $(obj).parents("tr").remove();
                    layer.msg(res.msg,1,1);
                } else {
                    layer.msg(res.msg,2);
                }
            });
        });
    }
    
    /*查看*/
	function page_show(id, w, h, title, url) {
		layer_show(w, h, title, url);
	}
</script>
</body>
</html>