package com.xgdj.po;

/**
 * 用户状态
 * @author 谭长华
 * @ClassName UserState
 * @date 2017年3月18日
 *
 */
public class UserState {
	//主键
	private Integer id;
	//学号
	private String numbers;
	//入党申请(0-未通过，1-通过)
	private Integer apply = 0;
	//积极分子申请(0-未通过，1-提交审核，2-通过)
	private Integer positive = 0;
	//拟发展申请(0-未通过，1-提交审核，2-通过)
	private Integer develop = 0;
	//发展申请(0-未通过，1-提交审核，2-通过)
	private Integer prepare = 0;
	//转正申请(0-未通过，1-提交审核，2-通过)
	private Integer normal = 0;
	//用户状态（0-有效，1-无效）
	private Integer state = 0;
	public UserState() {
		super();
	}
	public UserState(String numbers) {
		super();
		this.numbers = numbers;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getApply() {
		return apply;
	}
	public void setApply(Integer apply) {
		this.apply = apply;
	}
	public String getNumbers() {
		return numbers;
	}
	public void setNumbers(String numbers) {
		this.numbers = numbers;
	}
	public Integer getPositive() {
		return positive;
	}
	public void setPositive(Integer positive) {
		this.positive = positive;
	}
	public Integer getDevelop() {
		return develop;
	}
	public void setDevelop(Integer develop) {
		this.develop = develop;
	}
	public Integer getPrepare() {
		return prepare;
	}
	public void setPrepare(Integer prepare) {
		this.prepare = prepare;
	}
	public Integer getNormal() {
		return normal;
	}
	public void setNormal(Integer normal) {
		this.normal = normal;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}
}
