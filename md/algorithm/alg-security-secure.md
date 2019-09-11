## 安全算法 - 加密算法

### **1. 简介：**
   
- **加密技术包括两个元素：加密算法和密钥。**
- **加密算法是将普通的文本（或者可以理解的信息）与一串数字（密钥）的结合，产生不可理解的密文的步骤。**
- **密钥是用来对数据进行编码和解码的一种算法。**
- **在安全保密中，可通过适当的密钥加密技术和管理机制来保证网络的信息通讯安全。**

### **2. 分类：**
   
**密钥加密技术的密码体制分为对称密钥体制和非对称密钥体制两种。相应地，对数据加密的技术分为两类，即对称加密（私人密钥加密）和非对称加密（公开密钥加密）。**

**对称加密以数据加密标准（DES，Data Encryption Standard）算法为典型代表，非对称加密通常以RSA（Rivest Shamir Adleman）算法为代表。**

**对称加密的加密密钥和解密密钥相同。非对称加密的加密密钥和解密密钥不同，加密密钥可以公开而解密密钥需要保密**
### **3. 应用：**
    
常被用在电子商务或者其他需要保证网络传输安全的范围。

### **4. 对称加密：**
     
加密密钥和解密密钥相同的加密算法。

对称加密算法使用起来简单快捷，密钥较短，且破译困难，除了数据加密标准（DES），
另一个对称密钥加密系统是国际数据加密算法（IDEA），它比DES的加密性好，而且对计算机功能要求也没有那么高。IDEA加密标准由PGP（Pretty Good Privacy）系统使用。
#### [**DES:**](https://baike.baidu.com/item/DES)
      
DES全称为Data Encryption Standard，即数据加密标准，是一种使用密钥加密的块算法，现在已经过时。
     
##### 代码实现：

DES算法实现 ：

```java
package com.snailclimb.ks.securityAlgorithm;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.SecretKeyFactory;
import javax.crypto.SecretKey;
import javax.crypto.Cipher;

/**
 * DES加密介绍 DES是一种对称加密算法，所谓对称加密算法即：加密和解密使用相同密钥的算法。DES加密算法出自IBM的研究，
 * 后来被美国政府正式采用，之后开始广泛流传，但是近些年使用越来越少，因为DES使用56位密钥，以现代计算能力，
 * 24小时内即可被破解。虽然如此，在某些简单应用中，我们还是可以使用DES加密算法，本文简单讲解DES的JAVA实现 。
 * 注意：DES加密和解密过程中，密钥长度都必须是8的倍数
 */
public class DesDemo {
	public DesDemo() {
	}

	// 测试
	public static void main(String args[]) {
		// 待加密内容
		String str = "cryptology";
		// 密码，长度要是8的倍数
		String password = "95880288";

		byte[] result;
		try {
			result = DesDemo.encrypt(str.getBytes(), password);
			System.out.println("加密后：" + result);
			byte[] decryResult = DesDemo.decrypt(result, password);
			System.out.println("解密后：" + new String(decryResult));
		} catch (UnsupportedEncodingException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		} catch (Exception e1) {
			e1.printStackTrace();
		}
	}

	// 直接将如上内容解密

	/**
	 * 加密
	 * 
	 * @param datasource
	 *            byte[]
	 * @param password
	 *            String
	 * @return byte[]
	 */
	public static byte[] encrypt(byte[] datasource, String password) {
		try {
			SecureRandom random = new SecureRandom();
			DESKeySpec desKey = new DESKeySpec(password.getBytes());
			// 创建一个密匙工厂，然后用它把DESKeySpec转换成
			SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
			SecretKey securekey = keyFactory.generateSecret(desKey);
			// Cipher对象实际完成加密操作
			Cipher cipher = Cipher.getInstance("DES");
			// 用密匙初始化Cipher对象,ENCRYPT_MODE用于将 Cipher 初始化为加密模式的常量
			cipher.init(Cipher.ENCRYPT_MODE, securekey, random);
			// 现在，获取数据并加密
			// 正式执行加密操作
			return cipher.doFinal(datasource); // 按单部分操作加密或解密数据，或者结束一个多部分操作
		} catch (Throwable e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 解密
	 * 
	 * @param src
	 *            byte[]
	 * @param password
	 *            String
	 * @return byte[]
	 * @throws Exception
	 */
	public static byte[] decrypt(byte[] src, String password) throws Exception {
		// DES算法要求有一个可信任的随机数源
		SecureRandom random = new SecureRandom();
		// 创建一个DESKeySpec对象
		DESKeySpec desKey = new DESKeySpec(password.getBytes());
		// 创建一个密匙工厂
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");// 返回实现指定转换的
																			// Cipher
																			// 对象
		// 将DESKeySpec对象转换成SecretKey对象
		SecretKey securekey = keyFactory.generateSecret(desKey);
		// Cipher对象实际完成解密操作
		Cipher cipher = Cipher.getInstance("DES");
		// 用密匙初始化Cipher对象
		cipher.init(Cipher.DECRYPT_MODE, securekey, random);
		// 真正开始解密操作
		return cipher.doFinal(src);
	}
}
```

