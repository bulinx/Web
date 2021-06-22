package com.framework.po;

import java.io.Serializable;

/**
 * 
 * 描述：网址基本信息
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class Website implements Serializable {
	//主键
	private Integer id;
	//名称
	private String name;
	//关键字
	private String keywords;
	//描述
	private String description;
	//路径配置
	private String statics;
	//文件上传路径
	private String uploadfile;
	//版权信息
	private String copyright;
	//备案号
	private String icp;
	//备份标志(默认0)：0-新增，1-修改，2-备份
	private Byte flag = 0;
	public Website() {
		super();
	}
	public Website(String name, String keywords, String description) {
		super();
		this.name = name;
		this.keywords = keywords;
		this.description = description;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getKeywords() {
		return keywords;
	}
	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getStatics() {
		return statics;
	}
	public void setStatics(String statics) {
		this.statics = statics;
	}
	public String getUploadfile() {
		return uploadfile;
	}
	public void setUploadfile(String uploadfile) {
		this.uploadfile = uploadfile;
	}
	public String getCopyright() {
		return copyright;
	}
	public void setCopyright(String copyright) {
		this.copyright = copyright;
	}
	public String getIcp() {
		return icp;
	}
	public void setIcp(String icp) {
		this.icp = icp;
	}
	public Byte getFlag() {
		return flag;
	}
	public void setFlag(Byte flag) {
		this.flag = flag;
	}
}
