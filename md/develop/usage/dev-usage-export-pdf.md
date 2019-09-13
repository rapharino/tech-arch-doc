## Itext PDF 导出
> 给我的文档系统添加了导出，本文记录PDF填坑小结。@pdai

### PDF导出的实现

#### 导出流
```java
@RequestMapping(value = "export")
public void exportPdfNew(String mdContent, String type, HttpServletResponse response) {
	response.reset();
	response.setContentType("multipart/form-data");

	String title = "file";
	String author = "pdai";
	String mdFileContent = "";

	ServletOutputStream out = null;
	try {
		byte[] fileBytes = null;
		
		String htmlFile = StringEscapeUtils.unescapeHtml4(mdContent);
		
		String cleanedHtmlFile = htmlFile.replace("<img", "<img style=\"display:inline-block;width:100%;max-width:650px;\" ");
		cleanedHtmlFile = cleanHtml(cleanedHtmlFile);
		fileBytes = convert(author, cleanedHtmlFile);
		response.setHeader("Content-Disposition",
				"inline; filename=\"" + title + "_" + System.currentTimeMillis() + ".pdf\"");
			
		out = response.getOutputStream();
		out.write(fileBytes);
		out.close();
		out.flush();
	} catch (Exception e) {
		System.out.println(e);
	}
}
```

#### 清理HTML
```java
public static String cleanHtml(String input) throws ConversionException, IOException {
	InputStream stringAsStream;
	try {
		stringAsStream = new ByteArrayInputStream(input.getBytes("UTF-8"));
	} catch (UnsupportedEncodingException e) {
		throw ConversionException.HTML_TO_PDF_EXCEPTION;
	}
	HtmlCleaner cleaner = new HtmlCleaner();
	TagNode node = cleaner.clean(stringAsStream, "UTF-8");

	TagNode t = new TagNode("root");
	t.addChild(node);

	String html = cleaner.getInnerHtml(t);
	return html;
}
```

#### 页眉页脚支持
```java
public class HeaderFooterEvent extends PdfPageEventHelper {
	String header, author;
	PdfTemplate total;

	public void setHeader(String header) {
		this.header = header;
	}
	
	public void setAuthor(String author) {
		this.author = author;
	}

	public void onOpenDocument(PdfWriter writer, Document document) {
		total = writer.getDirectContent().createTemplate(30, 16);
	}

//	public void onEndPage(PdfWriter writer, Document document) {
//		PdfPTable table = new PdfPTable(3);
//		try {
//			table.setWidths(new int[] { 60, 24, 2 });
//			table.setTotalWidth(600);
//			table.setLockedWidth(true);
//			table.getDefaultCell().setFixedHeight(40);
//			table.getDefaultCell().setBorder(Rectangle.BOX);
//			table.getDefaultCell().setBorderWidth(0.1f);
//			table.getDefaultCell().setBorderColor(Color.gray);
//
//			table.addCell(header);
//			table.getDefaultCell().setHorizontalAlignment(Element.ALIGN_RIGHT);
//			table.addCell(String.format("Page %d of", writer.getPageNumber()));
//			PdfPCell cell = new PdfPCell(Image.getInstance(total));
//			cell.setBorder(Rectangle.BOTTOM);
//			table.addCell(cell);
//			table.writeSelectedRows(0, -1, 34, 803, writer.getDirectContent());
//
//		} catch (DocumentException de) {
//			throw new ExceptionConverter(de);
//		}
//	}
	
	public void onEndPage(PdfWriter writer, Document document) {  
        
        PdfContentByte cb = writer.getDirectContent();  
        cb.saveState();  
  
        cb.beginText();  
        BaseFont bf = null;  
        try {  
            bf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.EMBEDDED);
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        cb.setColorFill(Color.GRAY);
        cb.setFontAndSize(bf, 10);  
        
          
        //Header  
        float x = document.top(-10);  
          
        //左  
        cb.showTextAligned(PdfContentByte.ALIGN_LEFT,  
                           "Author: " + author,   
                           document.left(), x, 0);  
        //中  
//        cb.showTextAligned(PdfContentByte.ALIGN_CENTER,  
//                            writer.getPageNumber()+ " page",  
//                           (document.right() + document.left())/2,  
//                           x, 0);  
        //右  
        cb.showTextAligned(PdfContentByte.ALIGN_RIGHT,  
                           "Email: suzhou.daipeng@gmail.com",  
                           document.right(), x, 0);  
  
        //Footer  
        float y = document.bottom(-10);  
  
        //左  
        cb.showTextAligned(PdfContentByte.ALIGN_LEFT,  
                           "Confidential",  
                           document.left(), y, 0);  
        //中  
		cb.showTextAligned(PdfContentByte.ALIGN_CENTER,  
				String.format("- %d -", writer.getPageNumber()),  
		                   (document.right() + document.left())/2,  
		                   y, 0);
        //右  
//        cb.showTextAligned(PdfContentByte.ALIGN_RIGHT,  
//                           "F-Right",  
//                           document.right(), y, 0);  
  
        cb.endText();  
          
        cb.restoreState();  
    }  

	public void onCloseDocument(PdfWriter writer, Document document) {
		ColumnText.showTextAligned(total, Element.ALIGN_LEFT, new Phrase(String.valueOf(writer.getPageNumber() - 1)), 2,
				2, 0);

	}
}
```

