## 安全算法 - 摘要算法


### **1. 简介：**       
    
- **消息摘要算法的主要特征是加密过程不需要密钥，并且经过加密的数据无法被解密**
- **只有输入相同的明文数据经过相同的消息摘要算法才能得到相同的密文。**
- **消息摘要算法主要应用在“数字签名”领域，作为对明文的摘要算法。**
- **著名的摘要算法有RSA公司的MD5算法和SHA-1算法及其大量的变体**。

### **2. 特点：**

1. **无论输入的消息有多长，计算出来的消息摘要的长度总是固定的。**
2. **消息摘要看起来是“伪随机的”。也就是说对相同的信息求摘要结果相同。**
3. **消息轻微改变生成的摘要变化会很大**
4. **只能进行正向的信息摘要，而无法从摘要中恢复出任何的消息，甚至根本就找不到任何与原信息相关的信息**

### **3. 应用：**
    
消息摘要算法最常用的场景就是数字签名以及数据（密码）加密了。(一般平时做项目用的比较多的就是使用MD5对用户密码进行加密)

### **4. 何谓数字签名：**

数字签名主要用到了非对称密钥加密技术与数字摘要技术。数字签名技术是将摘要信息用发送者的私钥加密，与原文一起传送给接收者。接收者只有用发送者的公钥才能解密被加密的摘要信息，然后用HASH函数对收到的原文产生一个摘要信息，与解密的摘要信息对比。
如果相同，则说明收到的信息是完整的，在传输过程中没有被修改，否则说明信息被修改过.

因此数字签名能够验证信息的完整性。
数字签名是个加密的过程，数字签名验证是个解密的过程。

### **5. 常见消息/数字摘要算法：**
    
#### [**MD5:**](https://baike.baidu.com/item/MD5/212708?fr=aladdin)

##### 简介：

MD5的作用是让大容量信息在用数字签名软件签署私人密钥前被"压缩"成一种保密的格式
    （也就是把一个任意长度的字节串变换成一定长的十六进制数字串）。
    
##### 特点：

1. **压缩性：** 任意长度的数据，算出的MD5值长度都是固定的。
2. **容易计算：** 从原数据计算出MD5值很容易。
3. **抗修改性：** 对原数据进行任何改动，哪怕只修改1个字节，所得到的MD5值都有很大区别。    
4. **强抗碰撞：** 已知原数据和其MD5值，想找到一个具有相同MD5值的数据（即伪造数据）是非常困难的。
     
##### 代码实现：

**利用JDK提供java.security.MessageDigest类实现MD5算法：**

```java
package com.snailclimb.ks.securityAlgorithm;

import java.security.MessageDigest;

public class MD5Demo {

    // test
    public static void main(String[] args) {
        System.out.println(getMD5Code("你若安好，便是晴天"));
    }

    private MD5Demo() {
    }

    // md5加密
    public static String getMD5Code(String message) {
        String md5Str = "";
        try {
        	//创建MD5算法消息摘要
            MessageDigest md = MessageDigest.getInstance("MD5");
            //生成的哈希值的字节数组
            byte[] md5Bytes = md.digest(message.getBytes());
            md5Str = bytes2Hex(md5Bytes);
        }catch(Exception e) {
            e.printStackTrace();
        }
        return md5Str;
    }

    // 2进制转16进制
    public static String bytes2Hex(byte[] bytes) {
        StringBuffer result = new StringBuffer();
        int temp;
        try {
            for (int i = 0; i < bytes.length; i++) {
                temp = bytes[i];
                if(temp < 0) {
                    temp += 256;
                }
                if (temp < 16) {
                    result.append("0");
                }
                result.append(Integer.toHexString(temp));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result.toString();
    }
}

```

**结果：**
```
6bab82679914f7cb480a120b532ffa80

```

**注意MessageDigest类的几个方法：**

```java
static MessageDigest getInstance(String algorithm)//返回实现指定摘要算法的MessageDigest对象
```
```java
byte[] digest(byte[] input)//使用指定的字节数组对摘要执行最终更新，然后完成摘要计算。 
```

##### 不利用Java提供的java.security.MessageDigest类实现MD5算法：

