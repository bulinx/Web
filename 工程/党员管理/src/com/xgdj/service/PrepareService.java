package com.xgdj.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.CommonService;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.framework.utils.Result;
import com.xgdj.daoImpl.PartyDataDAOImpl;
import com.xgdj.daoImpl.UserStateDAOImpl;
import com.xgdj.po.PartyData;
import com.xgdj.po.UserState;
import com.xgdj.utils.Constant;
import com.xgdj.utils.MsgUtil;

/**
 * 预备党员
 * @author 谭长华
 * @ClassName Prepare.java
 * @date 2017年4月5日
 *
 */
public class PrepareService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final PrepareService instance = new PrepareService();

	// 静态工厂方法
	public static PrepareService getInstance() {
		return instance;
	}
	
	/**
	 * 验证发展申请
	 * @param number 学号
	 * @return Result
	 */
	public Result check(String number) {
		//结果
		Result result = new Result();
		//捕获异常
		try {
			//查询入党状态
			UserState userState = CommonDAOImpl.getInstance().findUniqueByProperty(UserState.class, "numbers", number);
			
			//判断是否拟发展申请通过
			if (userState == null || userState.getDevelop() != Constant.DEVELOP_OK) {
				//拟发展申请未通过，无法申请
				result.setSuccess(false);
				result.setMsg("您的拟发展申请未通过，无法提交发展申请");
				//返回
				return result;
			}
			
			//判断发展申请状态
			if (userState.getPrepare() == Constant.PREP_DO) {
				//发展申请正在审核
				result.setSuccess(false);
				result.setMsg("您的发展申请正在审核");
				//返回
				return result;
			} else if (userState.getPrepare() == Constant.PREP_OK) {
				//发展申请已通过
				result.setSuccess(false);
				result.setMsg("您的发展申请已通过，不能重复提交");
				//返回
				return result;
			}
			
			//满足所有条件
			result.setSuccess(true);
			result.setMsg("发展申请验证通过");
		} catch (Exception e) {
			e.printStackTrace();
			result.setSuccess(false);
			result.setMsg("系统异常，请联系管理员");
		}
		//返回
		return result;
	}
	
	/**
	 * 保存发展申请
	 * @param data 实例
	 * @return Result
	 */
	public Result update(PartyData data) {
		//结果
		Result result = new Result();
		
		//数据验证
		if (!checkData(data)) {
			result.setSuccess(false);
			result.setMsg("请完善信息");
			return result;
		}
		
		//捕获异常
		try {
			//查询入党信息
			PartyData partyData = CommonDAOImpl.getInstance().findUniqueByProperty(PartyData.class, "number", data.getNumber());
			//处理信息
			partyData.setPassDate(data.getPassDate());
			partyData.setApproveDate(data.getApproveDate());
			partyData.setVolunteer(data.getVolunteer());
			//执行
			int count = (int) CommonDAOImpl.getInstance().update(partyData);
			//判断
			if (count > 0) {
				//成功
				result.setSuccess(true);
				result.setMsg("发展申请已提交");
				//修改发展申请状态
				UserStateService.getInstance().updatePrepare(data.getNumber(), 1);
				//发送站内信
				MsgUtil.sendPrepare(data.getNumber());
			} else {
				result.setSuccess(false);
				result.setMsg("发展提交失败");
			}
		} catch (Exception e) {
			result.setSuccess(false);
			result.setMsg("系统错误，请联系管理员");
		}
		//返回
		return result;
	}
	
	/**
	 * 数据空验证
	 * @param data 数据
	 * @return boolean
	 */
	public boolean checkData(PartyData data) {
		if (StringUtils.isBlank(data.getNumber())) {
			return false;
		}
		if (StringUtils.isBlank(data.getPassDate())) {
			return false;
		}
		if (StringUtils.isBlank(data.getApproveDate())) {
			return false;
		}
		if (StringUtils.isBlank(data.getVolunteer())) {
			return false;
		}
		//验证通过
		return true;
	}
	
	/**
	 * 查询发展申请
	 * @return PageResult
	 */
	public PageResult searchPrepare() {
		//查询申请学号
		List<UserState> list = CommonDAOImpl.getInstance().findByProperty(UserState.class, "prepare", Constant.PREP_DO);
		//获得数组
		String[] arr = new String[list.size()];
		for (int i = 0; i < arr.length; ++i) {
			arr[i] = list.get(i).getNumbers();
		}
		//查询入党申请数据
		List<PartyData> list2 = PartyDataDAOImpl.getInstance().findInNumber(arr);
		
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(list2.size());
		// 设置当前页
		page.setCurrentPage(1);
		
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), list2.size(), page
				.getCurrentPage());
		
		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, list2);

		return result;
	}
	
	/**
	 * 修改发展申请状态
	 * @param nums 学号逗号分开
	 * @return Result
	 */
	public Result updatePrepare(Integer state, String nums) {
		//结果
		Result result = new Result();
		//拆分数组
		String[] arr = nums.split(",");
		//执行修改
		int count = UserStateDAOImpl.getInstance().updatePropertyByNumber("prepare", state, arr);
		//判断
		if (count > 0) {
			//成功
			result.setSuccess(true);
			result.setMsg("操作成功");
			//发送消息
			MsgUtil.sendPrepare(arr, state);
		} else {
			//失败
			result.setSuccess(false);
			result.setMsg("操作失败");
		}
		//返回
		return result;
	}
}
