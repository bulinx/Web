package com.framework.po.echart;

import java.util.List;


/**
 * @Description: 柱状图
 * @ClassName:  Bar.java
 * @author 谭长华
 * @date 2016年11月19日 
 *
 */
public class Bar {
	//图例
	private List<String> legend;
	//数据
	private List<Integer> data;
	//xAxis,X轴的文字说明
	private List<String> xAxis;
	public Bar() {
		super();
	}
	public Bar(List<String> legend, List<Integer> data) {
		super();
		this.legend = legend;
		this.data = data;
	}
	public List<String> getLegend() {
		return legend;
	}
	public void setLegend(List<String> legend) {
		this.legend = legend;
	}
	public List<Integer> getData() {
		return data;
	}
	public void setData(List<Integer> data) {
		this.data = data;
	}
	public List<String> getxAxis() {
		return xAxis;
	}
	public void setxAxis(List<String> xAxis) {
		this.xAxis = xAxis;
	}
}