### PDF中文支持
> 常见的中文支持思路：
+ 添加itext-asian.jar
+ Windows字体添加到项目中，导出时通过创建该字体对象；
+ classpath设置

简单demo如下：

```java
package oliver.itext.demo;  
import java.io.File;  
import java.io.FileOutputStream;  
import java.io.IOException;  
import java.io.OutputStream;  
import com.itextpdf.text.Document;  
import com.itextpdf.text.DocumentException;  
import com.itextpdf.text.Font;  
import com.itextpdf.text.Paragraph;  
import com.itextpdf.text.pdf.BaseFont;  
import com.itextpdf.text.pdf.PdfWriter;  
  
public class PDF2Chinese  
{  
    public static void main(String[] args) throws DocumentException, IOException  
    {  
        Document document = new Document();  
        OutputStream os = new FileOutputStream(new File("chinese.pdf"));  
        PdfWriter.getInstance(document,os);  
        document.open();  
        //方法一：使用Windows系统字体(TrueType)  
        BaseFont baseFont = BaseFont.createFont("C:/Windows/Fonts/SIMYOU.TTF",BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);  
          
        //方法二：使用iTextAsian.jar中的字体  
        //BaseFont baseFont = BaseFont.createFont("STSong-Light",BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);  
          
        //方法三：使用资源字体(ClassPath)  
        ////BaseFont baseFont = BaseFont.createFont("/SIMYOU.TTF",BaseFont.IDENTITY_H,BaseFont.NOT_EMBEDDED);  
          
        Font font = new Font(baseFont);  
        document.add(new Paragraph("解决中文问题了！",font));  
        document.close();  
    }  
} 
```

#### 通过ITextFontResolvert添加字体

将Windows下fonts中所需要的字体拷贝到项目classpath下：

在代码中通过`ITextFontResolver`添加字体，具体代码如下：

```java
public byte[] convert(String author, String input)
			throws ConversionException, IOException, com.lowagie.text.DocumentException {
	ITextRenderer renderer = new ITextRenderer();
	renderer.setDocumentFromString(new String(input.getBytes()));
	renderer.setPDFVersion(PdfWriter.VERSION_1_7);
	HeaderFooterEvent headerFooterEvent = new HeaderFooterEvent();
	headerFooterEvent.setAuthor(author);
	renderer.setPdfPageEvent(headerFooterEvent);
	ITextFontResolver fontResolver = renderer.getFontResolver();
	fontResolver.addFont(fontPath+"MSYH.TTC", BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);// 微软雅黑
	fontResolver.addFont(fontPath+"MSYHBD.TTC", BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
	fontResolver.addFont(fontPath+"MSYHL.TTC", BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
	
	renderer.layout();
	ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
	renderer.createPDF(outputStream);
	byte[] bytes = outputStream.toByteArray();
	return bytes;
}
```


### PDF Linux环境下中文字体乱码
> 用itext生成pdf在windows环境下没有出现中文乱码而在linux下出现中文乱码，打开pdf查看pdf编码，以及显示的编码，发现编码并没有对应。原因是使用的宋体和微软雅黑在linux环境下并没有安装。

#### 解决方法
+ 由于我这边PDF生成是通过HTML转化的，所以第一步先导出HTML，去查看需要用哪些字体文件；

+ 到windows环境下将所需字体拷贝到linux下。(simsun.ttc(宋体), msyf.ttf（微软雅黑）)

+ 到linux环境下创建目录
```shell
mkdir -pv /usr/share/fonts/chinese/TrueType
```
将字体放入目录下
```shell
cd /usr/share/fonts/chinese/TrueType
chmod 755 * 为字体赋予可执行权限
```

+ 建立字体缓存
```shell
mkfontscale （如果提示 mkfontscale: command not found，需自行安装 # yum install mkfontscale ）
mkfontdir
fc-cache -fv （如果提示 fc-cache: command not found，则需要安装# yum install fontconfig ）
```

+ reboot重启系统

> 经不同Linux环境测试，以上步骤必须顺序全部执行， 建立字体缓存必须是在字体拷贝完成之后顺序执行 mkfontscale，mkfontdir，fc-cache -fv
