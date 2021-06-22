package com.framework.po;

import java.io.Serializable;

/**
 * 
 * 描述：Ztree封装类
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class Ztree implements Serializable {
	//id
	private Integer id;
	//pId
	private Integer pId;
	//open
	private Boolean open;
	//file
	private String file;
	//isParent
	private Boolean isParent;
	//name
	private String name;
	//图标
	private String iconSkin;
	public Ztree() {
		super();
	}
	
	public Ztree(Integer id, Integer pId, Boolean open, String file,
			Boolean isParent, String name) {
		super();
		this.id = id;
		this.pId = pId;
		this.open = open;
		this.file = file;
		this.isParent = isParent;
		this.name = name;
	}

	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getpId() {
		return pId;
	}
	public void setpId(Integer pId) {
		this.pId = pId;
	}
	public Boolean getOpen() {
		return open;
	}
	public void setOpen(Boolean open) {
		this.open = open;
	}
	public String getFile() {
		return file;
	}
	public void setFile(String file) {
		this.file = file;
	}
	public Boolean getIsParent() {
		return isParent;
	}
	public void setIsParent(Boolean isParent) {
		this.isParent = isParent;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public String getIconSkin() {
		return iconSkin;
	}

	public void setIconSkin(String iconSkin) {
		this.iconSkin = iconSkin;
	}
}
