package com.framework.utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;

/**
 * @Description: 基于servlet的文件上传工具类
 * @ClassName: FileUploadUtils.java
 * @author 谭长华
 * @date 2016年10月12日
 * 
 */
public class FileUploadUtils {

	/**
	 * 文件批量上传，返回存储文件名
	 * 
	 * @param request
	 *            请求
	 * @param response
	 *            响应
	 * @param savePath
	 *            存储路径
	 * @return Failed to open output stream--1 Failed to open input stream--2
	 *         FileUploadException--3 name--原文件路径 saveName--重命名文件 error--错处代码
	 * @throws IOException
	 */
	public Map<String, Object> batchUpload(HttpServletRequest request,
			HttpServletResponse response, String savePath) throws IOException {
		// 设置客户端
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html;utf-8");

		// 返回数据
		Map<String, Object> map = new HashMap<String, Object>();

		// 存储文件名称
		List<String> listName = new ArrayList<String>();
		// 存储文件重命名
		List<String> saveName = new ArrayList<String>();

		// 获得磁盘文件条目工厂
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// 设置暂时存放的 存储室 , 这个存储室，可以和 最终存储文件 的目录不同
		factory.setRepository(new File(savePath));
		// 设置 缓存的大小，当上传文件的容量超过该缓存时，直接放到 暂时存储室
		factory.setSizeThreshold(1024 * 1024);
		// 高水平的API文件上传处理
		ServletFileUpload upload = new ServletFileUpload(factory);
		//中文乱码
		upload.setHeaderEncoding("ISO8859_1");

		// 获取输入流
		InputStream in = null;
		// 获得输出流
		FileOutputStream out = null;

		try {
			// 存储目录
			File file = new File(savePath);
			// 判断
			if (!file.exists()) {
				// 文件目录不存在，新建
				file.mkdirs();
			}
			// 可以上传多个文件
			List<FileItem> list = (List<FileItem>) upload.parseRequest(request);
			// 评定是否有文件
			if (!list.isEmpty()) {
				// 循环处理文件
				for (FileItem fileItem : list) {
					if (!fileItem.isFormField()) {
						// 获取路径名
						//String value = fileItem.getName();
						
						String value = new String(fileItem.getName().getBytes("ISO8859_1"),"utf-8");

						// 索引到最后一个反斜杠
						int start = value.lastIndexOf("\\");
						// 截取 上传文件的 字符串名字，加1是 去掉反斜杠，
						String realname = value.substring(start + 1);

						// 添加文件名
						listName.add(realname);

						// 获得文件类型
						String filetype = realname.substring(
								realname.lastIndexOf("."), realname.length());
						// 获取输入流
						in = fileItem.getInputStream();

						// 重命名文件
						String filename = "" + System.currentTimeMillis()
								+ filetype;
						File saveFile = new File(savePath, filename);

						// 保存文件名
						saveName.add(filename);

						// 获得输出流
						out = new FileOutputStream(saveFile);
						// 文件保存
						IOUtils.copy(in, out);

						// 成功标志
						map.put("error", 0);
						// 关闭流
						in.close();
						out.close();
					}
				}
			} else {
				map.put("error", 4);
			}
		} catch (FileNotFoundException e) {
			// Failed to open output stream.
			map.put("error", 1);
		} catch (IOException e) {
			// Failed to open input stream.
			map.put("error", 2);
		} catch (FileUploadException e) {
			// FileUploadException.
			map.put("error", 3);
		}

		// 文件名称
		map.put("name", listName);
		map.put("saveName", saveName);
		// 返回
		return map;
	}

	/**
	 * 删除单个文件
	 * 
	 * @param sPath
	 *            被删除文件的路径+文件名
	 * @return 单个文件删除成功返回true，否则返回false
	 */
	public boolean deleteFile(String sPath) {
		// 删除标志
		Boolean flag = false;
		// 文件
		File file = new File(sPath);
		// 路径为文件且不为空则进行删除
		if (file.isFile() && file.exists()) {
			file.delete();
			flag = true;
		}
		return flag;
	}

	/**
	 * 删除目录（文件夹）以及目录下的文件
	 * 
	 * @param sPath
	 *            被删除目录的文件路径
	 * @return 目录删除成功返回true，否则返回false
	 */
	public boolean deleteDirectory(String sPath) {
		boolean flag = false;
		// 如果sPath不以文件分隔符结尾，自动添加文件分隔符
		if (!sPath.endsWith(File.separator)) {
			sPath = sPath + File.separator;
		}
		File dirFile = new File(sPath);
		// 如果dir对应的文件不存在，或者不是一个目录，则退出
		if (!dirFile.exists() || !dirFile.isDirectory()) {
			return false;
		}
		flag = true;
		// 删除文件夹下的所有文件(包括子目录)
		File[] files = dirFile.listFiles();
		for (int i = 0; i < files.length; i++) {
			// 删除子文件
			if (files[i].isFile()) {
				flag = deleteFile(files[i].getAbsolutePath());
				if (!flag)
					break;
			} // 删除子目录
			else {
				flag = deleteDirectory(files[i].getAbsolutePath());
				if (!flag)
					break;
			}
		}
		if (!flag)
			return false;
		// 删除当前目录
		if (dirFile.delete()) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 移动文件到指定路径
	 * @param sourcePath 原文件路径含文件名
	 * @param targetPath 目标文件路径，文件夹，不含文件名
	 * @return boolean
	 */
	public boolean moveFile(String sourcePath, String targetPath) {
		//原文件
		File source = new File(sourcePath);
		//目标文件
		File tar = new File(targetPath + "\\" + source.getName());
		//目标文件夹
		File tarFloder = new File(targetPath);
		if (!tarFloder.exists()) {
			tarFloder.mkdirs();
		}
		//移动
        if (source.renameTo(tar)) {  
            return true;
        } else {  
            return false;
        }  
	}
}
