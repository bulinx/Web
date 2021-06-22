package com.framework.action;

import com.framework.po.OperateLog;
import com.framework.service.OperateService;
import com.framework.utils.PageResult;

/**
 * 
 * 描述：操作日志业务逻辑
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class OperateAction extends AbstractAction {
	// 当前页
	private int currentPage;
	//实例
	private OperateLog log;
	// 开始时间
	private String start;
	// 结束时间
	private String end;
	
	/**
	 * 分页查询
	 */
	@Override
	public String execute() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = OperateService.getInstance().getListByPage(OperateLog.class, currentPage);

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
		PageResult pageResult = OperateService.getInstance().searchLog(currentPage, log, start, end);

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
	public OperateLog getLog() {
		return log;
	}
	public void setLog(OperateLog log) {
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
