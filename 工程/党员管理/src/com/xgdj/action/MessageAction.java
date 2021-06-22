package com.xgdj.action;

import com.framework.action.AbstractAction;
import com.framework.utils.PageResult;
import com.xgdj.service.MessageService;

/**
 * 站内信
 * @author 谭长华
 * @ClassName MessageAction
 * @date 2017年3月18日
 *
 */
@SuppressWarnings("serial")
public class MessageAction extends AbstractAction {
	
	/**
	 * 查询消息
	 */
	@Override
	public String execute() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = MessageService.getInstance().searchByPage(currentPage, user.getId());

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		return SUCCESS;
	}
}
