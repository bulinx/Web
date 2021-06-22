package com.xgdj.po;

/**
 * 饼图数据
 * @author 谭长华
 * @ClassName ChartPIE.java
 * @date 2017年4月25日
 *
 */
public class ChartPIE {
	//value
	private Integer value;
	//name
	private String name;
	public Integer getValue() {
		return value;
	}
	public String getName() {
		return name;
	}
	public void setValue(Integer value) {
		this.value = value;
	}
	public void setName(String name) {
		this.name = name;
	}
}
