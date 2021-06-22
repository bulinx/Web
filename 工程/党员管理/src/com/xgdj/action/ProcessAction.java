package com.xgdj.action;

import java.util.List;

import com.framework.action.AbstractAction;
import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.CommonService;
import com.framework.utils.Result;
import com.xgdj.po.Process;

/**
 * 入党流程
 * @author 谭长华
 * @ClassName ProcessAction
 * @date 2017年3月20日
 *
 */
@SuppressWarnings("serial")
public class ProcessAction extends AbstractAction {
	
	//KYE
	private String key;
	//实例
	private Process process;

	/**
	 * 初始化
	 */
	@Override
	public String execute() throws Exception {
		//查询所有
		List<Process> list = CommonDAOImpl.getInstance().loadAll(Process.class);
		//页面数据
		request.setAttribute("lists", list);
		//返回
		return SUCCESS;
	}
	
	/**
	 * 查询
	 */
	public void findById() throws Exception {
		//查询
		Process process = CommonDAOImpl.getInstance().get(Process.class, Integer.parseInt(key));
		//返回
		outPrint(process);
	}
	
	/**
	 * 更新记录
	 */
	public void update() throws Exception {
		//执行
		Result result = CommonService.getInstance().update(process);
		//返回
		outPrint(result);
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Process getProcess() {
		return process;
	}

	public void setProcess(Process process) {
		this.process = process;
	}
}
