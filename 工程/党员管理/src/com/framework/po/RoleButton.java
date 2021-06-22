package com.framework.po;

import java.io.Serializable;


/**
 * @Description: 角色按钮
 * @ClassName:  RoleButton.java
 * @author 谭长华
 * @date 2016年10月28日 
 *
 */
@SuppressWarnings("serial")
public class RoleButton implements Serializable {
	//主键
	private Integer id;
	//角色ID
	private Integer roleId;
	//按钮ID
	private Integer buttonId;
	//二级菜单
	private Integer subMenuId;
	//状态(默认0)：0-启用，1-停用
	private Byte state = 0;
	//备份标志(默认0)：0-新增，1-修改，2-备份
	private Byte flag = 0;
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
	public Integer getButtonId() {
		return buttonId;
	}
	public void setButtonId(Integer buttonId) {
		this.buttonId = buttonId;
	}
	public Byte getState() {
		return state;
	}
	public void setState(Byte state) {
		this.state = state;
	}
	public Byte getFlag() {
		return flag;
	}
	public void setFlag(Byte flag) {
		this.flag = flag;
	}
	public Integer getSubMenuId() {
		return subMenuId;
	}
	public void setSubMenuId(Integer subMenuId) {
		this.subMenuId = subMenuId;
	}
}
