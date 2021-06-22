package com.framework.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import com.framework.utils.DateUtil;

/**
 * 
 * @ClassName: User 
 * @Description: 用户登录信息 
 * @author 谭长华
 * @date 2016年8月1日 上午10:34:17 
 *
 */
@SuppressWarnings("serial")
public class User implements Serializable {
	//主键
	private Integer id;
	//帐号
	private String name;
	//密码
	private String pass;
	//状态(默认0)：0-启用，1-停用
	private Byte state = 0;
	//权限,权限表
	private Role role;
	//创建时间
	private Timestamp createTime = DateUtil.getSqlTimestamp();
	//备份标志(默认0)：0-新增，1-修改，2-已备份
	private Byte flag = 0;
	//用户菜单
	private List<MenuResult> menuResults;
	public User() {
	}
	public User(String name, String pass) {
		this.name = name;
		this.pass = pass;
	}
	public Byte getState() {
		return state;
	}
	public void setState(Byte state) {
		this.state = state;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPass() {
		return pass;
	}
	public void setPass(String pass) {
		this.pass = pass;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	public Byte getFlag() {
		return flag;
	}
	public void setFlag(Byte flag) {
		this.flag = flag;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public List<MenuResult> getMenuResults() {
		return menuResults;
	}
	public void setMenuResults(List<MenuResult> menuResults) {
		this.menuResults = menuResults;
	}
}
