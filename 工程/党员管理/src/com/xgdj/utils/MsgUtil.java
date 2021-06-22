package com.xgdj.utils;

import java.util.List;

import com.framework.dao.impl.UserDAOImpl;
import com.framework.po.User;
import com.framework.utils.DateUtil;
import com.xgdj.po.Foundation;
import com.xgdj.service.MessageService;

/**
 * 站内信工具
 * @author 谭长华
 * @ClassName MsgUtil
 * @date 2017年3月18日
 *
 */
public class MsgUtil {
	
	/**
	 * 新用户发送消息
	 * @param recvMan
	 */
	public static void sendNewUser(Integer recvMan) {
		//标题
		String title = "欢迎小主的到来";
		//内容
		String content = "欢迎您加入信息工程学院学生党支部，记得在个人中心修改密码哦！只有在个人中心完善了我的信息后才能申请入党！";
		//发送人
		String sendMan = "系统消息";
		//发送
		MessageService.getInstance().send(title, content, sendMan, recvMan);
	}
	
	/**
	 * 新用户发送消息
	 * @param recvMan
	 */
	public static void sendNewUser(List<Foundation> list) {
		//标题
		String title = "欢迎小主的到来";
		//内容
		String content = "欢迎您加入信息工程学院学生党支部，记得在个人中心修改密码哦！只有在个人中心完善了我的信息后才能申请入党！";
		//发送人
		String sendMan = "系统消息";
		//接收人
		Integer[] arr = new Integer[list.size()];
		//处理
		for (int i = 0; i < arr.length; ++i) {
			arr[i] = list.get(i).getId();
		}
		//发送
		MessageService.getInstance().send(title, content, sendMan, arr);
	}
	
	/**
	 * 提交入党申请
	 * @param recvMan
	 */
	public static void sendApply(Integer recvMan) {
		//标题
		String title = "提交入党申请";
		//内容
		String content = "您的入党申请已经提交支部，正在等待审核！";
		//发送人
		String sendMan = "系统消息";
		//发送
		MessageService.getInstance().send(title, content, sendMan, recvMan);
	}
	
	/**
	 * 批量通过入党申请消息
	 * @param nums 学号
	 */
	public static void sendApply(String[] nums) {
		//标题
		String title = "您的入党申请已经通过";
		//内容
		String content = "恭喜您，您的入党申请已经审核通过，欢迎您的加入！";
		//发送人
		String sendMan = "系统消息";
		//查询用户
		List<User> list = UserDAOImpl.getInstance().findInName(nums);
		//接收人
		Integer[] arr = new Integer[list.size()];
		//处理
		for (int i = 0; i < arr.length; ++i) {
			arr[i] = list.get(i).getId();
		}
		//发送
		MessageService.getInstance().send(title, content, sendMan, arr);
	}
	
	/**
	 * 提交积极分子申请
	 * @param number 学号
	 */
	public static void sendPositive(String number) {
		//标题
		String title = "提交积极分子申请";
		//内容
		String content = number+"您于"+DateUtil.getCurDateTime()+"提交了积极分子申请，正在等待支部审核。";
		//发送人
		String sendMan = "系统消息";
		//收件人
		User user = UserDAOImpl.getInstance().findInName(number.split(",")).get(0);
		//发送
		MessageService.getInstance().send(title, content, sendMan, user.getId());
	}
	
	/**
	 * 批量通过积极分子申请消息
	 * @param nums 学号
	 * @param state 0-退回，2-通过
	 */
	public static void sendPositive(String[] nums, Integer state) {
		//标题
		String title = "积极分子申请审核";
		//内容
		String content = "";
		if (state == Constant.POSITIVE_OK) {
			content = "恭喜您，您的积极分子申请已经审核通过，端正思想，继续努力！";
		}
		if (state == Constant.POSITIVE_NO) {
			content = "您的积极分子申请已被退回，请仔细检查条件是否满足，您也可以到支部咨询具体情况。";
		}
		//发送人
		String sendMan = "系统消息";
		//查询用户
		List<User> list = UserDAOImpl.getInstance().findInName(nums);
		//接收人
		Integer[] arr = new Integer[list.size()];
		//处理
		for (int i = 0; i < arr.length; ++i) {
			arr[i] = list.get(i).getId();
		}
		//发送
		MessageService.getInstance().send(title, content, sendMan, arr);
	}
	
	/**
	 * 提交拟发展申请
	 * @param number 学号
	 */
	public static void sendDevelop(String number) {
		//标题
		String title = "提交拟发展申请";
		//内容
		String content = number+"您于"+DateUtil.getCurDateTime()+"提交了拟发展申请，正在等待支部审核。";
		//发送人
		String sendMan = "系统消息";
		//收件人
		User user = UserDAOImpl.getInstance().findInName(number.split(",")).get(0);
		//发送
		MessageService.getInstance().send(title, content, sendMan, user.getId());
	}
	
