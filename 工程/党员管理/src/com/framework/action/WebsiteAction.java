package com.framework.action;

import com.framework.dao.impl.WebsiteDAOImpl;
import com.framework.po.Website;
import com.framework.utils.Result;
import com.google.gson.Gson;

/**
 * 
 * 描述：网站基本信息业务逻辑
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class WebsiteAction extends AbstractAction {
	//实例
	private Website website;

	@Override
	public String execute() throws Exception {
		// 返回结果
		Result result = new Result();
		
		//备份标志
		website.setFlag((byte) 1);
		// 修改
		int count = (Integer) WebsiteDAOImpl.getInstance().update(website);
		
		//判断
		if (count > 0) {
			result.setSuccess(true);
			result.setMsg("修改成功，重启服务生效");
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
		}
		
		// gson
		Gson gson = new Gson();
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	public Website getWebsite() {
		return website;
	}
	public void setWebsite(Website website) {
		this.website = website;
	}
}
