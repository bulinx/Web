package com.framework.action;

import com.framework.dao.impl.InfomationDAOImpl;
import com.framework.po.Infomation;
import com.framework.service.InfomationService;
import com.framework.service.OperateService;
import com.framework.utils.DateUtil;
import com.framework.utils.PageResult;

/**
 * 
 * 描述：文档逻辑
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class InfomationAction extends AbstractAction {
	
	// 当前页
	private int currentPage;
	//实例
	private Infomation infomation;
	//key
	private Integer id;
	
	/**
	 * 分页查询所有记录
	 */
	@Override
	public String execute() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = InfomationService.getInstance().getListByPage(Infomation.class, currentPage);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		return SUCCESS;
	}
	
	/**
	 * 新增
	 * @return
	 * @throws Exception
	 */
	public String save() throws Exception {
		//发布人
		infomation.setPublishMan(user.getName());
		//保存
		int count = (Integer) InfomationDAOImpl.getInstance().save(infomation);
		//判断
		if (count >= 0) {
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "新增开发文档", "成功ID:"+count);
			//成功
			return "save";
		} else {
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "新增开发文档", "成功ID:"+count);
			//失败
			request.setAttribute("tip", "保存失败");
			return ERROR;
		}
	}
	
	/**
	 * 查看
	 * @return
	 * @throws Exception
	 */
	public String view() throws Exception {
		//查询
		Infomation infomation = InfomationDAOImpl.getInstance().get(Infomation.class, id);
		//返回
		request.setAttribute("infomation", infomation);
		return "view";
	}
	
	/**
	 * 查看
	 * @return
	 * @throws Exception
	 */
	public String goView() throws Exception {
		//查询
		Infomation infomation = InfomationDAOImpl.getInstance().get(Infomation.class, id);
		//返回
		request.setAttribute("infoma", infomation);
		return "goView";
	}
	
	/**
	 * 编辑
	 * @return
	 * @throws Exception
	 */
	public String doEdit() throws Exception {
		//查询
		Infomation infomation1 = InfomationDAOImpl.getInstance().get(Infomation.class, infomation.getId());
		//修改数据
		infomation1.setTitle(infomation.getTitle());
		infomation1.setSummary(infomation.getSummary());
		infomation1.setContent(infomation.getContent());
		infomation1.setPublishTime(DateUtil.getSqlTimestamp());
		infomation1.setFlag((byte) 1);
		//执行修改
		int count = (Integer) InfomationDAOImpl.getInstance().update(infomation1);
		//判断
		if (count >= 0) {
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改开发文档", "成功ID:"+infomation1.getId());
			//成功
			return "save";
		} else {
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改开发文档", "失败ID:"+infomation1.getId());
			//失败
			request.setAttribute("tip", "操作失败");
			return ERROR;
		}	
	}
	
	/**
	 * 删除
	 * @return
	 * @throws Exception
	 */
	public String delete() throws Exception {
		//查询
		Infomation infomation = InfomationDAOImpl.getInstance().get(Infomation.class, id);
		//执行
		int count = InfomationDAOImpl.getInstance().delete(infomation);
		//判断
		if (count >= 0) {
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "删除开发文档", "成功ID:"+infomation.getId());
			//成功
			return "save";
		} else {
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "删除开发文档", "失败ID:"+infomation.getId());
			//失败
			request.setAttribute("tip", "操作失败");
			return ERROR;
		}
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public Infomation getInfomation() {
		return infomation;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setInfomation(Infomation infomation) {
		this.infomation = infomation;
	}
}
