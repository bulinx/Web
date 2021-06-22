package com.xgdj.po;

import java.sql.Timestamp;

import com.framework.utils.DateUtil;

/**
 * 站内信发送记录
 * @author 谭长华
 * @ClassName MsgRelation
 * @date 2017年3月18日
 *
 */
public class MsgRelation {
	//主键
	private Integer id;
	//接收人
	private Integer recvMan;
	//接受时间
	private Timestamp recvTime = DateUtil.getSqlTimestamp();
	//阅读状态（0-未读，1-已读）
	private Integer state = 0;
	//消息ID
	private Integer msgId;
	public MsgRelation() {
		super();
	}
	public MsgRelation(Integer recvMan, Integer msgId) {
		super();
		this.recvMan = recvMan;
		this.msgId = msgId;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getRecvMan() {
		return recvMan;
	}
	public void setRecvMan(Integer recvMan) {
		this.recvMan = recvMan;
	}
	public Timestamp getRecvTime() {
		return recvTime;
	}
	public void setRecvTime(Timestamp recvTime) {
		this.recvTime = recvTime;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}
	public Integer getMsgId() {
		return msgId;
	}
	public void setMsgId(Integer msgId) {
		this.msgId = msgId;
	}
}
