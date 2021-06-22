package com.xgdj.utils;

import java.sql.Timestamp;

import com.framework.utils.DateUtil;
import com.framework.utils.ExcelVOAttribute;

/**
 * 入党信息
 * @author 谭长华
 * @ClassName PartyData
 * @date 2017年3月18日
 *
 */
public class PartyData1 {
	//主键
	private Integer id;
	//学号
	@ExcelVOAttribute(name = "001", column = "A", isExport = true)
	private String number;
	//单位
	@ExcelVOAttribute(name = "001", column = "B", isExport = true)
	private String company;
	//姓名
	@ExcelVOAttribute(name = "001", column = "C", isExport = true)
	private String name;
	//身份证号
	@ExcelVOAttribute(name = "001", column = "D", isExport = true)
	private String idCard;
	//性别
	@ExcelVOAttribute(name = "001", column = "E", isExport = true)
	private String sex;
	//民族
	@ExcelVOAttribute(name = "001", column = "F", isExport = true)
	private String nation;
	//出生日期
	@ExcelVOAttribute(name = "001", column = "G", isExport = true)
	private String birthday;
	//文化程度
	@ExcelVOAttribute(name = "001", column = "H", isExport = true)
	private String culture;
	//职业
	@ExcelVOAttribute(name = "001", column = "I", isExport = true)
	private String job;
	//申请入党时间
	@ExcelVOAttribute(name = "001", column = "J", isExport = true)
	private String partyDate;
	//列入考察时间
	@ExcelVOAttribute(name = "001", column = "K", isExport = true)
	private String viewDate;
	//是否党校毕业
	@ExcelVOAttribute(name = "001", column = "L", isExport = true)
	private String partySchool;
	//是否团员
	@ExcelVOAttribute(name = "001", column = "M", isExport = true)
	private String youth;
	//操作时间
	private Timestamp createTime = DateUtil.getSqlTimestamp();
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public String getIdCard() {
		return idCard;
	}
	public void setIdCard(String idCard) {
		this.idCard = idCard;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getNation() {
		return nation;
	}
	public void setNation(String nation) {
		this.nation = nation;
	}
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	public String getCulture() {
		return culture;
	}
	public void setCulture(String culture) {
		this.culture = culture;
	}
	public String getJob() {
		return job;
	}
	public void setJob(String job) {
		this.job = job;
	}
	public String getPartyDate() {
		return partyDate;
	}
	public void setPartyDate(String partyDate) {
		this.partyDate = partyDate;
	}
	public String getViewDate() {
		return viewDate;
	}
	public void setViewDate(String viewDate) {
		this.viewDate = viewDate;
	}
	public String getPartySchool() {
		return partySchool;
	}
	public void setPartySchool(String partySchool) {
		this.partySchool = partySchool;
	}
	public String getYouth() {
		return youth;
	}
	public void setYouth(String youth) {
		this.youth = youth;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
}
