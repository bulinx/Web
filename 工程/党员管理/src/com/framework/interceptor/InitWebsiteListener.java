package com.framework.interceptor;

import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.framework.dao.impl.WebsiteDAOImpl;
import com.framework.po.Website;
import com.framework.utils.Constant;

/**
 * 
 * 描述：初始化网站信息
 * 
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class InitWebsiteListener implements ServletContextListener  {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		//全局对象
		ServletContext application = arg0.getServletContext();
		// 销毁
		application.removeAttribute(Constant.WEBSITE);
	}

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		//查询
		List<Website> lists = WebsiteDAOImpl.getInstance().loadAll(Website.class);
		//全局对象
		ServletContext application = arg0.getServletContext();
		//数据
		application.setAttribute(Constant.WEBSITE, lists.get(0));
	}
}
