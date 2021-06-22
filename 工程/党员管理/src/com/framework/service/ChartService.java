package com.framework.service;

import java.util.ArrayList;
import java.util.List;

import com.framework.dao.impl.ChartDAOImpl;
import com.framework.po.echart.Bar;
import com.framework.po.echart.BarAndLine;
import com.framework.po.echart.CViews;
import com.framework.po.echart.ChartData;
import com.framework.po.echart.ChartUtil;
import com.framework.po.echart.PIEData;
import com.framework.po.echart.Pie;
import com.framework.po.echart.CLog;
import com.framework.utils.StringTools;

/**
 * 
 * 描述：EChart业务处理
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class ChartService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final ChartService instance = new ChartService();

	// 静态工厂方法
	public static ChartService getInstance() {
		return instance;
	}
	
	/**
	 * 获得登录区域数据饼图
	 * @return Pie
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Pie getLoginArea() {
		//查询数据
		List<CLog> list = ChartDAOImpl.getInstance().loadAll(CLog.class);
		//图例
		List<String> lend = new ArrayList<String>();
		//数据处理
		for (int i = 0; i < list.size(); ++i) {
			lend.add(list.get(i).getName());
		}
		//结果
		Pie pie = new Pie(lend, list);
		//返回
		return pie;
	}
	
	/**
	 * 获得访问区域数据饼图
	 * @return Pie
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Pie getViewArea() {
		//查询数据
		List<CViews> list = ChartDAOImpl.getInstance().loadAll(CViews.class);
		//图例
		List<String> lend = new ArrayList<String>();
		//数据处理
		for (int i = 0; i < list.size(); ++i) {
			lend.add(list.get(i).getName());
		}
		//结果
		Pie pie = new Pie(lend, list);
		//返回
		return pie;
	}
	
	/**
	 * 获得访问区域数据折线图
	 * @return BarAndLine
	 */
	public BarAndLine getViewBar() {
		//查询数据
		List<CViews> list = ChartDAOImpl.getInstance().loadAll(CViews.class);
		//图例
		List<String> legend = new ArrayList<String>();
		//X轴
		List<String> xAxis = new ArrayList<String>();
		//X轴数据
		List<Double> data = new ArrayList<Double>();
		//数据处理
		for (int i = 0; i < list.size(); ++i) {
			legend.add(list.get(i).getName());
			xAxis.add(list.get(i).getName());
			data.add(Double.parseDouble(list.get(i).getValue()));
		}
		//结果
		BarAndLine barAndLine = new BarAndLine(legend, xAxis, data);
		//返回
		return barAndLine;
	}
	
	/**
	 * 获得登录区域数据折线图
	 * @return BarAndLine
	 */
	public BarAndLine getLogBar() {
		//查询数据
		List<CLog> list = ChartDAOImpl.getInstance().loadAll(CLog.class);
		//图例
		List<String> legend = new ArrayList<String>();
		//X轴
		List<String> xAxis = new ArrayList<String>();
		//X轴数据
		List<Double> data = new ArrayList<Double>();
		//数据处理
		for (int i = 0; i < list.size(); ++i) {
			legend.add(list.get(i).getName());
			xAxis.add(list.get(i).getName());
			data.add(Double.parseDouble(list.get(i).getValue()));
		}
		//结果
		BarAndLine barAndLine = new BarAndLine(legend, xAxis, data);
		//返回
		return barAndLine;
	}
	
	/**
	 * 查询访问饼图数据，返回结果只包含数据，标题等属性需要获得结果后设置
	 * @param dates 日期 日期 2011-11-11
	 * @param format 格式 %Y-%m-%d
	 * @return ChartUtil
	 */
	public ChartUtil findViewPie(String dates, String format) {
		//结果
		ChartUtil chartUtil = new ChartUtil();
		//数据
		List<ChartData> chartDatas = ChartDAOImpl.getInstance().findView(dates, StringTools.makeFormat(format));
		//图例
		List<String> legend = new ArrayList<String>();
		//饼图数据
		List<PIEData> data = new ArrayList<PIEData>();
		//处理数据
		for (ChartData chartData : chartDatas) {
			//图例
			legend.add(chartData.getLegend());
			//实例
			PIEData pie = new PIEData();
			pie.setName(chartData.getLegend());
			pie.setValue(chartData.getTotal()+"");
			data.add(pie);
		}
		//构造数据
		Pie<PIEData> pie = new Pie<PIEData>();
		pie.setLegend(legend);
		pie.setData(data);
		//构造结果
		chartUtil.setObject(pie);
		//返回
		return chartUtil;
	}
	
	/**
	 * 查询访问最近一周饼图数据，返回结果只包含数据，标题等属性需要获得结果后设置
	 * @return ChartUtil
	 */
	public ChartUtil findViewPie() {
		//结果
		ChartUtil chartUtil = new ChartUtil();
		//数据
		List<ChartData> chartDatas = ChartDAOImpl.getInstance().findView();
		//图例
		List<String> legend = new ArrayList<String>();
		//饼图数据
		List<PIEData> data = new ArrayList<PIEData>();
		//处理数据
		for (ChartData chartData : chartDatas) {
			//图例
			legend.add(chartData.getLegend());
			//实例
			PIEData pie = new PIEData();
			pie.setName(chartData.getLegend());
			pie.setValue(chartData.getTotal()+"");
			data.add(pie);
		}
		//构造数据
		Pie<PIEData> pie = new Pie<PIEData>();
		pie.setLegend(legend);
		pie.setData(data);
		//构造结果
		chartUtil.setObject(pie);
		//返回
		return chartUtil;
	}
	
	/**
	 * 查询柱状图、折线图数据
	 * @param dates 日期 2011-11-11
	 * @param format 格式 %Y-%m-%d
	 * @return ChartUtil
	 */
	public ChartUtil getViewBar(String dates, String format) {
		//结果
		ChartUtil chartUtil = new ChartUtil();
		//数据
		List<ChartData> chartDatas = ChartDAOImpl.getInstance().findView(dates, StringTools.makeFormat(format));
		//图例
		List<String> lend = new ArrayList<String>();
		lend.add("用户访问量");
		//数据
		List<Integer> list2 = new ArrayList<Integer>();
		//xAxis
		List<String> list3 = new ArrayList<String>();
		//数据处理
		for (int i = 0; i < chartDatas.size(); ++i) {
			list2.add(chartDatas.get(i).getTotal());
			list3.add(chartDatas.get(i).getLegend());
		}
		//结果
		Bar bar = new Bar(lend, list2);
		bar.setxAxis(list3);
		//构造结果
		chartUtil.setObject(bar);
		//返回
		return chartUtil;
	}
	
	/**
	 * 查询最近一周柱状图、折线图数据
	 * @return ChartUtil
	 */
	public ChartUtil getViewLine() {
		//结果
		ChartUtil chartUtil = new ChartUtil();
		//数据
		List<ChartData> chartDatas = ChartDAOImpl.getInstance().findView();
		//图例
		List<String> lend = new ArrayList<String>();
		lend.add("用户访问量");
		//数据
		List<Integer> list2 = new ArrayList<Integer>();
		//xAxis
		List<String> list3 = new ArrayList<String>();
		//数据处理
		for (int i = 0; i < chartDatas.size(); ++i) {
			list2.add(chartDatas.get(i).getTotal());
			list3.add(chartDatas.get(i).getLegend());
		}
		//结果
		Bar bar = new Bar(lend, list2);
		bar.setxAxis(list3);
		//构造结果
		chartUtil.setObject(bar);
		//返回
		return chartUtil;
	}
	
	/**
	 * 查询登录饼图数据，返回结果只包含数据，标题等属性需要获得结果后设置
	 * @param dates 日期 日期 2011-11-11
	 * @param format 格式 %Y-%m-%d
	 * @return ChartUtil
	 */
	public ChartUtil findLogPie(String dates, String format) {
		//结果
		ChartUtil chartUtil = new ChartUtil();
		//数据
		List<ChartData> chartDatas = ChartDAOImpl.getInstance().findLog(dates, StringTools.makeFormat(format));
		//图例
		List<String> legend = new ArrayList<String>();
		//饼图数据
		List<PIEData> data = new ArrayList<PIEData>();
		//处理数据
		for (ChartData chartData : chartDatas) {
			//图例
			legend.add(chartData.getLegend());
			//实例
			PIEData pie = new PIEData();
			pie.setName(chartData.getLegend());
			pie.setValue(chartData.getTotal()+"");
			data.add(pie);
		}
		//构造数据
		Pie<PIEData> pie = new Pie<PIEData>();
		pie.setLegend(legend);
		pie.setData(data);
		//构造结果
		chartUtil.setObject(pie);
		//返回
		return chartUtil;
	}
	
	/**
	 * 查询访问最近一周饼图数据，返回结果只包含数据，标题等属性需要获得结果后设置
	 * @return ChartUtil
	 */
	public ChartUtil findLogPie() {
		//结果
		ChartUtil chartUtil = new ChartUtil();
		//数据
		List<ChartData> chartDatas = ChartDAOImpl.getInstance().findLog();
		//图例
		List<String> legend = new ArrayList<String>();
		//饼图数据
		List<PIEData> data = new ArrayList<PIEData>();
		//处理数据
		for (ChartData chartData : chartDatas) {
			//图例
			legend.add(chartData.getLegend());
			//实例
			PIEData pie = new PIEData();
			pie.setName(chartData.getLegend());
			pie.setValue(chartData.getTotal()+"");
			data.add(pie);
		}
		//构造数据
		Pie<PIEData> pie = new Pie<PIEData>();
		pie.setLegend(legend);
		pie.setData(data);
		//构造结果
		chartUtil.setObject(pie);
		//返回
		return chartUtil;
	}
}
