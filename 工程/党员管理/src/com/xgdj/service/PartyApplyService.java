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
import com.xgdj.po.Foundation;
import com.xgdj.po.PartyData;
import com.xgdj.po.UserState;
import com.xgdj.utils.Constant;
import com.xgdj.utils.MsgUtil;

/**
 * 入党申请
 * @author 谭长华
 * @ClassName PartyApplyService
 * @date 2017年3月18日
 *
 */
public class PartyApplyService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final PartyApplyService instance = new PartyApplyService();

	// 静态工厂方法
	public static PartyApplyService getInstance() {
		return instance;
	}
	
	/**
	 * 验证入党申请
	 * @param number 学号
	 * @return Result
	 */
	public Result checkApply(String number) {
		//结果
		Result result = new Result();
		//处理
		try {
			//查询是否申请
			PartyData partyData = CommonDAOImpl.getInstance().findUniqueByProperty(PartyData.class, "number", number);
			//判断
			if (partyData == null) {
				//没有申请，可以申请,判断年龄,查询生日
				Foundation foundation = CommonDAOImpl.getInstance().findUniqueByProperty(Foundation.class, "number", number);
				//年龄
				int age = 0;
				//计算年龄
				if (foundation != null) {
					age = DateUtil.getMonth(DateUtil.getDate(foundation.getBirthday(), "yyyy-MM-dd"), new Date()) / 12;
				}
				//判断
				if (age < 18) {
					//不满18岁
					result.setSuccess(true);
					result.setMsg("您不满18周岁，不能申请");
					result.setCode(4);
				} else {
					result.setSuccess(true);
					result.setMsg("申请入党");
					result.setCode(1);
				}
			} else {
				//已经申请，判断状态
				UserState userState = CommonDAOImpl.getInstance().findUniqueByProperty(UserState.class, "numbers", number);
				//判断
				if (userState != null && userState.getApply() == Constant.APPLY_OK) {
					//已申请并通过
					result.setSuccess(true);
					result.setMsg("入党申请已通过");
					result.setCode(2);
				} else if (userState != null && userState.getApply() == Constant.APPLY_NO) {
					//已申请，未通过
					result.setSuccess(true);
					result.setMsg("入党申请正在审核");
					result.setCode(3);
				} else {
					result.setSuccess(false);
					result.setMsg("当前状态无法申请");
				}
			}
		} catch (Exception e) {
			result.setSuccess(false);
			result.setMsg("当前状态无法申请");
		}
		//返回
		return result;
	}
	
	/**
	 * 新增记录
	 * @param obj 实例
	 * @return Result
	 */
	public Result save(PartyData obj) {
		//结果
		Result result = new Result();
		
		//数据验证
		if (StringUtils.isBlank(obj.getName())) {
			result.setSuccess(false);
			result.setMsg("请完善信息");
			return result;
		}
		
		//数据处理
		UserState userState = new UserState(obj.getNumber());
		//入党申请状态
		userState.setApply(Constant.APPLY_NO);
		//存储
		int count = (Integer) CommonDAOImpl.getInstance().save(obj);
		//判断
		if (count > 0) {
			//成功
			result.setSuccess(true);
			result.setMsg("新增成功");
			//存储状态
			CommonDAOImpl.getInstance().save(userState);
		} else {
			//失败
			result.setSuccess(false);
			result.setMsg("新增失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 查询入党申请
	 * @return PageResult
	 */
	public PageResult searchApply() {
		
		//查询申请学号
		List<UserState> list = CommonDAOImpl.getInstance().findByProperty(UserState.class, "apply", Constant.APPLY_NO);
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
	 * 修改入党申请状态
	 * @param nums 学号逗号分开
	 * @return Result
	 */
	public Result updateApply(Integer state, String nums) {
		//结果
		Result result = new Result();
		//拆分数组
		String[] arr = nums.split(",");
		//执行修改
		int count = UserStateDAOImpl.getInstance().updatePropertyByNumber("apply", state, arr);
		//判断
		if (count > 0) {
			//成功
			result.setSuccess(true);
			result.setMsg("操作成功");
			//发送消息
			MsgUtil.sendApply(arr);
		} else {
			//失败
			result.setSuccess(false);
			result.setMsg("操作失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 驳回入党申请
	 * @param nums 学号
	 * @return Result
	 */
	public Result deleteApply(String nums) {
		//结果
		Result result = new Result();
		//拆分数组
		String[] arr = nums.split(",");
		//捕获异常
		try {
			//处理数据
			for (String string : arr) {
				//删除数据
				FoundationService.getInstance().cleanPartyUser(string);
			}
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
	 * 条件查询
	 * @param obj 参数
	 * @param currentPage 当前页 
	 * @return PageResult
	 */
	public PageResult searchByPage(Integer currentPage, PartyData obj) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(com.framework.utils.Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), PartyDataDAOImpl.getInstance().findCount(obj), page
				.getCurrentPage());

		//查询数据
		List<PartyData> list = PartyDataDAOImpl.getInstance().findByPage(page, obj);
		
		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, list);

		return result;
	}
}
