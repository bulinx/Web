package com.xgdj.action;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.action.AbstractAction;
import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.CommonService;
import com.framework.service.OperateService;
import com.framework.utils.PageResult;
import com.framework.utils.Result;
import com.xgdj.daoImpl.FoundationDAOImpl;
import com.xgdj.po.Foundation;
import com.xgdj.service.FoundationService;
import com.xgdj.utils.CreateExcelTemplate;
import com.xgdj.utils.DownloadFileUtil;

/**
 * 基础数据
 * @author 谭长华
 * @ClassName FoundationAction
 * @date 2017年3月18日
 *
 */
@SuppressWarnings("serial")
public class FoundationAction extends AbstractAction {
	// 当前页
	private int currentPage;
	//实例
	private Foundation foundation;
	//KEY
	private String key;
	//文件
  	private File file;
  	//文件名
  	private String fileFileName;
	
	/**
	 * 查询数据
	 */
	@Override
	public String execute() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = FoundationService.getInstance().searchByPage(currentPage, foundation);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		
		//参数
		request.setAttribute("obj", foundation);

		return SUCCESS;
	}
	
	/**
	 * 新增检测学号
	 * @return
	 * @throws Exception
	 */
	public void checkNum() throws Exception {
		//按用户账号name查询
		List<Foundation> list = FoundationDAOImpl.getInstance().findByProperty(Foundation.class, "number", request.getParameter("param"));
		// 返回结果
		Result result = new Result();
		//判断
		if (list.isEmpty()) {
			//没有注册，可以使用
			result.setStatus("y");
			result.setInfo("验证通过");
		} else {
			//已注册，不能使用
			result.setStatus("");
			result.setInfo("学号已存在");
		}
		//返回
		outPrint(result);
	}
	
	/**
	 * 新增数据
	 * @throws Exception
	 */
	public void save() throws Exception {
		//结果
		Result result = new Result();
		//保存
		result = FoundationService.getInstance().save(key);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "新增用户（基础）", result.getMsg());
		//返回
		outPrint(result);
	}
	
	/**
	 * 下载导入模版
	 * @throws Exception
	 */
	public void template() throws Exception {
		response.setContentType("text/html");
		response.setCharacterEncoding("utf-8");

		// 模版文件
		String path = DownloadFileUtil.getExcelTemplateFilePath(request,
				"foundation.xml", "template");
		// 导出文件名
		String filePath = DownloadFileUtil.getDownloadName(request, "template");

		// 输出流
		OutputStream toClient = new FileOutputStream(filePath);
		// 创建模版
		CreateExcelTemplate.getExcelTemplate(path, toClient);
		// 下载模版
		DownloadFileUtil.download(filePath, response);
	}
	
	/**
	 * 导入数据
	 * @throws Exception
	 */
	public void excel() throws Exception {
		//结果
		Result result = new Result();
		//执行
		result = FoundationService.getInstance().excel(file, fileFileName);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "基础数据导入", result.getMsg());
		//返回
		outPrint(result);
	}
	
	/**
	 * 删除
	 * @throws Exception
	 */
	public void delete() throws Exception {
		//结果
		Result result = new Result();
		//查询
		Foundation foundation = CommonDAOImpl.getInstance().get(Foundation.class, Integer.parseInt(key));
		//执行
		result = CommonService.getInstance().deleteById(Foundation.class, Integer.parseInt(key));
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "删除基础", result.getMsg()+key);
		//清除数据
		FoundationService.getInstance().cleanPartyUser(foundation.getNumber());
		//返回
		outPrint(result);
	}
	
	/**
	 * 查询信息
	 * @throws Exception
	 */
	public void findByID() throws Exception {
		//查询
		Foundation result = CommonDAOImpl.getInstance().get(Foundation.class, Integer.parseInt(key));
		//返回
		outPrint(result);
	}
	
	/**
	 * 我的信息
	 * @return String
	 * @throws Exception
	 */
	public String myInfo() throws Exception {
		// 按学号查询
		List<Foundation> lists = CommonDAOImpl.getInstance().findByProperty(Foundation.class, "number", user.getName());
		//判断
		if (lists.isEmpty()) {
			//错误
			return ERROR;
		} else {
			if (lists.size() == 1) {
				if (StringUtils.isNotBlank(lists.get(0).getRealName())) {
					//查看
					request.setAttribute("base", lists.get(0));
					//返回
					return "viewInfo";
				} else {
					//新增信息
					return "insertInfo";
				}
			} else {
				//错误
				return ERROR;
			}
		}
	}
	
	/**
	 * 修改我的信息
	 * @return String
	 * @throws Exception
	 */
	public String update() throws Exception {
		//修改
		Result result = FoundationService.getInstance().update(foundation);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "修改我的信息", result.getMsg()+foundation.getNumber());
		//判断
		if (result.isSuccess()) {
			//成功
			return "update";
		} else {
			//失败
			return ERROR;
		}
	}
	
	/**
	 * 查询我的信息
	 * @return String
	 * @throws Exception
	 */
	public String findForID() throws Exception {
		//查询
		Foundation foundation = CommonDAOImpl.getInstance().get(Foundation.class, Integer.parseInt(key));
		//页面数据
		request.setAttribute("obj", foundation);
		//返回
		return "findForID";
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public Foundation getFoundation() {
		return foundation;
	}

	public void setFoundation(Foundation foundation) {
		this.foundation = foundation;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

	public String getFileFileName() {
		return fileFileName;
	}

	public void setFileFileName(String fileFileName) {
		this.fileFileName = fileFileName;
	}
}
