<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE HTML>
<HTML>
<HEAD>
    <base href="<%=basePath%>" />
    <TITLE> ZTREE DEMO </TITLE>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" href="lib/zTree/v3/css/zTreeStyle/zTreeStyle.css" type="text/css">
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
    <link href="lib/iconfont/1.0.7/iconfont.css" rel="stylesheet"
          type="text/css" />
    <!--[if IE 6]>
    <script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js"></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
    <style>
        #testIframe {margin-left: 10px;}
    </style>
    <script type="text/javascript" src="lib/zTree/v3/js/jquery-1.4.4.min.js"></script>
    <script type="text/javascript" src="lib/zTree/v3/js/jquery.ztree.core-3.5.js"></script>
    <link rel="stylesheet" href="lib/zTree/v3/css/zTreeStyle/zTreeStyle.css" type="text/css">
    <link rel="stylesheet" href="lib/zTree/v3/css/zTreeStyle/icon.css" type="text/css">
    <SCRIPT type="text/javascript" >
        <!--
        var zTree;
        var demoIframe;

        var setting = {
            view: {
                dblClickExpand: false,
                showLine: true,
                selectedMulti: false
            },
            data: {
                simpleData: {
                    enable:true,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: ""
                }
            },
            callback: {
                beforeClick: function(treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj("tree");
                    if (treeNode.isParent) {
                    	demoIframe.attr("src", "menu!clickZtree?key="+treeNode.id);
                        return true;
                    } else {
                        demoIframe.attr("src", "menu!clickZtree?key="+treeNode.id);
                        return true;
                    }
                }
            }
        };

        var zNodes = eval('('+'${list}'+')');

        $(document).ready(function(){
            var t = $("#tree");
            t = $.fn.zTree.init(t, setting, zNodes);
            demoIframe = $("#testIframe");
            demoIframe.bind("load", loadReady);
            var zTree = $.fn.zTree.getZTreeObj("tree");
            zTree.selectNode(zTree.getNodeByParam("id", 101));

        });

        function loadReady() {
            var bodyH = demoIframe.contents().find("body").get(0).scrollHeight,
                    htmlH = demoIframe.contents().find("html").get(0).scrollHeight,
                    maxH = Math.max(bodyH, htmlH), minH = Math.min(bodyH, htmlH),
                    h = demoIframe.height() >= maxH ? minH:maxH ;
            if (h < 530) h = 530;
            demoIframe.height(h);
        }
    </SCRIPT>
</HEAD>
<BODY>
<nav class="breadcrumb">
    <i class="iconfont">&#xf012b;</i> 首页 <span class="c-gray en">&gt;</span>
    权限管理 <span class="c-gray en">&gt;</span> 菜单管理
    <a
        class="btn btn-success radius r mr-20"
        style="line-height: 1.6em; margin-top: 3px"
        href="javascript:location.replace(location.href);" title="刷新"><i
        class="icon-refresh"></i></a>
</nav>
<TABLE border=0 height=600px width="100%" align=left>
    <TR>
        <TD width="15%" align=left valign=top style="BORDER-RIGHT: #999999 1px dashed">
            <ul id="tree" class="ztree" style="width:100%; overflow:auto;"></ul>
        </TD>
        <TD width="85%" align=left valign=top>
            <IFRAME ID="testIframe" Name="testIframe" FRAMEBORDER=0 SCROLLING=AUTO width=100%  height=600px SRC="menu!menuList"></IFRAME>
        </TD>
    </TR>
</TABLE>
<script type="text/javascript" src="js/H-ui.js"></script>
</BODY>
</HTML>