	/**
	 * 批量通过拟发展申请消息
	 * @param nums 学号
	 * @param state 0-退回，2-通过
	 */
	public static void sendDevelop(String[] nums, Integer state) {
		//标题
		String title = "拟发展申请审核";
		//内容
		String content = "";
		if (state == Constant.DEVELOP_OK) {
			content = "恭喜您，您的拟发展申请已经审核通过，牢记党章，不忘初心！";
		}
		if (state == Constant.DEVELOP_NO) {
			content = "您的拟发展申请已被退回，请仔细检查条件是否满足，您也可以到支部咨询具体情况。";
		}
		//发送人
		String sendMan = "系统消息";
		//查询用户
		List<User> list = UserDAOImpl.getInstance().findInName(nums);
		//接收人
		Integer[] arr = new Integer[list.size()];
		//处理
		for (int i = 0; i < arr.length; ++i) {
			arr[i] = list.get(i).getId();
		}
		//发送
		MessageService.getInstance().send(title, content, sendMan, arr);
	}
	
	/**
	 * 提交发展申请
	 * @param number 学号
	 */
	public static void sendPrepare(String number) {
		//标题
		String title = "提交发展申请";
		//内容
		String content = number+"您于"+DateUtil.getCurDateTime()+"提交了发展申请，正在等待支部审核。";
		//发送人
		String sendMan = "系统消息";
		//收件人
		User user = UserDAOImpl.getInstance().findInName(number.split(",")).get(0);
		//发送
		MessageService.getInstance().send(title, content, sendMan, user.getId());
	}
	
	/**
	 * 批量通过发展申请消息
	 * @param nums 学号
	 * @param state 0-退回，2-通过
	 */
	public static void sendPrepare(String[] nums, Integer state) {
		//标题
		String title = "发展申请审核";
		//内容
		String content = "";
		if (state == Constant.PREP_OK) {
			content = "恭喜您，您已经是一名中共党员了，争做先锋，树立榜样！";
		}
		if (state == Constant.PREP_NO) {
			content = "您的发展申请已被退回，请仔细检查条件是否满足，您也可以到支部咨询具体情况。";
		}
		//发送人
		String sendMan = "系统消息";
		//查询用户
		List<User> list = UserDAOImpl.getInstance().findInName(nums);
		//接收人
		Integer[] arr = new Integer[list.size()];
		//处理
		for (int i = 0; i < arr.length; ++i) {
			arr[i] = list.get(i).getId();
		}
		//发送
		MessageService.getInstance().send(title, content, sendMan, arr);
	}
	
	/**
	 * 提交转正申请
	 * @param number 学号
	 */
	public static void sendNormal(String number) {
		//标题
		String title = "提交转正申请";
		//内容
		String content = number+"您于"+DateUtil.getCurDateTime()+"提交了转正申请，正在等待支部审核。";
		//发送人
		String sendMan = "系统消息";
		//收件人
		User user = UserDAOImpl.getInstance().findInName(number.split(",")).get(0);
		//发送
		MessageService.getInstance().send(title, content, sendMan, user.getId());
	}
	
	/**
	 * 批量通过转正申请消息
	 * @param nums 学号
	 * @param state 0-退回，2-通过
	 */
	public static void sendNormal(String[] nums, Integer state) {
		//标题
		String title = "转正申请审核通知";
		//内容
		String content = "";
		if (state == Constant.PREP_OK) {
			content = "恭喜您，您的转正申请已通过，时刻牢记党员的权利与义务！";
		}
		if (state == Constant.PREP_NO) {
			content = "您的转正申请已被退回，请仔细检查条件是否满足，您也可以到支部咨询具体情况。";
		}
		//发送人
		String sendMan = "系统消息";
		//查询用户
		List<User> list = UserDAOImpl.getInstance().findInName(nums);
		//接收人
		Integer[] arr = new Integer[list.size()];
		//处理
		for (int i = 0; i < arr.length; ++i) {
			arr[i] = list.get(i).getId();
		}
		//发送
		MessageService.getInstance().send(title, content, sendMan, arr);
	}
	
	/**
	 * 思想汇报审核通过
	 * @param number 学号
	 */
	public static void sendReport(String number) {
		//标题
		String title = "思想汇报审核通过";
		//内容
		String content = number+"您提交的思想汇报于"+DateUtil.getCurDateTime()+"审核通过";
		//发送人
		String sendMan = "系统消息";
		//收件人
		User user = UserDAOImpl.getInstance().findInName(number.split(",")).get(0);
		//发送
		MessageService.getInstance().send(title, content, sendMan, user.getId());
	}
}
