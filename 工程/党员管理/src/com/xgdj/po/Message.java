package com.xgdj.po;

import java.sql.Timestamp;

import com.framework.utils.DateUtil;

/**
 * 站内信
 * @author 谭长华
 * @ClassName Message
 * @date 2017年3月18日
 *
 */
public class Message {
	//主键
	private Integer id;
	//标题
	private String title;
	//发送人
	private String sendMan;
	//发送时间
	private Timestamp sendTime = DateUtil.getSqlTimestamp();
	//内容
	private String content;
	//阅读状态（0-未读，1-已读）
	private Integer state = 0;
	public Message() {
		super();
	}
	public Message(String title, String sendMan, String content) {
		super();
		this.title = title;
		this.sendMan = sendMan;
		this.content = content;
	}
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
	public String getSendMan() {
		return sendMan;
	}
	public void setSendMan(String sendMan) {
		this.sendMan = sendMan;
	}
	public Timestamp getSendTime() {
		return sendTime;
	}
	public void setSendTime(Timestamp sendTime) {
		this.sendTime = sendTime;
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
}