结果：

```
加密后：[B@50cbc42f
解密后：cryptology
```

#### [**IDEA:**](https://baike.baidu.com/item/%E5%9B%BD%E9%99%85%E6%95%B0%E6%8D%AE%E5%8A%A0%E5%AF%86%E7%AE%97%E6%B3%95/11048972?fr=aladdin)

- **这种算法是在DES算法的基础上发展出来的，类似于三重DES。**
- **发展IDEA也是因为感到DES具有密钥太短等缺点。**
- **DEA的密钥为128位，这么长的密钥在今后若干年内应该是安全的。**
- **在实际项目中用到的很少了解即可。**

##### 代码实现：

IDEA算法实现

```java
package com.snailclimb.ks.securityAlgorithm;

import java.security.Key;
import java.security.Security;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

public class IDEADemo {
	public static void main(String args[]) {
		bcIDEA();
	}
	public static void bcIDEA() {
	    String src = "www.xttblog.com security idea";
	    try {
	        Security.addProvider(new BouncyCastleProvider());
	         
	        //生成key
	        KeyGenerator keyGenerator = KeyGenerator.getInstance("IDEA");
	        keyGenerator.init(128);
	        SecretKey secretKey = keyGenerator.generateKey();
	        byte[] keyBytes = secretKey.getEncoded();
	         
	        //转换密钥
	        Key key = new SecretKeySpec(keyBytes, "IDEA");
	         
	        //加密
	        Cipher cipher = Cipher.getInstance("IDEA/ECB/ISO10126Padding");
	        cipher.init(Cipher.ENCRYPT_MODE, key);
	        byte[] result = cipher.doFinal(src.getBytes());
	        System.out.println("bc idea encrypt : " + Base64.encodeBase64String(result));
	         
	        //解密
	        cipher.init(Cipher.DECRYPT_MODE, key);
	        result = cipher.doFinal(result);
	        System.out.println("bc idea decrypt : " + new String(result));
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
}

```

### **5. 非对称加密：**

- 与对称加密算法不同，非对称加密算法需要两个密钥：公开密钥（publickey）和私有密钥 （privatekey）。
- 公开密钥与私有密钥是一对，如果用公开密钥对数据进行加密，只有用对应的私有密钥才能解密；    
- 如果用私有密钥对数据进行加密，那么只有用对应的公开密钥才能解密。
- 因为加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密算法。
#### [**RAS:**](https://baike.baidu.com/item/DES)
      
RSA是目前最有影响力和最常用的公钥加密算法。它能够抵抗到目前为止已知的绝大多数密码攻击，已被ISO推荐为公钥数据加密标准。
     
##### 代码实现：

RAS算法实现：

