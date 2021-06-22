package com.framework.service;

import java.util.List;

import com.framework.dao.impl.OperateDAOImpl;
import com.framework.po.OperateLog;
import com.framework.utils.Constant;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;

/**
 * 
 * 描述：操作日志业务处理
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class OperateService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final OperateService instance = new OperateService();

	// 静态工厂方法
	public static OperateService getInstance() {
		return instance;
	}
	
	/**
	 * 保存操作日志
	 * @param name 操作人
	 * @param keywords 操作类型
	 * @param content 备注，说明
	 */
	public void saveOperateLog(String name, String keywords, String content) {
		//实例
		OperateLog operateLog = new OperateLog(name, content, keywords);
		//保存
		OperateDAOImpl.getInstance().save(operateLog);
	}
	
	/**
	 * 条件查询所有记录
	 * @param currentPage 当前页
	 * @param log 实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return PageResult
	 */
	public PageResult searchLog(int currentPage, OperateLog log, String start, String end) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), OperateDAOImpl.getInstance().findOperateLogCount(log, start, end), page
				.getCurrentPage());

		// 查询
		List<OperateLog> lists = OperateDAOImpl.getInstance().findOperateLogByPage(page, log, start, end);

		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, lists);

		return result;
	}
}
