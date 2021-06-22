package com.framework.po;

import java.io.Serializable;


/**
 * @Description: 字典代码
 * @ClassName:  Dictionary.java
 * @author 谭长华
 * @date 2016年11月2日 
 *
 */
@SuppressWarnings("serial")
public class Dictionary implements Serializable {
	//主键
	private Integer id;
	//备份标志(默认0)：0-新增，1-修改，2-已备份
	private Byte flag = 0;
	//字典名称
	private String name;
	//字典代码唯一
	private String code;
	//状态(默认0)：0-启用，1-停用
	private Byte state = 0;
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
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public Byte getState() {
		return state;
	}
	public void setState(Byte state) {
		this.state = state;
	}
}
