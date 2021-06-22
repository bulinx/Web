package com.framework.po;

import java.io.Serializable;


/**
 * @Description: 按钮权限
 * @ClassName:  Button.java
 * @author 谭长华
 * @date 2016年10月28日 
 *
 */
@SuppressWarnings("serial")
public class Button implements Serializable {
	//主键
	private Integer id;
	//备份标志(默认0)：0-新增，1-修改，2-已备份
	private Byte flag = 0;
	//按钮名称
	private String name;
	//二级菜单ID
	private Integer subId;
	//二级菜单名称
	private String subName;
	//标识
	private String identity;
	//描述
	private String content;
	//状态(默认0)：0-启用，1-停用
	private Byte state = 0;
	//临时标志
	private Integer temp;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Byte getFlag() {
		return flag;
	}
	public void setFlag(Byte flag) {
		this.flag = flag;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getSubId() {
		return subId;
	}
	public void setSubId(Integer subId) {
		this.subId = subId;
	}
	public String getSubName() {
		return subName;
	}
	public void setSubName(String subName) {
		this.subName = subName;
	}
	public String getIdentity() {
		return identity;
	}
	public void setIdentity(String identity) {
		this.identity = identity;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Byte getState() {
		return state;
	}
	public void setState(Byte state) {
		this.state = state;
	}
	public Integer getTemp() {
		return temp;
	}
	public void setTemp(Integer temp) {
		this.temp = temp;
	}
}
