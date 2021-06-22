package com.xgdj.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.dao.impl.UserDAOImpl;
import com.framework.po.Role;
import com.framework.po.User;
import com.framework.service.CommonService;
import com.framework.service.OperateService;
import com.framework.utils.Constant;
import com.framework.utils.ExcelUtil;
import com.framework.utils.Md5Util;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.framework.utils.Result;
import com.framework.utils.StringTools;
import com.xgdj.daoImpl.FoundationDAOImpl;
import com.xgdj.daoImpl.ReportDAOImpl;
import com.xgdj.po.Foundation;
import com.xgdj.po.PartyData;
import com.xgdj.po.UserState;
import com.xgdj.utils.MsgUtil;

/**
 * 基础数据
 * @author 谭长华
 * @ClassName FoundationService
 * @date 2017年3月18日
 *
 */
public class FoundationService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final FoundationService instance = new FoundationService();

	// 静态工厂方法
	public static FoundationService getInstance() {
		return instance;
	}
	
	/**
	 * 条件查询
	 * @param obj 参数
	 * @param currentPage 当前页 
	 * @return PageResult
	 */
	public PageResult searchByPage(Integer currentPage, Foundation obj) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), FoundationDAOImpl.getInstance().findCount(obj), page
				.getCurrentPage());

		//查询数据
		List<Foundation> list = FoundationDAOImpl.getInstance().findByPage(page, obj);
		
		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, list);

		return result;
	}
	
	/**
	 * 新增记录
	 * @param obj 实例
	 * @return Result
	 */
	public Result save(String number) {
		//结果
		Result result = new Result();
		//实例
		Foundation obj = new Foundation();
		//账号
		obj.setName(number);
		//密码默认学号
		obj.setPass(Md5Util.encode(number));
		//查询角色
		Role role = CommonDAOImpl.getInstance().get(Role.class, com.xgdj.utils.Constant.COMMOM_ROLE);
		//设置角色
		obj.setRole(role);
		//学号
		obj.setNumber(number);
		//存储
		int count = (Integer) CommonDAOImpl.getInstance().save(obj);
		//判断
		if (count > 0) {
			//成功
			result.setSuccess(true);
			result.setMsg("新增成功");
			//发送消息
			MsgUtil.sendNewUser(count);
		} else {
			//失败
			result.setSuccess(false);
			result.setMsg("新增失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 导入模板数据
	 * @param file 文件
	 * @param fileName 文件名
	 * @return Result
	 */
	public Result excel(File file, String fileName) {
		//结果
		Result result = new Result();
		//处理
		try {
			//java流
			FileInputStream fileInputStream = new FileInputStream(file);
			// 创建excel工具类
			ExcelUtil<Foundation> util = new ExcelUtil<Foundation>(Foundation.class);
			//读取数据
			List<Foundation> list = util.importExcel("sheet0", 2, fileInputStream);
			//存储
			boolean bn = batchSave(list);
			//判断
			if (!bn) {
				//学号重复，导入失败
				result.setSuccess(false);
				result.setMsg("存在学号重复，导入失败");
			} else {
				//结果，导入成功
				result.setSuccess(true);
				result.setMsg("导入成功");
				//发送消息
				MsgUtil.sendNewUser(list);
			}
		} catch (IOException e) {
			result.setSuccess(false);
			result.setMsg("数据读取失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 批量存储导入数据
	 * @param list 数据
	 */
	private boolean batchSave(List<Foundation> list) {
		//获得淡入值
		String[] arr = new String[list.size()];
		//处理
		for (int i = 0; i < list.size(); ++i) {
			arr[i] = list.get(i).getNumber();
		}
		//验证数据是否存在重复学号
		if (!StringTools.checkStrArrRepeat(arr)) {
			//有重复
			return false;
		}
		//验证数据库是否重复
		List<Foundation> temp = FoundationDAOImpl.getInstance().findInNumber(arr);
		//判断
		if (!temp.isEmpty()) {
			//有学号存在
			return false;
		}
		//验证通过，处理数据
		for (int i = 0; i < list.size(); ++i) {
			//账号
			list.get(i).setName(list.get(i).getNumber());
			//密码默认学号
			list.get(i).setPass(Md5Util.encode(list.get(i).getNumber()));
			//查询角色
			Role role = CommonDAOImpl.getInstance().get(Role.class, com.xgdj.utils.Constant.COMMOM_ROLE);
			//设置角色
			list.get(i).setRole(role);
		}
		//存储
		CommonDAOImpl.getInstance().batchSave(list);
		//返回结果
		return true;
	}
	
	/**
	 * 修改
	 * @param foundation 实例
	 * @return Result
	 */
	public Result update(Foundation foundation) {
		//结果
		Result result = new Result();
		//处理
		try {
			//查询
			Foundation foundation2 = CommonDAOImpl.getInstance().findUniqueByProperty(Foundation.class, "number", foundation.getNumber());
			//设置ID
			foundation.setId(foundation2.getId());
			//账号
			foundation.setName(foundation2.getName());
			//密码默认学号
			foundation.setPass(foundation2.getPass());
			//设置角色
			foundation.setRole(foundation2.getRole());
			foundation.setState(foundation2.getState());
			//执行更新
			CommonDAOImpl.getInstance().update(foundation);
			//结果
			result.setSuccess(true);
			result.setMsg("操作成功");
		} catch (Exception e) {
			result.setSuccess(false);
			result.setMsg("操作失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 清除用户信息，在系统中所有数据全部清除，入党申请时删除
	 * @param number 学号
	 * @return Result
	 */
	public Result cleanPartyUser(String number) {
		//结果
		Result result = new Result();
		//日志
		OperateService.getInstance().saveOperateLog("清除用户数据", "删除按学号", number);		
		//捕获异常
		try {
			//查询登录账号
			List<User> list = UserDAOImpl.getInstance().findByProperty(User.class, "name", number);
			//删除登录账号
			CommonDAOImpl.getInstance().deleteAllEntitie(list);
			//日志
			OperateService.getInstance().saveOperateLog("清除用户数据", "删除账号", number);
			//查询基础数据
			List<Foundation> list2 = CommonDAOImpl.getInstance().findByProperty(Foundation.class, "number", number);
			//删除基础数据
			CommonDAOImpl.getInstance().deleteAllEntitie(list2);
			//日志
			OperateService.getInstance().saveOperateLog("清除用户数据", "删除基础数据", number);
			//查询入党数据
			List<PartyData> list3 = CommonDAOImpl.getInstance().findByProperty(PartyData.class, "number", number);
			//删除数据
			CommonDAOImpl.getInstance().deleteAllEntitie(list3);
			//日志
			OperateService.getInstance().saveOperateLog("清除用户数据", "删除入党数据", number);
			//查询用户状态
			List<UserState> list4 = CommonDAOImpl.getInstance().findByProperty(UserState.class, "numbers", number);
			//删除数据
			CommonDAOImpl.getInstance().deleteAllEntitie(list4);
			//删除思想汇报
			int i = ReportDAOImpl.getInstance().deleteByNumber(number);
			//日志
			OperateService.getInstance().saveOperateLog("清除用户数据", "删除用户状态", number+i);
			//结果
			result.setSuccess(true);
			result.setMsg("用户"+number+"已删除");
		} catch (Exception e) {
			result.setSuccess(false);
			result.setMsg("删除失败"+number);
		}
		//返回
		return result;
	}
}
