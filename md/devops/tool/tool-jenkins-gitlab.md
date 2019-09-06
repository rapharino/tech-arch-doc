# Jenkins+Gitlab实现自动化部署

> 我在尝试在容器中安装Jenkins时，初衷是希望使用docker in docker 的模式来实现Jenkins slave容器按需创建。在实现的时候需要在Jenkins 中安装Kubernetes插件。
> kubernetes的插件目前来看存在一个Bug，这个bug很小但是会导致我们无法设置和kubernetes mastert认证的机制。Bug是由于配置代理时候是用的IP地址，但是jenkins必须加入http协议，可惜的是加入http协议后更新的代理又不能使用了，进入这种死循环了。所以这种方案暂时搁置。



So，这里我会写常用的实现自动化部署的方案之Jenkins+Gitlab这种模式，在小型的开发时候完全够用了，从来没有一致的最佳方案，只有适不适合咱们的团队方案。


## Jenkins的安装
RedHat Linux RPM packages for Jenkins - https://pkg.jenkins.io/redhat-stable/

To use this repository, run the following command:
```bash
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
```
If you've previously imported the key from Jenkins, the "rpm --import" will fail because you already have a key. Please ignore that and move on.

You will need to explicitly install a Java runtime environment, because Oracle's Java RPMs are incorrect and fail to register as providing a java dependency. Thus, adding an explicit dependency requirement on Java would force installation of the OpenJDK JVM.

2.54 (2017-04) and newer: Java 8
1.612 (2015-05) and newer: Java 7
With that set up, the Jenkins package can be installed with:
```bash
yum install jenkins
```
See Wiki for more information, including how Jenkins is run and where the configuration is stored, etc.

## Gitlab的安装
自己网上找吧，但是安装8.0+的版本，因为后面webhooks是有版本的要求的。

## 自动化部署配置

### 创建普通编译Job
#### Jenkins创建一个Job，并配置git信息

![](/_images/jenkins_gitlab/ci_action_jenkins_gitlab_4.png)

> 注意，这里连接Gitlab需要配置认证

![](/_images/jenkins_gitlab/ci_action_jenkins_gitlab_8.png)

> 同时，保证jenkins机器安装了Java， maven。

Maven 中需要配置成我们自己的仓库，配置settings.xm即可。
```bash
[root@jenkins ~]# find / -name settings.xml
/etc/maven/settings.xml
/var/lib/jenkins/.m2/settings.xml
/usr/share/maven/conf/settings.xml
[root@jenkins ~]# cat /usr/share/maven/conf/settings.xml
```

#### 更改成公司artificatory配置
```bash
   <mirror>
      <id>mirrorId_2</id>
      <mirrorOf>*</mirrorOf>
      <name>Human Readable Name for this Mirror.</name>
      <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    </mirror>-->
   <mirror>
      <id>mirrorId_1</id>
      <mirrorOf>*</mirrorOf>
      <name>Human Readable Name for this Mirror.</name>
      <url>http://139.24.120.251:58086/artifactory/list/maven2/</url>
    </mirror>
```

### 加入CI Trigger功能
#### Jenkins Trigger配置

![](/_images/jenkins_gitlab/ci_action_jenkins_gitlab_3.png)

#### Gitlab配置webhook

![](/_images/jenkins_gitlab/ci_action_jenkins_gitlab_1.png)

#### 测试webhook：

![](/_images/jenkins_gitlab/ci_action_jenkins_gitlab_2.png)



### 加入CD功能
#### 自动化运行脚本编写
```bash
[root@jenkins ~]# cat run.sh
#!/bin/bash
echo 'Checking scic document system status...'
SCIC_APP_PID=$(ps -ef | grep scic_paas_doc | grep -v grep | awk '{ print $2 }')
if [ -z "$SCIC_APP_PID" ]
  then
      echo Starting scic document...
      nohup java -jar scic_paas_doc-0.0.1-RELEASE.jar > doc.log 2>&1 &
      echo Started successfully.
else
    echo killing old service -  $SCIC_APP_PID ...
    kill $SCIC_APP_PID
    echo Restarting scic document...
    nohup java -jar scic_paas_doc-0.0.1-RELEASE.jar > doc.log 2>&1 &
    echo Restarted successfully.
fi
```

#### Global配置SSH Server

![](/_images/jenkins_gitlab/ci_action_jenkins_gitlab_7.png)


#### Build Job中配置PostBuild，Over SSH

通过SSH上传jar，并使用脚本运行

![](/_images/jenkins_gitlab/ci_action_jenkins_gitlab_5.png)

#### 更新并提交代码

