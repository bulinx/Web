package com.framework.duoshuo;

import java.sql.Timestamp;

/**
 * @Description: 多说数据同步到本地库记录
 * @ClassName:  DuoShuo.java
 * @author 谭长华
 * @date 2016年11月28日 
 *
 */
public class DuoShuo {
	//主键
	private Integer id;
	//备份标志(默认0)：0-新增，1-修改，2-已备份
	private Byte flag = 0;
	//记录id。按时间顺序递增。
	private Long log_id;
	//对评论执行该操作的用户id。
	private String user_id;
	//操作类型：create 创建评论approve 通过评论spam 标记垃圾评论delete 删除评论delete-forever 彻底删除评论
	private String action;
	//执行该操作的时间戳。
	private Timestamp date;
	//评论id。请注意，post_id为64位二进制整数，MySQL数据类型建议定义为bigInt。
	private Long post_id;
	//文章在多说的id。请注意，thread_id为64位二进制整数，MySQL数据类型建议定义为bigInt。
	private Long thread_id;
	//文章在原站点的文章标识。无记录时，为NULL；
	private String thread_key;
	//作者在多说的id。0表示匿名用户。
	private String author_id;
	//作者显示名。有可能为空。
	private String author_name;
	//作者邮箱。有可能为空字符串。
	private String author_email;
	//作者网址。有可能为空字符串。
	private String author_url;
	//作者在网站中对应的id。有可能为0。
	private String author_key;
	//作者ip地址。格式为*.*.*.*
	private String ip;
	//评论创建日期，格式示例：2012-07-13T21:58:13+08:00。
	private String created_at;
	//评论内容。请注意截取。
	private String message;
	//评论状态。创建评论时，可能的状态：approved：已经通过；pending：待审核；spam：垃圾评论。
	private String status;
	//父评论id。请注意，thread_id为64位二进制整数，MySQL数据类型建议定义为bigInt。
	private String parent_id;
	//类型。现在均为空。
	private String type;
	//记录ID
	private Long[] post_Ids;
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
	public Long getLog_id() {
		return log_id;
	}
	public void setLog_id(Long log_id) {
		this.log_id = log_id;
	}
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public Timestamp getDate() {
		return date;
	}
	public void setDate(Timestamp date) {
		this.date = date;
	}
	public Long getPost_id() {
		return post_id;
	}
	public void setPost_id(Long post_id) {
		this.post_id = post_id;
	}
	public Long getThread_id() {
		return thread_id;
	}
	public void setThread_id(Long thread_id) {
		this.thread_id = thread_id;
	}
	public String getThread_key() {
		return thread_key;
	}
	public void setThread_key(String thread_key) {
		this.thread_key = thread_key;
	}
	public String getAuthor_id() {
		return author_id;
	}
	public void setAuthor_id(String author_id) {
		this.author_id = author_id;
	}
	public String getAuthor_name() {
		return author_name;
	}
	public void setAuthor_name(String author_name) {
		this.author_name = author_name;
	}
	public String getAuthor_email() {
		return author_email;
	}
	public void setAuthor_email(String author_email) {
		this.author_email = author_email;
	}
	public String getAuthor_url() {
		return author_url;
	}
	public void setAuthor_url(String author_url) {
		this.author_url = author_url;
	}
	public String getAuthor_key() {
		return author_key;
	}
	public void setAuthor_key(String author_key) {
		this.author_key = author_key;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public String getCreated_at() {
		return created_at;
	}
	public void setCreated_at(String created_at) {
		this.created_at = created_at;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getParent_id() {
		return parent_id;
	}
	public void setParent_id(String parent_id) {
		this.parent_id = parent_id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Long[] getPost_Ids() {
		return post_Ids;
	}
	public void setPost_Ids(Long[] post_Ids) {
		this.post_Ids = post_Ids;
	}
}
