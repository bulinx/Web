package com.framework.po;

import java.io.Serializable;

/**
 * 
 * @ClassName: User 
 * @Description: 用户登录信息 
 * @author 谭长华
 * @date 2016年8月1日 上午10:34:17 
 *
 */
@SuppressWarnings("serial")
public class User1 extends User implements Serializable {
	private Integer u1 = 0;
	/*//主键
	private Integer id;
	
	public Integer getId() {
			return id;
		}

		public void setId(Integer id) {
			this.id = id;
		}*/

	public User1(String name, String pass) {
		super();
		this.setName(name);
		this.setPass(pass);
	}

	public User1() {
		super();
	}

	public Integer getU1() {
		return u1;
	}

	public void setU1(Integer u1) {
		this.u1 = u1;
	}
}
