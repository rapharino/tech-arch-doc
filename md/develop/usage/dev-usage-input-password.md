## Input Password防止自动填充
> 在项目中常需要修改或者填写密码，假设浏览器已经记住密码，常会通过autocomplete=off设置放置自动填充type=password的字段。但是大多数情况这样设置是无效的。 @pdai

### 防止Password 自动填充
autocomplete的含义，官网参考如下：

https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#Values

在autocomplete的文档中说明了value为off时，浏览器禁止给当前字段自动的输入或者选中一个值，但下方Note言明：在大多数现代浏览器中，off 值不能阻止浏览器的密码管理工具自动填充.

#### 方式一 : 动态设置密码 input 标签 type
```html
<input type="text" onfocus="this.type='password'"></input>
```
这样设置 可以保证用户在点击密码框之前，避免浏览器识别为登录表单、自动填充。

浏览器是如何判断当前表单需要 autocomplete，浏览器自动保存表单是当前 form 存在 type 为 password 的input、且该 input 为表单中的第二个 input 输入框。

所以，这里给 password 设置初始 type 为 text，在用户 点击 input 聚焦后 设置 type 为 password ，避免浏览器在 页面 onload 之后判断登录表单进行回填。这样可以解决大部分场景下对于避免回填的需要。然而我们的业务需要 依据跳转链接中的 param 给用户填充 密码，这就导致了在用户 主动 focus 之前，密码会被明文展示，聚焦后又会隐藏，操作体验不佳；

#### 方式二 : page.onload 后 js 控制 input type
方法同上，问题点在于 页面load 后手动设置 input type 为 password，而后根据 page url 参数 填充表单。

但存在问题是 浏览器填充的时机无法控制，导致业务填充表单被自动填充覆盖；方案pass；

#### 方式三： new-password
autocomplete 除了 on、off 之外，还有很多参数：name、email、username、new-password、current-password、street-address 等等；

当 input type 为 password 但 autocomplete 为 new-password， 即可解决浏览器自动填充问题，浏览器将当前输入框识别为新密码，便不会自阿东填充值。（PS：有例子提到，设置 autocomplete 为一个 任意字符串 ，也能达到相同效果，大家可以试一下）

### 参考
+ https://segmentfault.com/a/1190000016679094

+ https://segmentfault.com/q/1010000006090445?_ea=1009491

+ https://www.tuicool.com/articles/zMRrAzu