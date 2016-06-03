
---
title: 【基础进阶】URL详解与URL编码
date: 2015-12-21 10:08:00
keywords: URL, URI, URL格式, URL编码, escape, encodeURI, encodeURIComponent, 端口, URL解析
tags: [URL, 编码技巧]
---
作为前端，每日与 URL 打交道是必不可少的。但是也许每天只是单纯的用，对其只是一知半解，随着工作的展开，我发现在日常抓包调试，接口调用，浏览器兼容等许多方面，不深入去理解URL与URL编码则会踩到很多坑。故写下此篇文章，详解一下 URL 。<!-- more -->

## URL 与 URI

很多人会混淆这两个名词。

URL：(Uniform/Universal Resource Locator 的缩写，统一资源定位符)。

URI：(Uniform Resource Identifier 的缩写，统一资源标识符)。

关系：

URI 属于 URL 更低层次的抽象，一种字符串文本标准。

就是说，URI 属于父类，而 URL 属于 URI 的子类。URL 是 URI 的一个子集。

二者的区别在于，URI 表示请求服务器的路径，定义这么一个资源。而 URL 同时说明要如何访问这个资源（http://）。

## 端口 与 URL标准格式

何为端口？端口(Port)，相当于一种数据的传输通道。用于接受某些数据，然后传输给相应的服务，而电脑将这些数据处理后，再将相应的回复通过开启的端口传给对方。

端口的作用：因为 IP 地址与网络服务的关系是一对多的关系。所以实际上因特网上是通过 IP 地址加上端口号来区分不同的服务的。

端口是通过端口号来标记的，端口号只有整数，范围是从0 到65535。

#### URL 标准格式

通常而言，我们所熟悉的 URL 的常见定义格式为：
```javascript

scheme://host[:port#]/path/.../[;url-params][?query-string][#anchor]
scheme //有我们很熟悉的http、https、ftp以及著名的ed2k，迅雷的thunder等。
host   //HTTP服务器的IP地址或者域名
port#  //HTTP服务器的默认端口是80，这种情况下端口号可以省略。如果使用了别的端口，必须指明，例如tomcat的默认端口是8080 http://localhost:8080/
path   //访问资源的路径
url-params  //所带参数
query-string    //发送给http服务器的数据
anchor //锚点定位
```

## 利用 a 标签自动解析 url

开发当中一个很常见的场景是，需要从 URL 中提取一些需要的元素，譬如 host 、 请求参数等等。

