package com.framework.po;

import java.util.List;


/**
 * @Description: 二级菜单及按钮
 * @ClassName:  SubMenu.java
 * @author 谭长华
 * @date 2016年10月28日 
 *
 */
public class SubMenu {
	//二级菜单
	private Menu subMenu;
	//按钮
	private List<Button> buttons;
	public Menu getSubMenu() {
		return subMenu;
	}
	public void setSubMenu(Menu subMenu) {
		this.subMenu = subMenu;
	}
	public List<Button> getButtons() {
		return buttons;
	}
	public void setButtons(List<Button> buttons) {
		this.buttons = buttons;
	}
}
