package com.xgdj.dao;

import java.util.List;

import com.xgdj.po.ChartPIE;
import com.xgdj.po.UserState;

/**
 * EChart图标分析
 * @author 谭长华
 * @ClassName ChartDAO.java
 * @date 2017年4月25日
 *
 */
public interface ChartDAO {
	/**
	 * 查询支部男女比例
	 * @return List<ChartPIE>
	 */
	public List<ChartPIE> findSexPIE();
	
	/**
	 * 党员结果数据
	 * @return UserState
	 */
	public UserState findPartyPIE();
}
