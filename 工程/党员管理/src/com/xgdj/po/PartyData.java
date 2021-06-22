package com.xgdj.po;

import java.sql.Timestamp;

import com.framework.utils.DateUtil;

/**
 * 入党信息
 * @author 谭长华
 * @ClassName PartyData
 * @date 2017年3月18日
 *
 */
public class PartyData {
	//主键
	private Integer id;
	//学号
	private String number;
	//姓名
	private String name;
	//单位
	private String company;
	//身份证号
	private String idCard;
	//性别
	private String sex;
	//民族
	private String nation;
	//出生日期
	private String birthday;
	//文化程度（学历）
	private String culture;
	//职业
	private String job;
	//申请入党时间
	private String partyDate;
	//列入考察时间
	private String viewDate;
	//是否党校毕业
	private String partySchool;
	//是否团员
	private String youth;
	//操作时间
	private Timestamp createTime = DateUtil.getSqlTimestamp();
	/*------------积极分子-----------------*/
	//学位或职称
	private String degree;
	//单位职务或职业
	private String duty;
	//列为积极分子时间
	private String positiveDate;
	//公示起止时间
	private String positivePublic;
	//推荐或推优方式
	private String promote;
	//第一联系人
	private String linkMan1;
	//第二联系人
	private String linkMan2;
	//籍贯
	private String region;
	//用户状态（0-有效，1-无效）
	private Integer state = 0;
	/*------------拟发展-----------------*/
	//受表彰情况
	private String honor;
	//发展对象培训情况
	private String train;
	/*------------发展-----------------*/
	//支部通过时间
	private String passDate;
	//分党委审批时间
	private String approveDate;
	//志愿书编号
	private String volunteer;
	/*------------转正-----------------*/
	//预备党员培训情况
	private String prepTrain;
	//转正时间
	private String normalDate;
	//讨论意见
	private String discuss;
	//分党委审批时间
	private String normalApproveDate;
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
	public String getDegree() {
		return degree;
	}
	public void setDegree(String degree) {
		this.degree = degree;
	}
	public String getDuty() {
		return duty;
	}
	public void setDuty(String duty) {
		this.duty = duty;
	}
	public String getPositiveDate() {
		return positiveDate;
	}
	public void setPositiveDate(String positiveDate) {
		this.positiveDate = positiveDate;
	}
	public String getPositivePublic() {
		return positivePublic;
	}
	public void setPositivePublic(String positivePublic) {
		this.positivePublic = positivePublic;
	}
	public String getPromote() {
		return promote;
	}
	public void setPromote(String promote) {
		this.promote = promote;
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
	public String getRegion() {
		return region;
	}
	public void setRegion(String region) {
		this.region = region;
	}
	public String getHonor() {
		return honor;
	}
	public void setHonor(String honor) {
		this.honor = honor;
	}
	public String getTrain() {
		return train;
	}
	public void setTrain(String train) {
		this.train = train;
	}
	public String getPassDate() {
		return passDate;
	}
	public void setPassDate(String passDate) {
		this.passDate = passDate;
	}
	public String getApproveDate() {
		return approveDate;
	}
	public void setApproveDate(String approveDate) {
		this.approveDate = approveDate;
	}
	public String getVolunteer() {
		return volunteer;
	}
	public void setVolunteer(String volunteer) {
		this.volunteer = volunteer;
	}
	public String getPrepTrain() {
		return prepTrain;
	}
	public void setPrepTrain(String prepTrain) {
		this.prepTrain = prepTrain;
	}
	public String getNormalDate() {
		return normalDate;
	}
	public void setNormalDate(String normalDate) {
		this.normalDate = normalDate;
	}
	public String getDiscuss() {
		return discuss;
	}
	public void setDiscuss(String discuss) {
		this.discuss = discuss;
	}
	public String getNormalApproveDate() {
		return normalApproveDate;
	}
	public void setNormalApproveDate(String normalApproveDate) {
		this.normalApproveDate = normalApproveDate;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}
}
