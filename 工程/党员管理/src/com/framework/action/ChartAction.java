package com.framework.action;

import com.framework.po.echart.BarAndLine;
import com.framework.po.echart.ChartUtil;
import com.framework.po.echart.Pie;
import com.framework.service.ChartService;
import com.google.gson.Gson;

/**
 * 
 * 描述：EChart业务逻辑
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class ChartAction extends AbstractAction {
	//时间
	private String dates;
	//格式
	private String format;
	
	/**
	 * 登录区域分布饼图
	 */
	@Override
	public String execute() throws Exception {
		//Gson
		Gson gson = new Gson();
		
		// 查询
		@SuppressWarnings("rawtypes")
		Pie pie = ChartService.getInstance().getLoginArea();
		
		//返回
		outPrint(gson.toJson(pie));
		return null;
	}
	
	/**
	 * 访问区域分布饼图
	 */
	public String cview() throws Exception {
		//Gson
		Gson gson = new Gson();
		
		// 查询
		@SuppressWarnings("rawtypes")
		Pie pie = ChartService.getInstance().getViewArea();
		
		//返回
		outPrint(gson.toJson(pie));
		return null;
	}
	
	/**
	 * 访问区域数据折线图
	 */
	public String viewBar() throws Exception {
		//Gson
		Gson gson = new Gson();
		
		// 查询
		BarAndLine barAndLine = ChartService.getInstance().getViewBar();
		
		//返回
		outPrint(gson.toJson(barAndLine));
		return null;
	}
	
	/**
	 * 登录区域数据折线图
	 */
	public String logBar() throws Exception {
		//Gson
		Gson gson = new Gson();
		
		// 查询
		BarAndLine barAndLine = ChartService.getInstance().getLogBar();
		
		//返回
		outPrint(gson.toJson(barAndLine));
		return null;
	}
	
	/**
	 * 按时间查询访问数据统计-饼图
	 * @throws Exception
	 */
	public void viewPie() throws Exception {
		//Gson
		Gson gson = new Gson();
		
		// 查询
		ChartUtil chartUtil = new ChartUtil();
		
		//判断
		if ("7".equals(dates)) {
			//最近一周
			chartUtil = ChartService.getInstance().findViewPie();
		} else {
			//其他
			chartUtil = ChartService.getInstance().findViewPie(dates, format);
		}
		//标题
		chartUtil.setTitle("网站用户访问区域分布统计");
		//子标题
		chartUtil.setSubtext("用户访问");
		
		//返回
		outPrint(gson.toJson(chartUtil));
	}
	
	/**
	 * 按时间查询访问数据统计-折线图，柱状图
	 * @throws Exception
	 */
	public void viewLine() throws Exception {
		//Gson
		Gson gson = new Gson();
		
		// 查询
		ChartUtil chartUtil = new ChartUtil();
		
		//判断
		if ("7".equals(dates)) {
			//最近一周
			chartUtil = ChartService.getInstance().getViewLine();
		} else {
			//其他
			chartUtil = ChartService.getInstance().getViewBar(dates, format);
		}
		//标题
		chartUtil.setTitle("网站用户访问区域分布统计");
		//子标题
		chartUtil.setSubtext("用户访问");
		
		//返回
		outPrint(gson.toJson(chartUtil));
	}
	
	/**
	 * 按时间查询登录数据统计-饼图
	 * @throws Exception
	 */
	public void logPie() throws Exception {
		//Gson
		Gson gson = new Gson();
		
		// 查询
		ChartUtil chartUtil = new ChartUtil();
		
		//判断
		if ("7".equals(dates)) {
			//最近一周
			chartUtil = ChartService.getInstance().findLogPie();
		} else {
			//其他
			chartUtil = ChartService.getInstance().findLogPie(dates, format);
		}
		//标题
		chartUtil.setTitle("网站用户登录区域分布统计");
		//子标题
		chartUtil.setSubtext("登录区域");
		
		//返回
		outPrint(gson.toJson(chartUtil));
	}

	public String getDates() {
		return dates;
	}

	public void setDates(String dates) {
		this.dates = dates;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}
}
