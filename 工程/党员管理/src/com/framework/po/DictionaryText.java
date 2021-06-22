package com.framework.po;

import java.io.Serializable;


/**
 * @Description: 字典值
 * @ClassName:  DictionaryText.java
 * @author 谭长华
 * @date 2016年11月2日 
 *
 */
@SuppressWarnings("serial")
public class DictionaryText implements Serializable {
	//主键
	private Integer id;
	//备份标志(默认0)：0-新增，1-修改，2-已备份
	private Byte flag = 0;
	//显示值
	private String name;
	//代码值
	private String value;
	//字典ID
	private Integer dicId;
	//字典名称
	private String dicName;
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
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public Integer getDicId() {
		return dicId;
	}
	public void setDicId(Integer dicId) {
		this.dicId = dicId;
	}
	public Byte getState() {
		return state;
	}
	public void setState(Byte state) {
		this.state = state;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDicName() {
		return dicName;
	}
	public void setDicName(String dicName) {
		this.dicName = dicName;
	}
}
