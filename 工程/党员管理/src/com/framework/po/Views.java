package com.framework.po;

import java.io.Serializable;
import java.sql.Timestamp;

import com.framework.utils.DateUtil;

/**
 * 
 * @ClassName: Views 
 * @Description: 用户访问记录 
 * @author 谭长华
 * @date 2016年8月24日 上午11:30:01 
 *
 */
@SuppressWarnings("serial")
public class Views implements Serializable {
	//主键
	private Integer id;
	//ip地址
	private String ip;
	//MAC地址
	private String macAddress;
	//设备类型
	private String type;
	//访问时间
	private Timestamp createTime = DateUtil.getSqlTimestamp();
	//地址
	private String address;
	//备注
	private String content;
	//备份标志(默认0)：0-新增，1-修改，2-已备份
	private Byte flag = 0;
	public Views() {
		super();
	}
	public Views(String ip, String type, String address, String content) {
		super();
		this.ip = ip;
		this.type = type;
		this.address = address;
		this.content = content;
	}
	public Views(String ip, String macAddress, String type, String address,
			String content) {
		super();
		this.ip = ip;
		this.macAddress = macAddress;
		this.type = type;
		this.address = address;
		this.content = content;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Byte getFlag() {
		return flag;
	}
	public void setFlag(Byte flag) {
		this.flag = flag;
	}
	public String getMacAddress() {
		return macAddress;
	}
	public void setMacAddress(String macAddress) {
		this.macAddress = macAddress;
	}
}
