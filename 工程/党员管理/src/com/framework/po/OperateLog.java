package com.framework.po;

import java.io.Serializable;
import java.sql.Timestamp;

import com.framework.utils.DateUtil;

/**
 * 
 * 描述：操作日志
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class OperateLog implements Serializable {
	//主键
	private Integer id;
	//操作人
	private String operateBy;
	//操作时间
	private Timestamp operateTime = DateUtil.getSqlTimestamp();
	//备注
	private String content;
	//操作类型
	private String keywords;
	//备份标志(默认0)：0-新增，1-修改，2-备份
	private Byte flag = 0;
	public OperateLog(String operateBy, String content, String keywords) {
		super();
		this.operateBy = operateBy;
		this.content = content;
		this.keywords = keywords;
	}
	public OperateLog() {
		super();
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getOperateBy() {
		return operateBy;
	}
	public void setOperateBy(String operateBy) {
		this.operateBy = operateBy;
	}
	public Timestamp getOperateTime() {
		return operateTime;
	}
	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getKeywords() {
		return keywords;
	}
	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}
	public Byte getFlag() {
		return flag;
	}
	public void setFlag(Byte flag) {
		this.flag = flag;
	}
}
