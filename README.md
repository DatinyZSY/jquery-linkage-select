# 基于jquery的联动下拉框组件

## 用法
1. 在页面中加入jquery和联动下拉组件的脚本    
`<script src="pathTo/jquery.js"></script>`    
`<script src="pathTo/jquery-linkage-select.js"></script>`
1. 初始化
```
$(selector).linkage({
	url: Function/urlString,// 如果数据是异步的,数据的请求地址，可以是字符串或生成url地址的函数
	data: data, // 如果数据是同步的
	/* 格式化data。
	格式化后返回的数据形如[{value:XXX,text:XXX}]。其中value为option的value,text为option的显示文本。
	@param data在同步时即为传入的data。异步时为异步返回的data。
	@param selectedVal为前一个联动框的value
	*/
    format: function(data, selectedVal) {},
    afterRender: function($sel) {//select渲染好之后的回调
        console.log('prov rendered!', $sel);
    },
    next: $(nextSel).linkage(options),// 联动的下一个框。
    isRoot: Boolean,// 是否是联动的第一个框。默认是false。
    forceEmpty: Boolean,//渲染select时，是否清空，默认为true
    initOpt: '<option value="">不限</option>'// select的初始值
});
```
更多见[demo](./demo/basic.html)