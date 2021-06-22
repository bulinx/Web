package com.xgdj.po;

import java.sql.Timestamp;

import com.framework.utils.DateUtil;

/**
 * 入党流程
 * @author 谭长华
 * @ClassName Process
 * @date 2017年3月20日
 *
 */
public class Process {
	//主键
	private Integer id;
	//标题
	private String title;
	//内容
	private String content;
	//代码值
	private Integer state;
	//操作时间
	private Timestamp createTime = DateUtil.getSqlTimestamp();
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
}
