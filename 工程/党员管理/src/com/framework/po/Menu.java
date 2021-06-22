package com.framework.po;

import java.io.Serializable;

/**
 * 
 * 描述：菜单
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class Menu implements Serializable,Comparable<Menu> {
	//主键
	private Integer id;
	//图标
	private String icon = "icon-paste";
	//上级代码
	private Integer codes;
	//菜单名称
	private String name;
	//访问地址
	private String url;
	//菜单说明
	private String content;
	//是否打开节点(默认false)
	private Boolean open = false;
	//是否有子节点(默认true)
	private Boolean isParent = true;
	//状态(默认0)：0-启用，1-停用
	private Byte state = 0;
	//备份标志(默认0)：0-新增，1-修改，2-备份
	private Byte flag = 0;
	//排序,默认0
	private Integer orderNum = 0;
	public Menu() {
		super();
	}
	public Menu(String name) {
		super();
		this.name = name;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public Integer getCodes() {
		return codes;
	}
	public void setCodes(Integer codes) {
		this.codes = codes;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
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
	public Boolean getOpen() {
		return open;
	}
	public void setOpen(Boolean open) {
		this.open = open;
	}
	public Boolean getIsParent() {
		return isParent;
	}
	public void setIsParent(Boolean isParent) {
		this.isParent = isParent;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Integer getOrderNum() {
		return orderNum;
	}
	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
	}
	@Override
	public int compareTo(Menu o) {
		// 按照排序字段排序
		return this.getOrderNum().compareTo(o.getOrderNum());
	}
}
