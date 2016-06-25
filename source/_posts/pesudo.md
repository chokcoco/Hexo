---
title: 【CSS进阶】伪元素的妙用--单标签之美
date: 2016-05-25 20:48:34
keywords: 伪元素, 伪类与伪元素, :before, :afrer, 单标签动画, 单标签图案, CSS3单标签, single element
tags: CSS
---

最近在研读 [《CSS SECRET》](https://github.com/cssmagic/CSS-Secrets)（CSS揭秘）这本大作，对 CSS 有了更深层次的理解，折腾了下面这个项目：

[CSS3奇思妙想 -- Demo](http://chokcoco.github.io/magicCss/html/index.html) （请用 Chrome 浏览器打开，非常值得一看）。采用单标签完成各种图案，许多图案与本文有关。

也希望觉得不错的同学顺手在我的 Github 点个 star ： [CSS3奇思妙想](https://github.com/chokcoco/magicCss) 。

正文从这里开始，本文主要讲述一下 伪元素 before 和 after 各种妙用。<!-- more -->

## :before和::before的区别

在介绍具体用法之前，简单介绍下伪类和伪元素。伪类大家听的多了，伪元素可能听到的不是那么频繁，其实 CSS 对这两个是有区分的。

![CSS2及CSS3伪类区分](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525201157756-1649209290.png)![CSS3伪元素单双冒号区分](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525201206803-893466836.png)

有时你会发现伪类元素使用了两个冒号 (::) 而不是一个冒号 (:)，这是 CSS3 规范中的一部分要求，目的是为了区分伪类和伪元素，大多数浏览器都支持这两种表示方式。
```CSS
#id:after{
 ...
}
#id::after{
 ...
}
```

单冒号(:)用于 CSS3 伪类，双冒号(::)用于 CSS3 伪元素。对于 CSS2 中已经有的伪元素，例如 :before，单冒号和双冒号的写法 ::before 作用是一样的。

所以，如果你的网站只需要兼容 webkit、firefox、opera 等浏览器，建议对于伪元素采用双冒号的写法，如果不得不兼容 IE 浏览器，还是用 CSS2 的单冒号写法比较安全。

更加具体的信息，可以看看 MDN 对[伪类](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes)和[伪元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements)的理解。
本文的主角就是伪元素 before 和 after ，下面将具体讲讲这两个伪元素的魅力。 

## 利用 after 清除浮动

这个估计是前端都知道，运用 after 伪元素清除页面浮动，不做过多解释。
```javascript
.clearfix:after {content:"."; display:block; height:0; visibility:hidden; clear:both; }
.clearfix { *zoom:1; }
```

## 伪元素与 css sprites 雪碧图

这个也是老姿势了。雪碧图大家应该也不陌生，通过将多个图片 icon 合为一张图，从而为了减少 http 请求，很多网站对雪碧图的需求还是很大的。

但是在制作雪碧图的过程中，或者现在很多的打包工具自动生成的雪碧图，都存在着需要为每个 icon 需要预留多少边距的问题。看看下图：

![](file:///C:/Users/Administrator/AppData/Local/YNote/data/rocqiaoqi@163.com/e456abe17fff4aa8a3c76ce4a5169433/1.png)![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525201715991-1390458301.png)--&gt; ![](file:///C:/Users/Administrator/AppData/Local/YNote/data/rocqiaoqi@163.com/26daa1cd95cd4fb6b6b1adba06e0eb12/clipboard.png)![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525201736131-681121190.png)

譬如上面这种情况（假设按钮中的图标是采用了雪碧图），产品某天突然要求按钮从状态左变为状态右，那么雪碧图原先预留的位置边距肯定就不够了，导致其他图形出现在按钮中。

而我们通常不会为了一个小 icon 多添加一个标签（不符合语义化）。

所以通常这种情况需要用到雪碧图的话，都是在按钮中设置一个伪元素，将伪元素的高宽设置为原本 icon 的大小，再利用绝对定位定位到需要的地方，这样无论雪碧图每个 icon 的边距是多少，都能够完美适应。
 

## 单个颜色实现按钮 hover 、active 的明暗变化

最近项目有个这样的需求，根据不同的业务场景，运营需要配置一个按钮的不同背景色值。但是我们知道，一个按钮通常而言是有 3 个色值的，normal 状态的，hover 状态的和 active 状态的，通常 hover 是比原色稍微亮一点，active 则是稍微暗一点。

大概是这样（下图）：

![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525201857444-1776941861.gif)

![](file:///C:/Users/Administrator/AppData/Local/YNote/data/rocqiaoqi@163.com/102a5540846042eca24090baee7e05ff/btnhoveractive.gif)

为了减轻运营同学的负担，怎么样做到只配置一个背景色不配置 hover 和 active 颜色让按钮也能自适应跟随变化呢。是的，用上 before、after 两个伪元素可以做到。

### 颜色小知识

这里要科普一下颜色值的小知识。我们熟知的颜色表示法除了 #fff ，rgb(255,255,255)，还有 hsl(0, 100%, 100%)（HSV）。 

以 HSL 为例，它是一种将 RGB 色彩模型中的点在圆柱坐标系中的表示法。HSL 即色相、饱和度、亮度。

对于一个使用 HSL 表示的颜色，我们只需要改变 L （亮度）的值，就可以得到一个更亮一点或者更暗一点的颜色。

当然改变亮度，还可以通过叠加透明层实现，这里使用伪元素改变按钮背景色就是通过叠加半透明层实现。

简单来说，在背景色上方叠加一个白色半透明层 rgba(255,255,255,.2) 可以得到一个更亮的颜色。（这句话不是很严谨，假设一个元素背景是纯白颜色，叠加白色半透明层也是不会更亮的）

反之，在背景色上方叠加一个黑色半透明层 rgba(0,0,0,.2) 可以得到一个更暗的颜色。

所以，我们用 before 伪元素生成一个与按钮大小一致的黑色半透明层 rgba(0,0,0,.2)，在 .btn:hover:before 时显示，用 after 伪元素生成一个与按钮大小一致的白色半透明层 rgba(255,255,255,.2)，在 .btn:active:before 时显示，就可以做到只配置一个背景底色，实现 hover 、active 的时的明暗变化。
```CSS
.pesudo:before{
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  z-index:-1;
  background:rgba(0,0,0,.1);
}
.pesudo:hover:before{
  content:"";
}
.pesudo:after{
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  z-index:-1;
  background:rgba(255,255,255,.2);
}
.pesudo:active:after{
  content:"";
}
```

[戳我看demo](http://chokcoco.github.io/magicCss/html/index.html#pesudo) （请用 Chrome 浏览器打开）。


## 变形恢复

有的时候，设计师们希望通过一些比较特殊的几何图形，表达不同的意思。

![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525202940334-995858207.png)![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525202944975-74268506.png)![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525202949803-524156901.png)

用 CSS3 transfrom 属性，我们可以轻松的得到一个梯形，菱形或者平行四边形。有时我们设计师们希望在这些容器内配上文字，譬如平行四边形可以表达一种速度之感。

但是如上图所示，内容文字也会跟着 CSS3 变换一起发生了扭曲，通常我们会用一个 div 做背景进行变换，而文字则是放在另外一个 div 中。

但是运用伪元素，我们可以去掉这些不合语义化多余的标签，运用 before 伪元素，将 CSS3 变换作用于伪元素上，这样变形不会作用于位于 div 上的的文字，而且没有使用多余的标签。

[戳我看demo ](http://chokcoco.github.io/magicCss/html/index.html#parallelogram)（请用 Chrome 浏览器打开）。
 
## 伪元素实现换行，替代换行标签

大家都知道，块级元素在不脱离正常布局流的情况下是会自动换行，而行级元素则不会自动换行。但在项目中，有需求是需要让行级元素也自动换行的，通常这种情况，我都是用换行标签 br 解决。而 《CSS SECRET》 中对 br 标签的描述是，这种方法不仅在可维护性方面是一种糟糕的实践，而且污染了结构层的代码。想想自己敲代码以来，用的 br 标签还真不少。

运用 after 伪元素，可以有一种非常优雅的解决方案：
```CSS
.inline-element::after{
    content: "\A";
    white-space: pre;
}
```

通过给元素的 after 伪元素添加 content 为 "\A" 的值。这里 \A 是什么呢？

有一个 Unicode 字符是专门代表换行符的：0x000A 。 在 CSS 中，这个字符可以写作 "\000A"， 或简化为 "\A"。这里我们用它来作为 ::after 伪元素的内容。也就是在元素末尾添加了一个换行符的意思。

而 white-space: pre; 的作用是保留元素后面的空白符和换行符，结合两者，就可以轻松实现在行内级元素末尾实现换行。
[原文Demo](http://play.csssecrets.io/line-breaks)。 

## 增强用户体验，使用伪元素实现增大点击热区

按钮是我们网页设计中十分重要的一环，而按钮的设计也与用户体验息息相关。让用户更容易的点击到按钮无疑能很好的增加用户体验，尤其是在移动端，按钮通常都很小，但是有时由于设计稿限制，我们不能直接去改变按钮元素的高宽。那么这个时候有什么办法在不改变按钮原本大小的情况下去增加他的点击热区呢？

这里，伪元素也是可以代表其宿主元素来响应的鼠标交互事件的。借助伪元素可以轻松帮我们实现，我们可以这样写：
```css
.btn::befoer{
  content:"";
  position:absolute;
  top:-10px;
  right:-10px;
  bottom:-10px;
  left:-10px;
}
```

当然，在 PC 端下这样子看起来有点奇怪，但是合理的用在点击区域较小的移动端则能取到十分好的效果，效果如下：

![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160527112625428-906375003.gif)

## more magic -- 单标签图案

上面介绍的是伪元素众多用法的一部分，伪元素的作用远不止于此。有了before 、after 两个伪元素。一个标签其实可以相当于 3 个标签来使用，而配合 CSS3 强大的 3D 变换、多重背景，多重阴影等手段，让单标签作画成为了可能，下面是我仅用单个标签，实现的一些动画效果：

### 单标签实现浏览器图标：

![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525203752225-1702673023.png)![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525203756772-1327454420.png) ![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525203808522-781300314.png)

### 单标签天气图标：

![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525203847819-2100257020.png)![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525203851850-2061316548.png)![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525203855678-622069500.png)![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525203858866-1439572782.png)![](http://images2015.cnblogs.com/blog/608782/201605/608782-20160525203902428-742513860.png)

[CSS3奇思妙想，采用单标签完成各种图案 -- Demo](http://chokcoco.github.io/magicCss/html/index.html) （请用 Chrome 浏览器打开，非常值得一看）。

也希望觉得不错的同学顺手在我的 Github 点个 star ： [CSS3奇思妙想](https://github.com/chokcoco/magicCss) 。

希望这篇文章对大家有所帮助，尤其是在对问题解决的思维层面上。

到此本文结束，如果还有什么疑问或者建议，可以多多交流，原创文章，文笔有限，才疏学浅，文中若有不正之处，万望告知。

