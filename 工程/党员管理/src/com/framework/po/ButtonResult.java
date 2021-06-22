package com.framework.po;

import java.util.List;


/**
 * @Description: 按钮辅助类
 * @ClassName:  ButtonResult.java
 * @author 谭长华
 * @date 2016年10月28日 
 *
 */
public class ButtonResult {
	//一级菜单
	private Menu menu;
	//二级菜单及按钮
	private List<SubMenu> list;
	public Menu getMenu() {
		return menu;
	}
	public void setMenu(Menu menu) {
		this.menu = menu;
	}
	public List<SubMenu> getList() {
		return list;
	}
	public void setList(List<SubMenu> list) {
		this.list = list;
	}
}


