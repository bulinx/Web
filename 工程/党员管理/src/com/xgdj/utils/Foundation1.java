package com.xgdj.utils;

import java.sql.Timestamp;

import com.framework.po.User;
import com.framework.utils.DateUtil;
import com.framework.utils.ExcelVOAttribute;

/**
 * 基础数据
 * @author 谭长华
 * @ClassName Foundation
 * @date 2017年3月17日
 *
 */
@SuppressWarnings("serial")
public class Foundation1 extends User {
	//001
	@ExcelVOAttribute(name = "001", column = "P", isExport = true)
	private String number;
	//姓名
	@ExcelVOAttribute(name = "001", column = "B", isExport = true)
	private String realName;
	//出生日期
	@ExcelVOAttribute(name = "001", column = "C", isExport = true)
	private String birthday;
	//性别
	@ExcelVOAttribute(name = "001", column = "D", isExport = true)
	private String sex;
	//身份号
	@ExcelVOAttribute(name = "001", column = "E", isExport = true)
	private String idCard;
	//生源地
	@ExcelVOAttribute(name = "001", column = "F", isExport = true)
	private String source;
	//籍贯
	@ExcelVOAttribute(name = "001", column = "G", isExport = true)
	private String nation;
	//通信地址
	@ExcelVOAttribute(name = "001", column = "H", isExport = true)
	private String address;
	//高考准考证号
	@ExcelVOAttribute(name = "001", column = "I", isExport = true)
	private String ticket;
	//政治面貌
	@ExcelVOAttribute(name = "001", column = "J", isExport = true)
	private String identity;
	//入学时间
	@ExcelVOAttribute(name = "001", column = "K", isExport = true)
	private String admission;
	//宿舍号
	@ExcelVOAttribute(name = "001", column = "L", isExport = true)
	private String dormitory;
	//手机号
	@ExcelVOAttribute(name = "001", column = "M", isExport = true)
	private String phone;
	//邮箱
	@ExcelVOAttribute(name = "001", column = "N", isExport = true)
	private String email;
	//QQ号
	@ExcelVOAttribute(name = "001", column = "O", isExport = true)
	private String qq;
	//操作时间
	private Timestamp operateTime = DateUtil.getSqlTimestamp();
	//班级
	@ExcelVOAttribute(name = "001", column = "A", isExport = true)
	private String classes;
	//入学年份
	@ExcelVOAttribute(name = "001", column = "A", isExport = true)
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
	public Timestamp getOperateTime() {
		return operateTime;
	}
	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}
}
