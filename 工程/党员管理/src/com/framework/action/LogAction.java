package com.framework.action;

import com.framework.po.Log;
import com.framework.service.LogService;
import com.framework.utils.PageResult;

/**
 * 
 * 描述：登录日志业务逻辑
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class LogAction extends AbstractAction {
	// 当前页
	private int currentPage;
	//实例
	private Log log;
	// 开始时间
	private String start;
	// 结束时间
	private String end;

	/**
	 * 分页查询所有日志
	 */
	@Override
	public String execute() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = LogService.getInstance().getListByPage(Log.class, currentPage);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		return SUCCESS;
	}
	
	/**
	 * 条件查询
	 * @return
	 * @throws Exception
	 */
	public String search() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = LogService.getInstance().searchLog(currentPage, log, start, end);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		//查询参数
		request.setAttribute("start", start);
		request.setAttribute("end", end);
		request.setAttribute("log", log);
		
		return "search";
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public Log getLog() {
		return log;
	}

	public void setLog(Log log) {
		this.log = log;
	}

	public String getStart() {
		return start;
	}

	public void setStart(String start) {
		this.start = start;
	}

	public String getEnd() {
		return end;
	}

	public void setEnd(String end) {
		this.end = end;
	}
}