```bash
Z003MRZB@AAECNSHA02921L MINGW64 /d/git/k8s/scic_paas_doc (master)
$ git add .
warning: LF will be replaced by CRLF in src/main/resources/static/_sidebar.md.
The file will have its original line endings in your working directory.

Z003MRZB@AAECNSHA02921L MINGW64 /d/git/k8s/scic_paas_doc (master)
$ git commit
warning: LF will be replaced by CRLF in src/main/resources/static/_sidebar.md.
The file will have its original line endings in your working directory.
[master warning: LF will be replaced by CRLF in src/main/resources/static/_sidebar.md.
The file will have its original line endings in your working directory.
50c1cc4] test trigger
warning: LF will be replaced by CRLF in src/main/resources/static/_sidebar.md.
The file will have its original line endings in your working directory.
 1 file changed, 1 insertion(+), 1 deletion(-)

Z003MRZB@AAECNSHA02921L MINGW64 /d/git/k8s/scic_paas_doc (master)
$ git push
Counting objects: 7, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (6/6), done.
Writing objects: 100% (7/7), 499 bytes | 0 bytes/s, done.
Total 7 (delta 5), reused 0 (delta 0)
To git@10.192.29.91:k8s_test/scic_paas_doc.git
   63b8ff4..50c1cc4  master -> master
```
#### 触发编译和自动化部署

![](/_images/jenkins_gitlab/ci_action_jenkins_gitlab_6.png)

#### Tigger Build Logs

```bash
Started by GitLab push by daipeng
Building in workspace /var/lib/jenkins/workspace/SCIC_DOC_TRIGGER_BUILD
 > git rev-parse --is-inside-work-tree # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url git@10.192.29.91:k8s_test/scic_paas_doc.git # timeout=10
Fetching upstream changes from git@10.192.29.91:k8s_test/scic_paas_doc.git
 > git --version # timeout=10
using GIT_SSH to set credentials jenkins master server key
 > git fetch --tags --progress git@10.192.29.91:k8s_test/scic_paas_doc.git +refs/heads/*:refs/remotes/origin/*
 > git rev-parse remotes/origin/master^{commit} # timeout=10
 > git branch -a -v --no-abbrev --contains 50c1cc4499394d70919a470db5961cec00e65457 # timeout=10
Checking out Revision 50c1cc4499394d70919a470db5961cec00e65457 (origin/master)
Commit message: "test trigger"
 > git config core.sparsecheckout # timeout=10
 > git checkout -f 50c1cc4499394d70919a470db5961cec00e65457
 > git rev-list 99d919b08d5a2010fe750d4d920a10024401bc92 # timeout=10
[SCIC_DOC_TRIGGER_BUILD] $ /bin/sh -xe /tmp/jenkins3779972667920467885.sh
+ mvn package
[INFO] Scanning for projects...
[INFO]                                                                         
[INFO] ------------------------------------------------------------------------
[INFO] Building pass_doc 0.0.1-RELEASE
[INFO] ------------------------------------------------------------------------
[INFO] 
[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ scic_paas_doc ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 1 resource
[INFO] Copying 71 resources
[INFO] 
[INFO] --- maven-compiler-plugin:3.1:compile (default-compile) @ scic_paas_doc ---
[INFO] Nothing to compile - all classes are up to date
[INFO] 
[INFO] --- maven-resources-plugin:2.6:testResources (default-testResources) @ scic_paas_doc ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /var/lib/jenkins/workspace/SCIC_DOC_TRIGGER_BUILD/src/test/resources
[INFO] 
[INFO] --- maven-compiler-plugin:3.1:testCompile (default-testCompile) @ scic_paas_doc ---
[INFO] No sources to compile
[INFO] 
[INFO] --- maven-surefire-plugin:2.18.1:test (default-test) @ scic_paas_doc ---
[INFO] No tests to run.
[INFO] 
[INFO] --- maven-jar-plugin:2.6:jar (default-jar) @ scic_paas_doc ---
[INFO] Building jar: /var/lib/jenkins/workspace/SCIC_DOC_TRIGGER_BUILD/target/scic_paas_doc-0.0.1-RELEASE.jar
[INFO] 
[INFO] --- spring-boot-maven-plugin:1.4.1.RELEASE:repackage (default) @ scic_paas_doc ---
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 3.695s
[INFO] Finished at: Fri Jul 28 09:15:43 CST 2017
[INFO] Final Memory: 16M/237M
[INFO] ------------------------------------------------------------------------
SSH: Connecting from host [jenkins]
SSH: Connecting with configuration [PAAS_DOC_SERVER_200] ...
SSH: EXEC: STDOUT/STDERR from command [/root/run.sh] ...
Checking scic document system status...
killing old service - 19970 ...
Restarting scic document...
Restarted successfully.
SSH: EXEC: completed after 200 ms
SSH: Disconnecting configuration [PAAS_DOC_SERVER_200] ...
SSH: Transferred 1 file(s)
Finished: SUCCESS
```

#### 查看网站更新

发现确实已经更新 啦。

## 参考文档

https://jenkins.io/doc/pipeline/tour/hello-world/

https://jenkins.io/user-handbook.pdf

http://www.cnblogs.com/kevingrace/p/5651447.html

http://www.cnblogs.com/ceshi2016/p/6529557.html

http://linuxsogood.org/1539.html

http://www.mamicode.com/info-detail-1264849.html

http://blog.didispace.com/spring-boot-run-backend/




