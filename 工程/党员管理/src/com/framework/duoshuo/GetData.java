package com.framework.duoshuo;

import java.sql.Timestamp;

import com.framework.utils.DateUtil;


/**
 * @Description: 多说返回的评论数据
 * @ClassName:  GetData.java
 * @author 谭长华
 * @date 2016年11月28日 
 *
 */
public class GetData {
	//主键
	private Integer id;
	//备份标志(默认0)：0-新增，1-修改，2-已备份
	private Byte flag = 0;
	//结果码。0为成功。失败时为错误码。
	private Integer code;
	//错误消息。当code不为0时，返回错误消息。
	private String errorMessage;
	//已经同步的最后一个 last_log_id，作为下次的 since_id
	private Long last_log_id;
	//执行时间
	private Timestamp createTime = DateUtil.getSqlTimestamp();
	//同步动作
	private String action;
	//签名，为多说密钥和其他参数进行base64处理后的签名
	private String signature;
	public Integer getCode() {
		return code;
	}
	public void setCode(Integer code) {
		this.code = code;
	}
	public String getErrorMessage() {
		return errorMessage;
	}
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	public Long getLast_log_id() {
		return last_log_id;
	}
	public void setLast_log_id(Long last_log_id) {
		this.last_log_id = last_log_id;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Byte getFlag() {
		return flag;
	}
	public void setFlag(Byte flag) {
		this.flag = flag;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getSignature() {
		return signature;
	}
	public void setSignature(String signature) {
		this.signature = signature;
	}
}
