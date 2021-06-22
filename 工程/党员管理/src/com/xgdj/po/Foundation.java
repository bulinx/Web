package com.xgdj.po;

import com.framework.po.User;
import com.framework.utils.ExcelVOAttribute;

/**
 * 基础数据
 * @author 谭长华
 * @ClassName Foundation
 * @date 2017年3月17日
 *
 */
@SuppressWarnings("serial")
public class Foundation extends User {
	//学号
	@ExcelVOAttribute(name = "学号", column = "A", isExport = true)
	private String number;
	//姓名
	private String realName;
	//出生日期
	private String birthday;
	//性别
	private String sex;
	//身份号
	private String idCard;
	//生源地
	private String source;
	//籍贯
	private String nation;
	//通信地址
	private String address;
	//高考准考证号
	private String ticket;
	//政治面貌
	private String identity;
	//入学时间
	private String admission;
	//宿舍号
	private String dormitory;
	//手机号
	private String phone;
	//邮箱
	private String email;
	//QQ号
	private String qq;
	//操作时间
	private String operateTime;
	//班级
	private String classes;
	//入学年份
	private String schoolYear;
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public String getRealName() {
		return realName;
	}
	public void setRealName(String realName) {
		this.realName = realName;
	}
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getIdCard() {
		return idCard;
	}
	public void setIdCard(String idCard) {
		this.idCard = idCard;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getNation() {
		return nation;
	}
	public void setNation(String nation) {
		this.nation = nation;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getTicket() {
		return ticket;
	}
	public void setTicket(String ticket) {
		this.ticket = ticket;
	}
	public String getIdentity() {
		return identity;
	}
	public void setIdentity(String identity) {
		this.identity = identity;
	}
	public String getAdmission() {
		return admission;
	}
	public void setAdmission(String admission) {
		this.admission = admission;
	}
	public String getDormitory() {
		return dormitory;
	}
	public void setDormitory(String dormitory) {
		this.dormitory = dormitory;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getQq() {
		return qq;
	}
	public void setQq(String qq) {
		this.qq = qq;
	}
	public String getClasses() {
		return classes;
	}
	public void setClasses(String classes) {
		this.classes = classes;
	}
	public String getSchoolYear() {
		return schoolYear;
	}
	public void setSchoolYear(String schoolYear) {
		this.schoolYear = schoolYear;
	}
	public String getOperateTime() {
		return operateTime;
	}
	public void setOperateTime(String operateTime) {
		this.operateTime = operateTime;
	}
}
