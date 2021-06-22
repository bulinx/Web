package com.xgdj.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * web文件下载
 * 
 * @author 谭长华
 * @version 2016-05-02
 * 
 */
public class DownloadFileUtil {
	public static final String FILE_SEPARATOR = System.getProperties()
			.getProperty("file.separator");

	/**
	 * web下载文件
	 * 
	 * @param path
	 *            文件路径
	 * @param response
	 *            HttpServletResponse
	 */
	public static void download(String path, HttpServletResponse response) {
		try {
			// path是指欲下载的文件的路径。
			File file = new File(path);
			// 取得文件名。
			String filename = file.getName();
			// 以流的形式下载文件。
			InputStream fis = new BufferedInputStream(new FileInputStream(path));
			byte[] buffer = new byte[fis.available()];
			fis.read(buffer);
			fis.close();
			// 清空response
			response.reset();
			// 设置response的Header
			response.addHeader("Content-Disposition", "attachment;filename="
					+ new String(filename.getBytes()));
			response.addHeader("Content-Length", "" + file.length());
			OutputStream toClient = new BufferedOutputStream(
					response.getOutputStream());
			response.setContentType("application/vnd.ms-excel;charset=utf-8");
			toClient.write(buffer);
			toClient.flush();
			toClient.close();
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * web下载文件
	 * 
	 * @param file
	 *            需要下载的文件
	 * @param response
	 *            HttpServletResponse
	 */
	public static void download(File file, HttpServletResponse response) {
		try {
			// 取得文件名。
			String filename = file.getName();
			// 以流的形式下载文件。
			InputStream fis = new BufferedInputStream(new FileInputStream(file));
			byte[] buffer = new byte[fis.available()];
			fis.read(buffer);
			fis.close();
			// 清空response
			response.reset();
			// 设置response的Header
			response.addHeader("Content-Disposition", "attachment;filename="
					+ new String(filename.getBytes()));
			response.addHeader("Content-Length", "" + file.length());
			OutputStream toClient = new BufferedOutputStream(
					response.getOutputStream());
			response.setContentType("application/vnd.ms-excel;charset=utf-8");
			toClient.write(buffer);
			toClient.flush();
			toClient.close();
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * 获得Excel模版文件路径
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @param template
	 *            模版文件 例："student.xml"
	 * @param docFile
	 *            服务器存储文件 例："files"
	 * @return String
	 */
	public static String getExcelTemplateFilePath(HttpServletRequest request,
			String template, String docFile) {
		// 服务器存储文件路径
		String docsPath = request.getSession().getServletContext()
				.getRealPath(docFile);
		// 返回模版文件路径
		return docsPath + FILE_SEPARATOR + template;
	}

	/**
	 * 获得导出文件路径
	 * @param request HttpServletRequest
	 * @param docFile 服务器存储文件 例："files"
	 * @return String
	 */
	public static String getDownloadName(HttpServletRequest request,
			String docFile) {
		// 服务器存储文件路径
		String docsPath = request.getSession().getServletContext()
				.getRealPath(docFile);
		// 导出文件名
		String fileName = System.currentTimeMillis() + ".xls";
		//导出路径
		return docsPath + FILE_SEPARATOR + fileName;
	}
}