```java
package com.snailclimb.ks.securityAlgorithm;

public class MD5{
    /*
    *四个链接变量
    */
    private final int A=0x67452301;
    private final int B=0xefcdab89;
    private final int C=0x98badcfe;
    private final int D=0x10325476;
    /*
    *ABCD的临时变量
    */
    private int Atemp,Btemp,Ctemp,Dtemp;
     
    /*
    *常量ti
    *公式:floor(abs(sin(i+1))×(2pow32)
    */
    private final int K[]={
        0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,
        0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,0x698098d8,
        0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,
        0xa679438e,0x49b40821,0xf61e2562,0xc040b340,0x265e5a51,
        0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,
        0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,
        0xfcefa3f8,0x676f02d9,0x8d2a4c8a,0xfffa3942,0x8771f681,
        0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,
        0xbebfbc70,0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,
        0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,0xf4292244,
        0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,
        0xffeff47d,0x85845dd1,0x6fa87e4f,0xfe2ce6e0,0xa3014314,
        0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391};
    /*
    *向左位移数,计算方法未知
    */
    private final int s[]={7,12,17,22,7,12,17,22,7,12,17,22,7,
        12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
        4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,
        15,21,6,10,15,21,6,10,15,21,6,10,15,21};
     
     
    /*
    *初始化函数
    */
    private void init(){
        Atemp=A;
        Btemp=B;
        Ctemp=C;
        Dtemp=D;
    }
    /*
    *移动一定位数
    */
    private    int    shift(int a,int s){
        return(a<<s)|(a>>>(32-s));//右移的时候，高位一定要补零，而不是补充符号位
    }
    /*
    *主循环
    */
    private void MainLoop(int M[]){
        int F,g;
        int a=Atemp;
        int b=Btemp;
        int c=Ctemp;
        int d=Dtemp;
        for(int i = 0; i < 64; i ++){
            if(i<16){
                F=(b&c)|((~b)&d);
                g=i;
            }else if(i<32){
                F=(d&b)|((~d)&c);
                g=(5*i+1)%16;
            }else if(i<48){
                F=b^c^d;
                g=(3*i+5)%16;
            }else{
                F=c^(b|(~d));
                g=(7*i)%16;
            }
            int tmp=d;
            d=c;
            c=b;
            b=b+shift(a+F+K[i]+M[g],s[i]);
            a=tmp;
        }
        Atemp=a+Atemp;
        Btemp=b+Btemp;
        Ctemp=c+Ctemp;
        Dtemp=d+Dtemp;
     
    }
    /*
    *填充函数
    *处理后应满足bits≡448(mod512),字节就是bytes≡56（mode64)
    *填充方式为先加一个0,其它位补零
    *最后加上64位的原来长度
    */
    private int[] add(String str){
        int num=((str.length()+8)/64)+1;//以512位，64个字节为一组
        int strByte[]=new int[num*16];//64/4=16，所以有16个整数
        for(int i=0;i<num*16;i++){//全部初始化0
            strByte[i]=0;
        }
        int    i;
        for(i=0;i<str.length();i++){
            strByte[i>>2]|=str.charAt(i)<<((i%4)*8);//一个整数存储四个字节，小端序
        }
        strByte[i>>2]|=0x80<<((i%4)*8);//尾部添加1
        /*
        *添加原长度，长度指位的长度，所以要乘8，然后是小端序，所以放在倒数第二个,这里长度只用了32位
        */
        strByte[num*16-2]=str.length()*8;
            return strByte;
    }
    /*
    *调用函数
    */
    public String getMD5(String source){
        init();
        int strByte[]=add(source);
        for(int i=0;i<strByte.length/16;i++){
        int num[]=new int[16];
        for(int j=0;j<16;j++){
            num[j]=strByte[i*16+j];
        }
        MainLoop(num);
        }
        return changeHex(Atemp)+changeHex(Btemp)+changeHex(Ctemp)+changeHex(Dtemp);
     
    }
    /*
    *整数变成16进制字符串
    */
    private String changeHex(int a){
        String str="";
        for(int i=0;i<4;i++){
            str+=String.format("%2s", Integer.toHexString(((a>>i*8)%(1<<8))&0xff)).replace(' ', '0');
 
        }
        return str;
    }
    /*
    *单例
    */
    private static MD5 instance;
    public static MD5 getInstance(){
        if(instance==null){
            instance=new MD5();
        }
        return instance;
    }
     
    private MD5(){};
     
    public static void main(String[] args){
        String str=MD5.getInstance().getMD5("你若安好，便是晴天");
        System.out.println(str);
    }
}
```

#### [**SHA1:**](https://baike.baidu.com/item/MD5/212708?fr=aladdin)
对于长度小于2^64位的消息，SHA1会产生一个160位(40个字符)的消息摘要。当接收到消息的时候，这个消息摘要可以用来验证数据的完整性。在传输的过程中，数据很可能会发生变化，那么这时候就会产生不同的消息摘要。

SHA1有如下特性：

- 不可以从消息摘要中复原信息；
- 两个不同的消息不会产生同样的消息摘要,(但会有1x10 ^ 48分之一的机率出现相同的消息摘要,一般使用时忽略)。
    
##### 代码实现：

**利用JDK提供java.security.MessageDigest类实现SHA1算法：*

```java
package com.snailclimb.ks.securityAlgorithm;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class SHA1Demo {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println(getSha1("你若安好，便是晴天"));
	
	}

	public static String getSha1(String str) {
		if (null == str || 0 == str.length()) {
			return null;
		}
		char[] hexDigits = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
		try {
			//创建SHA1算法消息摘要对象
			MessageDigest mdTemp = MessageDigest.getInstance("SHA1");
			//使用指定的字节数组更新摘要。
			mdTemp.update(str.getBytes("UTF-8"));
			//生成的哈希值的字节数组
			byte[] md = mdTemp.digest();
			//SHA1算法生成信息摘要关键过程
			int j = md.length;
		    char[] buf = new char[j * 2];
			int k = 0;
			for (int i = 0; i < j; i++) {
				byte byte0 = md[i];
				buf[k++] = hexDigits[byte0 >>> 4 & 0xf];
				buf[k++] = hexDigits[byte0 & 0xf];
			}
			return new String(buf);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return "0";
		
	}
}

```

**结果：**

```
8ce764110a42da9b08504b20e26b19c9e3382414
```

