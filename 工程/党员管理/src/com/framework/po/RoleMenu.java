package com.framework.po;

import java.io.Serializable;

/**
 * 
 * 描述：角色菜单关系
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class RoleMenu implements Serializable {
	//主键
	private Integer id;
	//角色ID
	private Integer roleId;
	//菜单ID
	private Integer menuId;
	//状态(默认0)：0-启用，1-停用
	private Byte state = 0;
	//备份标志(默认0)：0-新增，1-修改，2-备份
	private Byte flag = 0;
	public RoleMenu() {
		super();
	}
	public RoleMenu(Integer roleId, Integer menuId) {
		super();
		this.roleId = roleId;
		this.menuId = menuId;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getRoleId() {
		return roleId;
	}
	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}
	public Integer getMenuId() {
		return menuId;
	}
	public void setMenuId(Integer menuId) {
		this.menuId = menuId;
	}
	public Byte getFlag() {
		return flag;
	}
	public void setFlag(Byte flag) {
		this.flag = flag;
	}
	public Byte getState() {
		return state;
	}
	public void setState(Byte state) {
		this.state = state;
	}
}
