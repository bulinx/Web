package com.framework.dao.impl;

import com.framework.dao.WebsiteDAO;

/**
 * 
 * 描述：网站基本信息数据接口实现
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class WebsiteDAOImpl extends CommonDAOImpl implements WebsiteDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final WebsiteDAOImpl instance = new WebsiteDAOImpl();

	// 静态工厂方法
	public static WebsiteDAOImpl getInstance() {
		return instance;
	}
}
