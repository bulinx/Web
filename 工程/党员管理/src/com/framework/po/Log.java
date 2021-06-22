package com.framework.po;

import java.io.Serializable;
import java.sql.Timestamp;

import com.framework.utils.DateUtil;

/**
 * 
 * @ClassName: Log 
 * @Description: 登录日志
 * @author 谭长华
 * @date 2016年8月1日 上午11:00:06 
 *
 */
@SuppressWarnings("serial")
public class Log implements Serializable {
	//主键
	private Integer id;
	//用户名
	private String name;
	//ip地址
	private String ip;
	//MAC地址
	private String macAddress;
	//登录地点
	private String address;
	//记录时间
	private Timestamp createTime = DateUtil.getSqlTimestamp();
	//状态
	private String content;
	//备份标志(默认0)：0-新增，1-修改，2-已备份
	private Byte flag = 0;
	public Log() {
		super();
	}
	public Log(String name, String ip, String address, String content) {
		this.name = name;
		this.ip = ip;
		this.address = address;
		this.content = content;
	}
	public Log(String name, String ip, String macAddress, String address,
			String content) {
		super();
		this.name = name;
		this.ip = ip;
		this.macAddress = macAddress;
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
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
