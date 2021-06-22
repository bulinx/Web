package com.xgdj.service;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.CommonService;
import com.framework.utils.DateUtil;
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
 * 转正申请
 * @author 谭长华
 * @ClassName NormalService.java
 * @date 2017年4月8日
 *
 */
public class NormalService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final NormalService instance = new NormalService();

	// 静态工厂方法
	public static NormalService getInstance() {
		return instance;
	}
	
	/**
	 * 验证转正申请
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
			
			//判断是否发展申请通过
			if (userState == null || userState.getPrepare() != Constant.PREP_OK) {
				//发展申请未通过，无法申请
				result.setSuccess(false);
				result.setMsg("您的发展申请未通过，无法提交转正申请");
				//返回
				return result;
			}
			
			//判断转正申请状态
			if (userState.getNormal() == Constant.NORMAL_DO) {
				//转正申请正在审核
				result.setSuccess(false);
				result.setMsg("您的转正申请正在审核");
				//返回
				return result;
			} else if (userState.getNormal() == Constant.NORMAL_OK) {
				//转正申请已通过
				result.setSuccess(false);
				result.setMsg("您的转正申请已通过，不能重复提交");
				//返回
				return result;
			}
			
			//入党信息
			PartyData partyData = CommonDAOImpl.getInstance().findUniqueByProperty(PartyData.class, "number", number);
			
			//预备期培养满一年
			int i = DateUtil.getMonth(DateUtil.getDate(partyData.getPassDate(), "yyyy-MM-dd"), new Date());
			//判断是否预备期培养满一年
			if (i < Constant.getnormalTerm()) {
				//预备期培养不满一年（12个月）
				result.setSuccess(false);
				result.setMsg("您的预备期不满"+Constant.getnormalTerm()+"个月，不能提交转正申请");
				//返回
				return result;
			}
			
			//满足所有条件
			result.setSuccess(true);
			result.setMsg("转正申请验证通过");
		} catch (Exception e) {
			e.printStackTrace();
			result.setSuccess(false);
			result.setMsg("系统异常，请联系管理员");
		}
		//返回
		return result;
	}
	
	/**
	 * 保存转正申请
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
			partyData.setPrepTrain(data.getPrepTrain());
			partyData.setNormalDate(data.getNormalDate());
			partyData.setDiscuss(data.getDiscuss());
			partyData.setNormalApproveDate(data.getNormalApproveDate());
			//执行
			int count = (int) CommonDAOImpl.getInstance().update(partyData);
			//判断
			if (count > 0) {
				//成功
				result.setSuccess(true);
				result.setMsg("转正申请已提交");
				//修改转正申请状态
				UserStateService.getInstance().updateNormal(data.getNumber(), 1);
				//发送站内信
				MsgUtil.sendNormal(data.getNumber());
			} else {
				result.setSuccess(false);
				result.setMsg("转正提交失败");
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
		if (StringUtils.isBlank(data.getPrepTrain())) {
			return false;
		}
		if (StringUtils.isBlank(data.getNormalDate())) {
			return false;
		}
		if (StringUtils.isBlank(data.getDiscuss())) {
			return false;
		}
		if (StringUtils.isBlank(data.getNormalApproveDate())) {
			return false;
		}
		//验证通过
		return true;
	}
	
	/**
	 * 查询转正申请
	 * @return PageResult
	 */
	public PageResult searchNormal() {
		//查询申请学号
		List<UserState> list = CommonDAOImpl.getInstance().findByProperty(UserState.class, "normal", Constant.NORMAL_DO);
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
	 * 修改转正申请状态
	 * @param nums 学号逗号分开
	 * @return Result
	 */
	public Result updateNormal(Integer state, String nums) {
		//结果
		Result result = new Result();
		//拆分数组
		String[] arr = nums.split(",");
		//执行修改
		int count = UserStateDAOImpl.getInstance().updatePropertyByNumber("normal", state, arr);
		//判断
		if (count > 0) {
			//成功
			result.setSuccess(true);
			result.setMsg("操作成功");
			//发送消息
			MsgUtil.sendNormal(arr, state);
		} else {
			//失败
			result.setSuccess(false);
			result.setMsg("操作失败");
		}
		//返回
		return result;
	}
}
