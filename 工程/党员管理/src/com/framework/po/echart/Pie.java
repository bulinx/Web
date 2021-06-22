package com.framework.po.echart;

import java.io.Serializable;
import java.util.List;

/**
 * 
 * 描述：EChart饼图
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class Pie<T> implements Serializable{
	//图例
	private List<String> legend;
	//数据
	private List<T> data;
	public Pie() {
		super();
	}
	public Pie(List<String> legend, List<T> data) {
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
	public List<T> getData() {
		return data;
	}
	public void setData(List<T> data) {
		this.data = data;
	}
}
