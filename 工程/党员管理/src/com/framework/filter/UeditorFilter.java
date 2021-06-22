package com.framework.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.dispatcher.ng.filter.StrutsPrepareAndExecuteFilter;

import com.framework.utils.Constant;

/**
 * 
 * 描述：UeditorFilter
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class UeditorFilter extends StrutsPrepareAndExecuteFilter {

	@Override
	public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		//获得请求地址
		String url = request.getRequestURI();
		//判断过滤条件
		if (url.contains(Constant.PROJECT_NAME + "/ueditor/1.4.3/jsp/")) {
			//Ueditor编辑器过滤
			chain.doFilter(req, res);         
		} else if (url.contains(Constant.PROJECT_NAME + "/ReportServer")) {
			//帆软报表
			chain.doFilter(req, res);
		} else {
			super.doFilter(req, res, chain);         
		} 
	}
}
