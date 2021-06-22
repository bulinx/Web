package com.framework.po.echart;

import java.io.Serializable;
import java.util.List;

/**
 * 
 * 描述：折线图、柱状图
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class BarAndLine implements Serializable {
	//图例
	private List<String> legend;
	//X轴数据
	private List<String> xAxis;
	//数据
	private List<Double> data;
	public BarAndLine() {
		super();
	}
	public BarAndLine(List<String> legend, List<String> xAxis, List<Double> data) {
		super();
		this.legend = legend;
		this.xAxis = xAxis;
		this.data = data;
	}
	public List<String> getLegend() {
		return legend;
	}
	public void setLegend(List<String> legend) {
		this.legend = legend;
	}
	public List<String> getxAxis() {
		return xAxis;
	}
	public void setxAxis(List<String> xAxis) {
		this.xAxis = xAxis;
	}
	public List<Double> getData() {
		return data;
	}
	public void setData(List<Double> data) {
		this.data = data;
	}
}
