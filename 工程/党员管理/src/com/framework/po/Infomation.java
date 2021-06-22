package com.framework.po;

import java.sql.Timestamp;

import com.framework.utils.DateUtil;

/**
 * 
 * @ClassName: Infomation 
 * @Description: 内容实体
 * @author 谭长华
 * @date 2016年8月11日 下午4:09:46 
 *
 */
public class Infomation {
	//主键
	private Integer id;
	//标题
	private String title;
	//发布时间
	private Timestamp publishTime = DateUtil.getSqlTimestamp();
	//发布人
	private String publishMan;
	//来源
	private String source;
	//摘要
	private String summary;
	//图片路径
	private String picPath;
	//阅读数
	private Integer viewCount = 0;
	//评论数
	private Integer commentCount = 0;
	//内容
	private String content;
	//类型:0-分享，1-点滴，2-积累，3-其他
	private byte type;
	//状态(默认0)：0-发布，1-下架，2-删除
	private byte statue = 0;
	//备份标志(默认0)：0-新增，1-修改，2-已备份
	private byte flag = 0;
	public Infomation() {
		super();
	}
	public Infomation(String title, String publishMan, String summary,
			String content) {
		super();
		this.title = title;
		this.publishMan = publishMan;
		this.summary = summary;
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
	public Timestamp getPublishTime() {
		return publishTime;
	}
	public void setPublishTime(Timestamp publishTime) {
		this.publishTime = publishTime;
	}
	public String getPublishMan() {
		return publishMan;
	}
	public void setPublishMan(String publishMan) {
		this.publishMan = publishMan;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public String getPicPath() {
		return picPath;
	}
	public void setPicPath(String picPath) {
		this.picPath = picPath;
	}
	public Integer getViewCount() {
		return viewCount;
	}
	public void setViewCount(Integer viewCount) {
		this.viewCount = viewCount;
	}
	public Integer getCommentCount() {
		return commentCount;
	}
	public void setCommentCount(Integer commentCount) {
		this.commentCount = commentCount;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public byte getType() {
		return type;
	}
	public void setType(byte type) {
		this.type = type;
	}
	public byte getStatue() {
		return statue;
	}
	public void setStatue(byte statue) {
		this.statue = statue;
	}
	public byte getFlag() {
		return flag;
	}
	public void setFlag(byte flag) {
		this.flag = flag;
	}
}
