package com.framework.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ApplicationAware;
import org.apache.struts2.interceptor.RequestAware;
import org.apache.struts2.interceptor.SessionAware;
import org.apache.struts2.util.ServletContextAware;

import com.framework.po.User;
import com.framework.utils.Constant;
import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionSupport;

/**
 * 
 * 描述：基本的Action。不直接使用。一般使用他的子类 定义了基本常量和基本request， response等注入 分页参数的配置等
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public abstract class AbstractAction extends ActionSupport implements
		RequestAware, SessionAware, ApplicationAware, ServletContextAware {

	private static final long serialVersionUID = 1L;

	// 所有Action公用的常量
	protected HttpServletRequest request = ServletActionContext.getRequest();
	protected HttpSession session = ServletActionContext.getRequest()
			.getSession();
	protected HttpServletResponse response = ServletActionContext.getResponse();
	protected ServletContext application = session.getServletContext();// application对象

	/**
	 * 基本action的session，request等的注入
	 */
	public Map<String, Object> msession;
	public Map<String, Object> mrequest;
	public Map<String, Object> mapplication;
	public ServletContext servletContext;
	public HttpServletResponse mresponse = ServletActionContext.getResponse();
	public PrintWriter out;

	/**
	 * 获得当前用户
	 */
	protected User user = (User) session.getAttribute(Constant.CURRENT_USER);
	
	/**
	 * 初始化out对象,用于输出相应格式文档到前台
	 */
	protected void outPrint(String s) {

		try {
			response = ServletActionContext.getResponse();
			response.setCharacterEncoding("utf-8");
			response.setContentType("text/html;utf-8");
			out = response.getWriter();
			// 输出到前台
			out.print(s);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			// 关闭输出流
			out.flush();
			out.close();
		}
	}
	
	/**
	 * 初始化out对象,用于输出相应格式文档到前台
	 */
	protected void outPrint(Object obj) {
		//GSON
		Gson gson = new Gson();
		try {
			response = ServletActionContext.getResponse();
			response.setCharacterEncoding("utf-8");
			response.setContentType("text/html;utf-8");
			out = response.getWriter();
			// 输出到前台
			out.print(gson.toJson(obj));
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			// 关闭输出流
			out.flush();
			out.close();
		}
	}

	/**
	 * 移除登陆信息
	 */
	public void removeSession() {
		HttpSession session = ServletActionContext.getRequest().getSession(
				false);
		if (session != null) {
			session.removeAttribute("user");
			session.invalidate();
		}
	}

	public void setRequest(Map<String, Object> request) {

		this.mrequest = request;
	}

	public void setServletContext(ServletContext servletContext) {

		this.servletContext = servletContext;
	}

	public void setApplication(Map<String, Object> application) {

		this.mapplication = application;
	}

	public void setSession(Map<String, Object> session) {

		this.msession = session;
	}
	
	// 当前页
	protected int currentPage;

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}
}