```java
package com.snailclimb.ks.securityAlgorithm;

import org.apache.commons.codec.binary.Base64;

import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Cipher;

/**
 * Created by humf.需要依赖 commons-codec 包
 */
public class RSADemo {

	public static void main(String[] args) throws Exception {
		Map<String, Key> keyMap = initKey();
		String publicKey = getPublicKey(keyMap);
		String privateKey = getPrivateKey(keyMap);

		System.out.println(keyMap);
		System.out.println("-----------------------------------");
		System.out.println(publicKey);
		System.out.println("-----------------------------------");
		System.out.println(privateKey);
		System.out.println("-----------------------------------");
		byte[] encryptByPrivateKey = encryptByPrivateKey("123456".getBytes(), privateKey);
		byte[] encryptByPublicKey = encryptByPublicKey("123456", publicKey);
		System.out.println(encryptByPrivateKey);
		System.out.println("-----------------------------------");
		System.out.println(encryptByPublicKey);
		System.out.println("-----------------------------------");
		String sign = sign(encryptByPrivateKey, privateKey);
		System.out.println(sign);
		System.out.println("-----------------------------------");
		boolean verify = verify(encryptByPrivateKey, publicKey, sign);
		System.out.println(verify);
		System.out.println("-----------------------------------");
		byte[] decryptByPublicKey = decryptByPublicKey(encryptByPrivateKey, publicKey);
		byte[] decryptByPrivateKey = decryptByPrivateKey(encryptByPublicKey, privateKey);
		System.out.println(decryptByPublicKey);
		System.out.println("-----------------------------------");
		System.out.println(decryptByPrivateKey);

	}

	public static final String KEY_ALGORITHM = "RSA";
	public static final String SIGNATURE_ALGORITHM = "MD5withRSA";

	private static final String PUBLIC_KEY = "RSAPublicKey";
	private static final String PRIVATE_KEY = "RSAPrivateKey";

	public static byte[] decryptBASE64(String key) {
		return Base64.decodeBase64(key);
	}

	public static String encryptBASE64(byte[] bytes) {
		return Base64.encodeBase64String(bytes);
	}

	/**
	 * 用私钥对信息生成数字签名
	 *
	 * @param data
	 *            加密数据
	 * @param privateKey
	 *            私钥
	 * @return
	 * @throws Exception
	 */
	public static String sign(byte[] data, String privateKey) throws Exception {
		// 解密由base64编码的私钥
		byte[] keyBytes = decryptBASE64(privateKey);
		// 构造PKCS8EncodedKeySpec对象
		PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
		// KEY_ALGORITHM 指定的加密算法
		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
		// 取私钥匙对象
		PrivateKey priKey = keyFactory.generatePrivate(pkcs8KeySpec);
		// 用私钥对信息生成数字签名
		Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
		signature.initSign(priKey);
		signature.update(data);
		return encryptBASE64(signature.sign());
	}

	/**
	 * 校验数字签名
	 *
	 * @param data
	 *            加密数据
	 * @param publicKey
	 *            公钥
	 * @param sign
	 *            数字签名
	 * @return 校验成功返回true 失败返回false
	 * @throws Exception
	 */
	public static boolean verify(byte[] data, String publicKey, String sign) throws Exception {
		// 解密由base64编码的公钥
		byte[] keyBytes = decryptBASE64(publicKey);
		// 构造X509EncodedKeySpec对象
		X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
		// KEY_ALGORITHM 指定的加密算法
		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
		// 取公钥匙对象
		PublicKey pubKey = keyFactory.generatePublic(keySpec);
		Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
		signature.initVerify(pubKey);
		signature.update(data);
		// 验证签名是否正常
		return signature.verify(decryptBASE64(sign));
	}

	public static byte[] decryptByPrivateKey(byte[] data, String key) throws Exception {
		// 对密钥解密
		byte[] keyBytes = decryptBASE64(key);
		// 取得私钥
		PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
		Key privateKey = keyFactory.generatePrivate(pkcs8KeySpec);
		// 对数据解密
		Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
		cipher.init(Cipher.DECRYPT_MODE, privateKey);
		return cipher.doFinal(data);
	}

	/**
	 * 解密<br>
	 * 用私钥解密
	 *
	 * @param data
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static byte[] decryptByPrivateKey(String data, String key) throws Exception {
		return decryptByPrivateKey(decryptBASE64(data), key);
	}

	/**
	 * 解密<br>
	 * 用公钥解密
	 *
	 * @param data
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static byte[] decryptByPublicKey(byte[] data, String key) throws Exception {
		// 对密钥解密
		byte[] keyBytes = decryptBASE64(key);
		// 取得公钥
		X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
		Key publicKey = keyFactory.generatePublic(x509KeySpec);
		// 对数据解密
		Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
		cipher.init(Cipher.DECRYPT_MODE, publicKey);
		return cipher.doFinal(data);
	}

	/**
	 * 加密<br>
	 * 用公钥加密
	 *
	 * @param data
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static byte[] encryptByPublicKey(String data, String key) throws Exception {
		// 对公钥解密
		byte[] keyBytes = decryptBASE64(key);
		// 取得公钥
		X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
		Key publicKey = keyFactory.generatePublic(x509KeySpec);
		// 对数据加密
		Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
		cipher.init(Cipher.ENCRYPT_MODE, publicKey);
		return cipher.doFinal(data.getBytes());
	}

	/**
	 * 加密<br>
	 * 用私钥加密
	 *
	 * @param data
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static byte[] encryptByPrivateKey(byte[] data, String key) throws Exception {
		// 对密钥解密
		byte[] keyBytes = decryptBASE64(key);
		// 取得私钥
		PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
		Key privateKey = keyFactory.generatePrivate(pkcs8KeySpec);
		// 对数据加密
		Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
		cipher.init(Cipher.ENCRYPT_MODE, privateKey);
		return cipher.doFinal(data);
	}

	/**
	 * 取得私钥
	 *
	 * @param keyMap
	 * @return
	 * @throws Exception
	 */
	public static String getPrivateKey(Map<String, Key> keyMap) throws Exception {
		Key key = (Key) keyMap.get(PRIVATE_KEY);
		return encryptBASE64(key.getEncoded());
	}

	/**
	 * 取得公钥
	 *
	 * @param keyMap
	 * @return
	 * @throws Exception
	 */
	public static String getPublicKey(Map<String, Key> keyMap) throws Exception {
		Key key = keyMap.get(PUBLIC_KEY);
		return encryptBASE64(key.getEncoded());
	}

	/**
	 * 初始化密钥
	 *
	 * @return
	 * @throws Exception
	 */
	public static Map<String, Key> initKey() throws Exception {
		KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(KEY_ALGORITHM);
		keyPairGen.initialize(1024);
		KeyPair keyPair = keyPairGen.generateKeyPair();
		Map<String, Key> keyMap = new HashMap(2);
		keyMap.put(PUBLIC_KEY, keyPair.getPublic());// 公钥
		keyMap.put(PRIVATE_KEY, keyPair.getPrivate());// 私钥
		return keyMap;
	}

}
```

