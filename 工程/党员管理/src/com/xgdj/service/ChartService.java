package com.xgdj.service;

import java.util.ArrayList;
import java.util.List;

import com.framework.service.CommonService;
import com.xgdj.daoImpl.ChartDAOImpl;
import com.xgdj.po.ChartPIE;
import com.xgdj.po.UserState;

/**
 * 图表分析
 * @author 谭长华
 * @ClassName ChartService.java
 * @date 2017年4月25日
 *
 */
public class ChartService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final ChartService instance = new ChartService();

	// 静态工厂方法
	public static ChartService getInstance() {
		return instance;
	}
	
	/**
	 * 查询支部当前男女比例饼图
	 * @return List<ChartPIE>
	 */
	public List<ChartPIE> chartSex() {
		//结果
		List<ChartPIE> list = new ArrayList<ChartPIE>();
		//异常
		try {
			//查询数据
			list = ChartDAOImpl.getInstance().findSexPIE();
		} catch (Exception e) {
			return null;
		}
		//返回
		return list;
	}
	
	/**
	 * 支部党员构成饼图
	 * @return List<ChartPIE>
	 */
	public List<ChartPIE> chartParty() {
		//结果
		List<ChartPIE> list = new ArrayList<ChartPIE>();
		//异常
		try {
			//查询数据
			UserState state = ChartDAOImpl.getInstance().findPartyPIE();
			//处理数据
			ChartPIE pie = new ChartPIE();
			pie.setName("培养对象");
			pie.setValue(state.getApply());
			list.add(pie);
			// 实例
			ChartPIE pie1 = new ChartPIE();
			pie1.setName("积极分子");
			pie1.setValue(state.getPositive());
			list.add(pie1);
			// 实例
			ChartPIE pie2 = new ChartPIE();
			pie2.setName("预备党员");
			pie2.setValue(state.getPrepare());
			list.add(pie2);
			// 实例
			ChartPIE pie3 = new ChartPIE();
			pie3.setName("党员");
			pie3.setValue(state.getNormal());
			list.add(pie3);
			// 实例
			ChartPIE pie4 = new ChartPIE();
			pie4.setName("其他");
			pie4.setValue(state.getDevelop());
			list.add(pie4);
		} catch (Exception e) {
			return null;
		}
		//返回
		return list;
	}
}
