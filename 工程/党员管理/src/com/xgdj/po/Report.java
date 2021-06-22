package com.xgdj.po;

import com.framework.utils.DateUtil;

/**
 * 思想汇报
 * @author 谭长华
 * @ClassName Report.java
 * @date 2017年4月11日
 *
 */
public class Report {
	//主键
	private Integer id;
	//学号
	private String numbers;
	//姓名
	private String name;
	//第一联系人
	private String linkMan1;
	//第二联系人
	private String linkMan2;
	//审核时间
	private String createTime = DateUtil.getCurDateString(DateUtil.DATATIMEF_STR);
	//审核人
	private String operateMan;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getNumbers() {
		return numbers;
	}
	public void setNumbers(String numbers) {
		this.numbers = numbers;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLinkMan1() {
		return linkMan1;
	}
	public void setLinkMan1(String linkMan1) {
		this.linkMan1 = linkMan1;
	}
	public String getLinkMan2() {
		return linkMan2;
	}
	public void setLinkMan2(String linkMan2) {
		this.linkMan2 = linkMan2;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getOperateMan() {
		return operateMan;
	}
	public void setOperateMan(String operateMan) {
		this.operateMan = operateMan;
	}
}
