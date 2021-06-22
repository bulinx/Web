package com.framework.po.echart;

import java.io.Serializable;

/**
 * 
 * 描述：键值对形式的数据值饼图
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class CViews implements Serializable {
	//键
	private String name;
	//值
	private String value;
	public CViews() {
		super();
	}
	public CViews(String name, String value) {
		super();
		this.name = name;
		this.value = value;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
}
