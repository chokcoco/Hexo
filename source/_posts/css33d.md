
---
title: 【Web动画】CSS3 3D 行星运转 && 浏览器渲染原理
date: 2016-04-28 14:49:34
keywords: reflow, CSS3动画, css3 3D, CSS3行星, 3D 透视变换, GPU 层, 重绘与回流, repaint, will-change
tags: [CSS3, web动画, 性能优化]
---
承接上一篇：[【CSS3进阶】酷炫的3D旋转透视](https://github.com/chokcoco/cnblogsArticle/issues/9) 。

最近入坑 Web 动画，所以把自己的学习过程记录一下分享给大家。

CSS3 3D 行星运转 demo 页面请戳：[Demo](http://chokcoco.github.io/demo/css3demo/html/exampleSolarSystem.html)。（建议使用Chrome打开）<!-- more -->

本文完整的代码，以及更多的 CSS3 效果，在我 [Github](https://github.com/chokcoco/css3-) 上可以看到，也希望大家可以点个 star。

嗯，可能有些人打不开 demo 或者页面乱了，贴几张效果图：（图片有点大，耐心等待一会）

## CSS3 3D 行星运转效果图

![CSS3 3D 行星运转动画，太阳系动画](http://images2015.cnblogs.com/blog/608782/201604/608782-20160427171653361-410154737.gif "CSS3 3D 行星运转动画，太阳系动画")

随机再截屏了一张：

![CSS3 3D 行星运转动画，太阳系动画](http://images2015.cnblogs.com/blog/608782/201604/608782-20160427172022173-871901711.jpg "CSS3 3D 行星运转动画，太阳系动画")

强烈建议你点进 [Demo ](http://chokcoco.github.io/demo/css3demo/html/exampleSolarSystem.html)页感受一下 CSS3 3D 的魅力，图片能展现的东西毕竟有限。

然后，这个 CSS3 3D 行星运转动画的制作过程不再详细赘述，本篇的重点放在 Web 动画介绍及性能优化方面。详细的 CSS3 3D 可以回看上一篇博客：[【CSS3进阶】酷炫的3D旋转透视](http://www.cnblogs.com/coco1s/p/5414153.html)。简单的思路：

1. 利用上一篇所制作的 3D 照片墙为原型，改造而来；

2. 每一个球体的制作，想了许多方法，最终使用了这种折中的方式，每一个球体本身也是一个 CSS3 3D 图形。然后在制作过程中使用 Sass 编写 CSS 可以减少很多繁琐的编写 CSS 动画的过程；

3. Demo 当中有使用 Javascript 写了一个鼠标跟随的监听事件，去掉这个事件，整个行星运动动画本身是纯 CSS 实现的。

下面将进入本文的重点，从性能优化的角度讲讲浏览器渲染展示原理，浏览器的重绘与重排，动画的性能检测优化等:


## 浏览器渲染展示原理 及 对web动画的影响

小标题起得有点大，我们知道，不同浏览器的内核（渲染引擎，Rendering Engine）是不一样的，例如现在最主流的 chrome 浏览器的内核是 Blink 内核（在Chrome（28及往后版本）、Opera（15及往后版本）和Yandex浏览器中使用），火狐是 Gecko，IE 是 Trident 。

浏览器内核负责对网页语法的解释并渲染（显示）网页，不同浏览器内核的工作原理并不完全一致。

所以其实下面将主要讨论的是 chrome 浏览器下的渲染原理。因为 chrome 内核渲染可查证的资料较多，对于其他内核的浏览器不敢妄下定论，所以下面展开的讨论默认是针对 chrome 浏览器的。

首先，我要抛出一点结论：

#### 使用 transform3d api 代替 transform api，强制开始 GPU 加速

这里谈到了 GPU 加速，为什么 GPU 能够加速 3D 变换？这一切又必须要从浏览器底层的渲染讲起，浏览器渲染展示网页的过程，老生常谈，面试必问，大致分为：

1. 解析HTML(HTML Parser)

2. 构建DOM树(DOM Tree)

3. 渲染树构建(Render Tree)

4. 绘制渲染树(Painting)

找到了一张很经典的图：

![浏览器渲染页面过程](http://images2015.cnblogs.com/blog/608782/201604/608782-20160427195106267-313481904.jpg)

这个渲染过程作为一个基础知识，继续往下深入。

当页面加载并解析完毕后，它在浏览器内代表了一个大家十分熟悉的结构：DOM（Document Object Model，文档对象模型）。在浏览器渲染一个页面时，它使用了许多没有暴露给开发者的中间表现形式，其中最重要的结构便是层(layer)。

这个层就是本文重点要讨论的内容：

而在 Chrome 中，存在有不同类型的层： RenderLayer(负责 DOM 子树)，GraphicsLayer(负责 RenderLayer 的子树)。接下来我们所讨论的将是 GraphicsLayer 层。

GraphicsLayer 层是作为纹理(texture)上传给 GPU 的。

这里这个纹理很重要，那么，

#### 什么是纹理(texture)？

这里的纹理指的是 GPU 的一个术语：可以把它想象成一个从主存储器(例如 RAM)移动到图像存储器(例如 GPU 中的 VRAM)的位图图像(bitmap image)。一旦它被移动到 GPU 中，你可以将它匹配成一个网格几何体(mesh geometry)，在 Chrome 中使用纹理来从 GPU 上获得大块的页面内容。

通过将纹理应用到一个非常简单的矩形网格就能很容易匹配不同的位置(position)和变形(transformation)，这也就是 3D CSS 的工作原理。

说起来很难懂，直接看例子，在 chrome 中，我们是可以看到上文所述的 GraphicsLayer -- 层的概念。在开发者工具中，我们进行如下选择调出 show layer borders 选项：

![](http://images2015.cnblogs.com/blog/608782/201604/608782-20160427203423439-857686213.jpg)

在一个极简单的页面，我们可以看到如下所示，这个页面只有一个层。蓝色网格表示瓦片(tile)，你可以把它们当作是层的单元（并不是层），Chrome 可以将它们作为一个大层的部分上传给 GPU：

![](http://images2015.cnblogs.com/blog/608782/201604/608782-20160427204023517-1283675727.jpg)

#### 元素自身层的创建

因为上面的页面十分简单，所以并没有产生层，但是在很复杂的页面中，譬如我们给元素设置一个 3D CSS 属性来变换它，我们就能看到当元素拥有自己的层时是什么样子。

注意橘黄色的边框，它画出了该视图中层的轮廓：

![](http://images2015.cnblogs.com/blog/608782/201604/608782-20160427204816486-1419440154.png)

#### 何时触发创建层 ？

上面示意图中黄色边框框住的层，就是 GraphicsLayer ，它对于我们的 Web 动画而言非常重要，通常，Chrome 会将一个层的内容在作为纹理上传到 GPU 前先绘制(paint)进一个位图中。如果内容不会改变，那么就没有必要重绘(repaint)层。

这样做的意义在于：花在重绘上的时间可以用来做别的事情，例如运行 JavaScript，如果绘制的时间很长，还会造成动画的故障与延迟。

那么一个元素什么时候会触发创建一个层？从目前来说，满足以下任意情况便会创建层：

*   3D 或透视变换(perspective、transform) CSS 属性
*   使用加速视频解码的 
*   拥有 3D (WebGL) 上下文或加速的 2D 上下文的 元素
*   混合插件(如 Flash)
*   对自己的 opacity 做 CSS 动画或使用一个动画变换的元素
*   拥有加速 CSS 过滤器的元素
*   元素有一个包含复合层的后代节点(换句话说，就是一个元素拥有一个子元素，该子元素在自己的层里)
*   元素有一个 z-index 较低且包含一个复合层的兄弟元素(换句话说就是该元素在复合层上面渲染)

#### 层的重绘

对于静态 Web 页面而言，层在第一次被绘制出来之后将不会被改变，但对于 Web 动画，页面的 DOM 元素是在不断变换的，如果层的内容在变换过程中发生了改变，那么层将会被重绘（repaint）。

强大的 chrome 开发者工具提供了工具让我们可以查看到动画页面运行中，哪些内容被重新绘制了：

![](http://images2015.cnblogs.com/blog/608782/201604/608782-20160427212004502-1310804153.png)

在旧版的 chrome 中，是有 show paint rects 这一个选项的，可以查看页面有哪些层被重绘了，并以红色边框标识出来。

但是新版的 chrome 貌似把这个选项移除了，现在的选项是 enable paint flashing ，其作用也是标识出网站动态变换的地方，并且以绿色边框标识出来。

看上面的示意图，可以看到页面中有几处绿色的框，表示发生了重绘。注意 Chrome 并不会始终重绘整个层，它会尝试智能的去重绘 DOM 中失效的部分。

按照道理，页面发生这么多动画，重绘应该很频繁才对，但是上图我的行星动画中我只看到了寥寥绿色重绘框，我的个人理解是，一是 GPU 优化，二是如果整个动画页面只有一个层，那么运用了 transform 进行变换，页面必然需要重绘，但是采用分层（GraphicsLayer ）技术，也就是上面说符合情况的元素各自创建层，那么一个元素所创建的层运用 transform 变换，譬如 rotate 旋转，这个时候该层的旋转变换并没有影响到其他层，那么该层不一定需要被重绘。（个人之见，还请提出指正）。

了解层的重绘对 Web 动画的性能优化至关重要。

是什么原因导致失效(invalidation)进而强制重绘的呢？这个问题很难详尽回答，因为存在大量导致边界失效的情况。最常见的情况就是通过操作 CSS 样式来修改 DOM 或导致重排。

查找引发重绘和重排根源的最好办法就是使用开发者工具的时间轴和 enable paint flashing 工具，然后试着找出恰好在重绘/重排前修改了 DOM 的地方。

#### 总结

那么浏览器是如何从 DOM 元素到最终动画的展示呢？

*   浏览器解析 HTML 获取 DOM 后分割为多个图层(GraphicsLayer)
*   对每个图层的节点计算样式结果（Recalculate style--样式重计算）
*   为每个节点生成图形和位置（Layout--回流和重布局）
*   将每个节点绘制填充到图层位图中（Paint Setup和Paint--重绘）
*   图层作为纹理(texture)上传至 GPU
*   符合多个图层到页面上生成最终屏幕图像（Composite Layers--图层重组）

Web 动画很大一部分开销在于层的重绘，以层为基础的复合模型对渲染性能有着深远的影响。当不需要绘制时，复合操作的开销可以忽略不计，因此在试着调试渲染性能问题时，首要目标就是要避免层的重绘。那么这就给动画的性能优化提供了方向，减少元素的重绘与回流。


## 回流（reflow）与重绘（repaint）

这里首先要分清两个概念，重绘与回流。

#### 回流（reflow）

当渲染树（render Tree）中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为回流（reflow），也就是重新布局（relayout）。

每个页面至少需要一次回流，就是在页面第一次加载的时候。在回流的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树，完成回流后，浏览器会重新绘制受影响的部分到屏幕中，该过程成为重绘。

#### 重绘（repaint）

当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如 background-color 。则就叫称为重绘。

值得注意的是，回流必将引起重绘，而重绘不一定会引起回流。

明显，回流的代价更大，简单而言，当操作元素会使元素修改它的大小或位置，那么就会发生回流。

#### 回流何时触发：

*  调整窗口大小（Resizing the window）
*  改变字体（Changing the font）
*  增加或者移除样式表（Adding or removing a stylesheet）
*  内容变化，比如用户在input框中输入文字（Content changes, such as a user typing text in
*  an input box）
*  激活 CSS 伪类，比如 :hover (IE 中为兄弟结点伪类的激活)（Activation of CSS pseudo classes such as :hover (in IE the activation of the pseudo class of a sibling)）
*  操作 class 属性（Manipulating the class attribute）
*  脚本操作 DOM（A script manipulating the DOM）
*  计算 offsetWidth 和 offsetHeight 属性（Calculating offsetWidth and offsetHeight）
*  设置 style 属性的值 （Setting a property of the style attribute）

所以对于页面而言，我们的宗旨就是尽量减少页面的回流重绘，简单的一个栗子：
```javascript
// 下面这种方式将会导致回流reflow两次
var newWidth = aDiv.offsetWidth + 10; // Read
aDiv.style.width = newWidth + 'px'; // Write
var newHeight = aDiv.offsetHeight + 10; // Read
aDiv.style.height = newHeight + 'px'; // Write

// 下面这种方式更好，只会回流reflow一次
var newWidth = aDiv.offsetWidth + 10; // Read
var newHeight = aDiv.offsetHeight + 10; // Read
aDiv.style.width = newWidth + 'px'; // Write
aDiv.style.height = newHeight + 'px'; // Write
```

上面四句，因为涉及了 offsetHeight 操作，浏览器强制 reflow 了两次，而下面四句合并了 offset 操作，所以减少了一次页面的回流。 

减少回流、重绘其实就是需要减少对渲染树的操作（合并多次多DOM和样式的修改），并减少对一些style信息的请求，尽量利用好浏览器的优化策略。

#### flush队列

其实浏览器自身是有优化策略的，如果每句 Javascript 都去操作 DOM 使之进行回流重绘的话，浏览器可能就会受不了。所以很多浏览器都会优化这些操作，浏览器会维护 1 个队列，把所有会引起回流、重绘的操作放入这个队列，等队列中的操作到了一定的数量或者到了一定的时间间隔，浏览器就会 flush 队列，进行一个批处理。这样就会让多次的回流、重绘变成一次回流重绘。

但是也有例外，因为有的时候我们需要精确获取某些样式信息，下面这些：

*   offsetTop, offsetLeft, offsetWidth, offsetHeight</div><div>

*   scrollTop/Left/Width/Height</div><div>

*   clientTop/Left/Width/Height</div><div>

*   width,height</div><div>

*   请求了getComputedStyle(), 或者 IE的 currentStyle

这个时候，浏览器为了反馈最精确的信息，需要立即回流重绘一次，确保给到我们的信息是准确的，所以可能导致 flush 队列提前执行了。

#### display:none 与 visibility:hidden

两者都可以在页面上隐藏节点。不同之处在于，

*   display:none 隐藏后的元素不占据任何空间。它的宽度、高度等各种属性值都将“丢失”
*   visibility:hidden 隐藏的元素空间依旧存在。它仍具有高度、宽度等属性值

从性能的角度而言，即是回流与重绘的方面，

*   display:none  会触发 reflow（回流）
*   visibility:hidden  只会触发 repaint（重绘），因为没有发现位置变化

他们两者在优化中 visibility:hidden 会显得更好，因为我们不会因为它而去改变了文档中已经定义好的显示层次结构了。

对子元素的影响：

*   display:none 一旦父节点元素应用了 display:none，父节点及其子孙节点元素全部不可见，而且无论其子孙元素如何设置 display 值都无法显示；
*   visibility:hidden 一旦父节点元素应用了 visibility:hidden，则其子孙后代也都会全部不可见。不过存在隐藏“失效”的情况。当其子孙元素应用了 visibility:visible，那么这个子孙元素又会显现出来。

## 动画的性能检测及优化

#### 耗性能样式

不同样式在消耗性能方面是不同的，譬如 box-shadow 从渲染角度来讲十分耗性能，原因就是与其他样式相比，它们的绘制代码执行时间过长。这就是说，如果一个耗性能严重的样式经常需要重绘，那么你就会遇到性能问题。其次你要知道，没有不变的事情，在今天性能很差的样式，可能明天就被优化，并且浏览器之间也存在差异。

因此关键在于，你要借助开发工具来分辨出性能瓶颈所在，然后设法减少浏览器的工作量。

好在 chrome 浏览器提供了许多强大的功能，让我们可以检测我们的动画性能，除了上面提到的，我们还可以通过勾选下面这个 show FPS meter 显示页面的 FPS 信息，以及 GPU 的使用率：
</div>

![](http://images2015.cnblogs.com/blog/608782/201604/608782-20160428112148252-915623437.jpg)

#### 使用 will-change 提高页面滚动、动画等渲染性能

[官方文档说](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change)，这是一个仍处于实验阶段的功能，所以在未来版本的浏览器中该功能的语法和行为可能随之改变。

![](http://images2015.cnblogs.com/blog/608782/201604/608782-20160428124303845-26806184.jpg)

使用方法示例：(具体每个取值的意义，去翻翻文档)
```javascript
will-change: auto
will-change: scroll-position
will-change: contents
will-change: transform        // Example of
will-change: opacity          // Example of
will-change: left, top        // Example of two

will-change: unset
will-change: initial
will-change: inherit

// 示例
.example{
    will-change: transform;
}
```

will-change 为 web 开发者提供了一种告知浏览器该元素会有哪些变化的方法，这样浏览器可以在元素属性真正发生变化之前提前做好对应的优化准备工作。 这种优化可以将一部分复杂的计算工作提前准备好，使页面的反应更为快速灵敏。

值得注意的是，用好这个属性并不是很容易：

*   不要将 will-change 应用到太多元素上：浏览器已经尽力尝试去优化一切可以优化的东西了。有一些更强力的优化，如果与 will-change 结合在一起的话，有可能会消耗很多机器资源，如果过度使用的话，可能导致页面响应缓慢或者消耗非常多的资源。

*   有节制地使用：通常，当元素恢复到初始状态时，浏览器会丢弃掉之前做的优化工作。但是如果直接在样式表中显式声明了 will-change 属性，则表示目标元素可能会经常变化，浏览器会将优化工作保存得比之前更久。所以最佳实践是当元素变化之前和之后通过脚本来切换 will-change 的值。

*   不要过早应用 will-change 优化：如果你的页面在性能方面没什么问题，则不要添加 will-change 属性来榨取一丁点的速度。 will-change 的设计初衷是作为最后的优化手段，用来尝试解决现有的性能问题。它不应该被用来预防性能问题。过度使用 will-change 会导致大量的内存占用，并会导致更复杂的渲染过程，因为浏览器会试图准备可能存在的变化过程。这会导致更严重的性能问题。

*   给它足够的工作时间：这个属性是用来让页面开发者告知浏览器哪些属性可能会变化的。然后浏览器可以选择在变化发生前提前去做一些优化工作。所以给浏览器一点时间去真正做这些优化工作是非常重要的。使用时需要尝试去找到一些方法提前一定时间获知元素可能发生的变化，然后为它加上 will-change 属性。

#### GPU 能够加速 Web 动画，这个上文已经反复提到了。

3D transform 会启用GPU加速，例如 translate3D, scaleZ 之类，当然我们的页面可能并没有 3D 变换，但是不代表我们不能启用 GPU 加速，在非 3D 变换的页面也使用 3D transform 来操作，算是一种 hack 加速法。我们实际上不需要z轴的变化，但是还是假模假样地声明了，去欺骗浏览器。

参考文献：

[Rendering: repaint, reflow/relayout, restyle](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)

[Scrolling Performance](http://www.html5rocks.com/zh/tutorials/speed/scrolling/)

[MDN--will-change](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change)

[How (not) to trigger a layout in WebKit](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html)

[High Performance Animations](http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)

[Accelerated Rendering in Chrome](http://www.html5rocks.com/zh/tutorials/speed/layers/#disqus_thread)

[CSS3 制作3D旋转球体](http://www.bluesdream.com/blog/css3-to-create-3d-rotating-sphere.html)

到此本文结束，如果还有什么疑问或者建议，可以多多交流，原创文章，文笔有限，才疏学浅，文中若有不正之处，万望告知。

CSS3 3D 行星运转 demo 页面请戳：[Demo](http://chokcoco.github.io/demo/css3demo/html/exampleSolarSystem.html)。（建议使用Chrome打开）

本文完整的代码，以及更多的 CSS3 效果，在我 [Github](https://github.com/chokcoco/css3-) 上可以看到，也希望大家可以点个 star。
