package com.xgdj.service;

import java.util.ArrayList;
import java.util.List;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.CommonService;
import com.framework.utils.Constant;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.xgdj.daoImpl.MessageDAOImpl;
import com.xgdj.po.Message;
import com.xgdj.po.MsgRelation;

/**
 * 消息业务处理
 * @author 谭长华
 * @ClassName MessageService
 * @date 2017年3月18日
 *
 */
public class MessageService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final MessageService instance = new MessageService();

	// 静态工厂方法
	public static MessageService getInstance() {
		return instance;
	}
	
	/**
	 * 单个发送消息
	 * @param title 标题
	 * @param content 内容
	 * @param sendMan 发送人
	 * @param recvMan 接收人
	 */
	public void send(String title, String content, String sendMan, Integer recvMan) {
		//实例消息
		Message message = new Message(title, sendMan, content);
		//存储
		CommonDAOImpl.getInstance().save(message);
		//实例发送
		MsgRelation relation = new MsgRelation(recvMan, message.getId());
		//发送
		CommonDAOImpl.getInstance().save(relation);
	}
	
	/**
	 * 群发消息
	 * @param title 标题
	 * @param content 内容
	 * @param sendMan 发送人
	 * @param recvMan 接收人多个
	 */
	public void send(String title, String content, String sendMan, Integer[] recvMan) {
		//实例消息
		Message message = new Message(title, sendMan, content);
		//存储
		CommonDAOImpl.getInstance().save(message);
		//发送对象
		List<MsgRelation> list = new ArrayList<MsgRelation>();
		//处理发送
		for (Integer id : recvMan) {
			//实例
			MsgRelation relation = new MsgRelation(id, message.getId());
			//添加
			list.add(relation);
		}
		//发送
		CommonDAOImpl.getInstance().batchSave(list);
	}
	
	/**
	 * 条件查询
	 * @param recvMan 参数
	 * @param currentPage 当前页 
	 * @return PageResult
	 */
	public PageResult searchByPage(Integer currentPage, Integer recvMan) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		
		//查询参数
		MsgRelation obj = new MsgRelation(recvMan, 0);
		
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), MessageDAOImpl.getInstance().findCount(obj), page
				.getCurrentPage());

		//查询数据
		List<MsgRelation> list = MessageDAOImpl.getInstance().findByPage(page, obj);
		//查询消息
		List<Message> list2 = new ArrayList<Message>();
		//处理
		for (int i = 0; i < list.size(); i++) {
			//发送消息
			MsgRelation relation = list.get(i);
			//查询消息
			Message message = CommonDAOImpl.getInstance().get(Message.class, relation.getMsgId());
			//状态
			message.setState(relation.getState());
			//添加
			list2.add(message);
			//修改读取状态
			relation.setState(1);
			//处理已读消息
			CommonDAOImpl.getInstance().update(relation);
		}
		
		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, list2);

		return result;
	}
	
	/**
	 * 查询未读记录数
	 * @param recvMan 接收人
	 * @return int
	 */
	public int unReadCount(Integer recvMan) {
		//查询
		List<MsgRelation> list = CommonDAOImpl.getInstance().findByProperty(MsgRelation.class, "recvMan", recvMan);
		//未读记录
		int count = 0;
		//处理
		for (MsgRelation msgRelation : list) {
			if (msgRelation.getState() == 0) {
				count++;
			}
		}
		//返回
		return count;
	}
}
