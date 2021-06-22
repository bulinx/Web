package com.framework.po.echart;


/**
 * @Description: 图表数据
 * @ClassName:  ChartData.java
 * @author 谭长华
 * @date 2016年11月28日 
 *
 */
public class ChartData {
	//值
	private int total;
	//图例
	private String legend;
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public String getLegend() {
		return legend;
	}
	public void setLegend(String legend) {
		this.legend = legend;
	}
}
