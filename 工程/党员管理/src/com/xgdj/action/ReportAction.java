package com.xgdj.action;

import java.util.List;

import com.framework.action.AbstractAction;
import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.OperateService;
import com.framework.utils.PageResult;
import com.framework.utils.Result;
import com.xgdj.po.Report;
import com.xgdj.service.ReportService;

/**
 * 思想汇报
 * @author 谭长华
 * @ClassName ReportAction.java
 * @date 2017年4月11日
 *
 */
@SuppressWarnings("serial")
public class ReportAction extends AbstractAction {
	
	//实例
	private Report obj;
	//KEY
	private String key;
	
	/**
	 * 查询数据
	 */
	@Override
	public String execute() throws Exception {
		// 查询
		PageResult pageResult = ReportService.getInstance().searchByPage(currentPage, obj);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		
		//参数
		request.setAttribute("obj", obj);

		return SUCCESS;
	}
	
	/**
	 * 按学号查询记录
	 * @return String
	 * @throws Exception
	 */
	public String findByNum() throws Exception {
		// 查询
		List<Report> lists = CommonDAOImpl.getInstance().findByProperty(Report.class, "numbers",user.getName());

		// 页面数据
		request.setAttribute("lists", lists);

		return "findByNum";
	}
	
	/**
	 * 新增数据
	 * @throws Exception
	 */
	public void save() throws Exception {
		//结果
		Result result = new Result();
		//保存
		result = ReportService.getInstance().save(key, user.getName());
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "新增思想汇报", result.getMsg()+key);
		//返回
		outPrint(result);
	}
	
	/**
	 * 删除数据
	 * @throws Exception
	 */
	public void delete() throws Exception {
		//结果
		Result result = new Result();
		//保存
		result = ReportService.getInstance().deleteById(Report.class, Integer.parseInt(key));
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "删除思想汇报", result.getMsg()+key);
		//返回
		outPrint(result);
	}

	public Report getObj() {
		return obj;
	}

	public void setObj(Report obj) {
		this.obj = obj;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
}
