package com.xgdj.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.framework.action.AbstractAction;
import com.xgdj.po.ChartPIE;
import com.xgdj.service.ChartService;

/**
 * 图表分析
 * @author 谭长华
 * @ClassName ChartAction.java
 * @date 2017年4月25日
 *
 */
@SuppressWarnings("serial")
public class ChartAction extends AbstractAction {
	
	/**
	 * 男女比例
	 * @throws Exception
	 */
	public void sex() throws Exception {
		//结果
		Map<String, Object> map = new HashMap<String, Object>();
		//查询男女比例
		List<ChartPIE> list = ChartService.getInstance().chartSex();
		//男女比例
		map.put("sex", list);
		//支部结构
		List<ChartPIE> list1 = ChartService.getInstance().chartParty();
		map.put("party", list1);
		//返回
		outPrint(map);
	}
	
}
