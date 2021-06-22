package com.framework.utils;

/**
 * 异步返回结果
 * @author 谭长华
 * @version 2016-04-25
 *
 */
public class Result {
	//成功标志 true-成功，false-失败
	private boolean success = false;
	//提示代码，自定义
	private int code  = 0;
	//提示信息
	private String msg = "";
	//结果y-成功--validate验证
	private String status;
	//信息--validate验证
	private String info;
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getInfo() {
		return info;
	}
	public void setInfo(String info) {
		this.info = info;
	}
	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
}