通常的做法是写正则去匹配相应的字段，当然，这里要安利下述这种方法，来自 [James](http://james.padolsey.com/javascript/parsing-urls-with-the-dom/) 的 blog，原理是动态创建一个 a 标签，利用浏览器的一些原生方法及一些正则（为了健壮性正则还是要的），完美解析 URL ，获取我们想要的任意一个部分。

代码如下：
```javascript
// This function creates a new anchor element and uses location
// properties (inherent) to get the desired URL data. Some String
// operations are used (to normalize results across browsers).

function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/([^/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^/])/,'/$1'),
        relative: (a.href.match(/tps?:\/[^/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}
```

Usage 使用方法：
```javascript
var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&amp;m=hello#top');

myURL.file;     // = 'index.html'
myURL.hash;     // = 'top'
myURL.host;     // = 'abc.com'
myURL.query;    // = '?id=255&amp;m=hello'
myURL.params;   // = Object = { id: 255, m: hello }
myURL.path;     // = '/dir/index.html'
myURL.segments; // = Array = ['dir', 'index.html']
myURL.port;     // = '8080'
myURL.protocol; // = 'http'
myURL.source;   // = 'http://abc.com:8080/dir/index.html?id=255
```

利用上述方法，即可解析得到 URL 的任意部分。

## URL 编码

为什么要进行URL编码？通常如果一样东西需要编码，说明这样东西并不适合直接进行传输。

+ 会引起歧义：例如 URL 参数字符串中使用 key=value 这样的键值对形式来传参，键值对之间以 &amp; 符号分隔，如 ?postid=5038412&amp;t=1450591802326，服务器会根据参数串的 &amp; 和 = 对参数进行解析，如果 value 字符串中包含了 = 或者 &amp; ，如宝洁公司的简称为P&amp;G，假设需要当做参数去传递，那么可能URL所带参数可能会是这样 ?name=P&amp;G&amp;t=1450591802326，因为参数中多了一个&amp;势必会造成接收 URL 的服务器解析错误，因此必须将引起歧义的 &amp; 和 = 符号进行转义， 也就是对其进行编码。

+ 非法字符：又如，URL 的编码格式采用的是 ASCII 码，而不是 Unicode，这也就是说你不能在 URL 中包含任何非 ASCII 字符，例如中文。否则如果客户端浏览器和服务端浏览器支持的字符集不同的情况下，中文可能会造成问题。

那么如何编码？如下：

## escape 、 encodeURI 、encodeURIComponent 

### escape()

首先想声明的是，W3C把这个函数废弃了，身为一名前端如果还用这个函数是要打脸的。

escape只是对字符串进行编码（而其余两种是对URL进行编码），与URL编码无关。编码之后的效果是以 %XX 或者 %uXXXX 这种形式呈现的。它不会对 ASCII字符、数字 以及 @ * / + 进行编码。

根据 MDN 的说明，escape 应当换用为 encodeURI 或 encodeURIComponent；unescape 应当换用为 decodeURI 或 decodeURIComponent。escape 应该避免使用。举例如下：
```javascript
encodeURI('https://www.baidu.com/ a b c')
// "https://www.baidu.com/%20a%20b%20c"
encodeURIComponent('https://www.baidu.com/ a b c')
// "https%3A%2F%2Fwww.baidu.com%2F%20a%20b%20c"

//而 escape 会编码成下面这样，eocode 了冒号却没 encode 斜杠，十分怪异，故废弃之
escape('https://www.baidu.com/ a b c')
// "https%3A//www.baidu.com/%20a%20b%20c"　
```

### encodeURI()

encodeURI() 是 Javascript 中真正用来对 URL 编码的函数。它着眼于对整个URL进行编码。
```javascript
encodeURI("http://www.cnblogs.com/season-huang/some other thing");
//"http://www.cnblogs.com/season-huang/some%20other%20thing";
```

编码后变为上述结果，可以看到空格被编码成了%20，而斜杠 / ，冒号 : 并没有被编码。

是的，它用于对整个 URL 直接编码，不会对 ASCII字母 、数字 、 ~ ! @ # $ &amp; * ( ) = : / , ; ? + ' 进行编码。
```javascript
encodeURI("~!@#$&amp;*()=:/,;?+'")
// ~!@#$&amp;*()=:/,;?+'
```

## encodeURIComponent()

嘿，有的时候，我们的 URL 长这样子，请求参数中带了另一个 URL ：
```javascript
var URL = "http://www.a.com?foo=http://www.b.com?t=123&amp;s=456";
```

直接对它进行 encodeURI 显然是不行的。因为 encodeURI 不会对冒号 : 及斜杠 / 进行转义，那么就会出现上述所说的服务器接受到之后解析会有歧义。
```javascript
encodeURI(URL)
// "http://www.a.com?foo=http://www.b.com?t=123
```

这个时候，就该用到 encodeURIComponent() 。它的作用是对 URL 中的参数进行编码，记住是对参数，而不是对整个 URL 进行编码。

因为它仅仅不对 ASCII字母、数字 ~ ! * ( ) '  进行编码。

#### 错误的用法：
```javascript
var URL = "http://www.a.com?foo=http://www.b.com?t=123&amp;s=456";
encodeURIComponent(URL);
// "http%3A%2F%2Fwww.a.com%3Ffoo%3Dhttp%3A%2F%2Fwww.b.com%3Ft%3D123%26s%3D456"
// 错误的用法，看到第一个 http 的冒号及斜杠也被 encode 了
```

#### 正确的用法：encodeURIComponent() 着眼于对单个的参数进行编码：
```javascript
var param = "http://www.b.com?t=123&amp;s=456"; // 要被编码的参数
URL = "http://www.a.com?foo="+encodeURIComponent(param);
//"http://www.a.com?foo=http%3A%2F%2Fwww.b.com%3Ft%3D123%26s%3D456"
```

利用上述的使用 a 标签解析 URL 以及根据业务场景配合 encodeURI() 与 encodeURIComponent() 便能够很好的处理 URL 的编码问题

应用场景最常见的一个是手工拼接 URL 的时候，对每对 key-value 用 encodeURIComponent 进行转义，再进行传输。

原创文章，文笔有限，才疏学浅，文中若有不正之处，万望告知。
