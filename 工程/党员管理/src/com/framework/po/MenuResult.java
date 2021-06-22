package com.framework.po;

import java.io.Serializable;
import java.util.List;

/**
 * 
 * 描述：菜单数据构造结果
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class MenuResult implements Serializable,Comparable<MenuResult> {
	//父菜单
	private Menu menu;
	//父菜单对应子菜单
	private List<Menu> subMenus;
	public Menu getMenu() {
		return menu;
	}
	public void setMenu(Menu menu) {
		this.menu = menu;
	}
	public List<Menu> getSubMenus() {
		return subMenus;
	}
	public void setSubMenus(List<Menu> subMenus) {
		this.subMenus = subMenus;
	}
	@Override
	public int compareTo(MenuResult o) {
		// TODO Auto-generated method stub
		return this.getMenu().getOrderNum().compareTo(o.getMenu().getOrderNum());
	}
}
