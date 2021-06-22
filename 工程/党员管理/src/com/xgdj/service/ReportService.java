package com.xgdj.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.CommonService;
import com.framework.utils.Constant;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.framework.utils.Result;
import com.xgdj.daoImpl.ReportDAOImpl;
import com.xgdj.po.PartyData;
import com.xgdj.po.Report;
import com.xgdj.utils.MsgUtil;

/**
 * 思想汇报
 * @author 谭长华
 * @ClassName ReportService.java
 * @date 2017年4月11日
 *
 */
public class ReportService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final ReportService instance = new ReportService();

	// 静态工厂方法
	public static ReportService getInstance() {
		return instance;
	}
	
	/**
	 * 条件查询
	 * @param obj 参数
	 * @param currentPage 当前页 
	 * @return PageResult
	 */
	public PageResult searchByPage(Integer currentPage, Report obj) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), ReportDAOImpl.getInstance().findCount(obj), page
				.getCurrentPage());

		//查询数据
		List<Report> list = ReportDAOImpl.getInstance().findByPage(page, obj);
		
		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, list);

		return result;
	}
	
	/**
	 * 新增数据
	 * @param numbers 学号
	 * @param name 操作人
	 * @return Result
	 */
	public Result save(String numbers, String name) {
		//结果
		Result result = new Result();
		
		//数据验证
		if (StringUtils.isBlank(numbers)) {
			result.setSuccess(false);
			result.setMsg("请输入学号");
			return result;
		}
		
		//捕获异常
		try {
			//查询入党信息
			PartyData partyData = CommonDAOImpl.getInstance().findUniqueByProperty(PartyData.class, "number", numbers);
			
			//验证
			if (partyData == null) {
				result.setSuccess(false);
				result.setMsg("学号"+numbers+"不存在");
				return result;
			}
			
			
			//实例
			Report report = new Report();
			//处理信息
			report.setNumbers(numbers);
			report.setName(partyData.getName());
			report.setLinkMan1(partyData.getLinkMan1());
			report.setLinkMan2(partyData.getLinkMan2());
			report.setOperateMan(name);
			//执行
			int count = (int) CommonDAOImpl.getInstance().save(report);
			//判断
			if (count > 0) {
				//成功
				result.setSuccess(true);
				result.setMsg("新增成功");
				//发送消息
				MsgUtil.sendReport(numbers);
			} else {
				result.setSuccess(false);
				result.setMsg("新增失败");
			}
		} catch (Exception e) {
			result.setSuccess(false);
			result.setMsg("系统错误，请联系管理员");
		}
		//返回
		return result;
	}
}
