package com.framework.po;

import java.io.Serializable;
import java.sql.Timestamp;

import com.framework.utils.DateUtil;

/**
 * 
 * 描述：角色实体
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class Role implements Serializable {
	//主键
	private Integer id;
	//角色名称
	private String name;
	//描述
	private String content;
	//创建时间
	private Timestamp createTime = DateUtil.getSqlTimestamp();
	//状态(默认0)：0-启用，1-停用
	private Byte state = 0;
	//备份标志(默认0)：0-新增，1-修改，2-已备份
	private Byte flag = 0;
	public Role(String name, String content) {
		super();
		this.name = name;
		this.content = content;
	}
	public Role() {
		super();
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
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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
}