结果：

```
{RSAPublicKey=Sun RSA public key, 1024 bits
  modulus: 115328826086047873902606456571034976538836553998745367981848911677968062571831626674499650854318207280419960767020601253071739555161388135589487284843845439403614883967713749605268831336418001722701924537624573180276356615050309809260289965219855862692230362893996010057188170525719351126759886050891484226169
  public exponent: 65537, RSAPrivateKey=sun.security.rsa.RSAPrivateCrtKeyImpl@93479}
-----------------------------------
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCkO9PBTOFJQTkzznALN62PU7ixd9YFjXrt2dPOGj3wwhymbOU8HLoCztjwpLXHgbpBUJlGmbURV955M1BkZ1kr5dkZYR5x1gO4xOnu8rEipy4AAMcpFttfiarIZrtzL9pKEvEOxABltVN4yzFDr3IjBqY46aHna7YjwhXI0xHieQIDAQAB
-----------------------------------
MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAKQ708FM4UlBOTPOcAs3rY9TuLF31gWNeu3Z084aPfDCHKZs5TwcugLO2PCktceBukFQmUaZtRFX3nkzUGRnWSvl2RlhHnHWA7jE6e7ysSKnLgAAxykW21+Jqshmu3Mv2koS8Q7EAGW1U3jLMUOvciMGpjjpoedrtiPCFcjTEeJ5AgMBAAECgYAK4sxOa8IjEOexv2U92Rrv/SSo3sCY7Z/QVDft2V9xrewoO9+V9HF/7iYDDWffKYInAiimvVl7JM/iSLxza0ZFv29VMpyDcr4TigYmWwBlk7ZbxSTkqLdNwxxldMmEoTn1py53MUm+1V1K3rzNvJjuZaZFAevU7vUnwQwD+JGQYQJBAM9HBaC+dF3PJ2mkXekHpDS1ZPaSFdrdzd/GvHFi/cJAMM+Uz6PmpkosNXRtOpSYWwlOMRamLZtrHhfQoqSk3S8CQQDK1qL1jGvVdqw5OjqxktR7MmOsWUVZdWiBN+6ojxBgA0yVn0n7vkdAAgEZBj89WG0VHPEu3hd4AgXFZHDfXeDXAkBvSn7nE9t/Et7ihfI2UHgGJO8UxNMfNMB5Skebyb7eMYEDs67ZHdpjMOFypcMyTatzj5wjwQ3zyMvblZX+ONbZAkAX4ysRy9WvL+icXLUo0Gfhkk+WrnSyUldaUGH0y9Rb2kecn0OxN/lgGlxSvB+ac910zRHCOTl+Uo6nbmq0g3PFAkAyqA4eT7G9GXfncakgW1Kdkn72w/ODpozgfhTLNX0SGw1ITML3c4THTtH5h3zLi3AF9zJO2O+K6ajRbV0szHHI
-----------------------------------
[B@387c703b
-----------------------------------
[B@224aed64
-----------------------------------
la4Hc4n/UbeBu0z9iLRuwKVv014SiOJMXkO5qdJvKBsw0MlnsrM+89a3p73yMrb1dAnCU/2kgO0PtFpvmG8pzxTe1u/5nX/25iIyUXALlwVRptJyjzFE83g2IX0XEv/Dxqr1RCRcrMHOLQM0oBoxZCaChmyw1Ub4wsSs6Ndxb9M=
-----------------------------------
true
-----------------------------------
[B@c39f790
-----------------------------------
[B@71e7a66b

```
