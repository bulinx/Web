package com.framework.service;

import java.util.ArrayList;
import java.util.List;

import com.framework.dao.impl.MenuDAOImpl;
import com.framework.po.Menu;

/**
 * 
 * 描述：系统级业务处理
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class SystemService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final SystemService instance = new SystemService();

	// 静态工厂方法
	public static SystemService getInstance() {
		return instance;
	}
	
	/**
	 * 系统菜单
	 */
	private static List<Menu> menuLists = new ArrayList<Menu>();
	
	/**
	 * 查询系统菜单
	 * @return List<Menu>
	 */
	public List<Menu> getAllMenu() {
		//查询
		menuLists = MenuDAOImpl.getInstance().loadAll(Menu.class);
		return menuLists;
	}
}
