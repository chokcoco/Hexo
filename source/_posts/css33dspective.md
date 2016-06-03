
---
title: 【CSS3 3D 动画】酷炫的3D旋转透视
date: 2016-04-21 18:31:00
keywords: reflow, CSS3动画, css3 3D, CSS3行星, 3D 透视变换, GPU 层, 重绘与回流, repaint, will-change
tags: [CSS3, web动画]
---
之前学习 react+webpack ，偶然路过 [webpack 官网](https://webpack.github.io/) ，看到顶部的 LOGO ，就很感兴趣。

最近觉得自己 CSS3 过于薄弱，想着深入学习一番，遂以这个 LOGO 为切入口，好好研究学习了一下相关的 CSS3 属性。webpack 的 LOGO 动画效果乍看不是很难，深入了解之后，觉得内部其实大有学问，自己折腾了一番，做了一系列相关的 CSS3 动画效果。<!-- more -->

先上 [demo](http://chokcoco.github.io/demo/css3demo/html/index.html) ，没有将精力放在兼容上，请用 chrome 打开。

本文完整的代码，以及更多的 CSS3 效果，在我 [github](https://github.com/chokcoco/css3-) 上可以看到，也希望大家可以点个 star。

嗯，可能有些人打不开 demo 或者页面乱了，贴几张效果图：（图片有点大，耐心等待一会）

#### 立方体 3D 旋转

![](http://jbcdn2.b0.upaiyun.com/2016/04/0ca3ec33d5d5be6780c80b1aa94e9f70.gif)

#### 3D 透视照片墙

![](http://jbcdn2.b0.upaiyun.com/2016/04/df7fe60267095e987c26cad9d51ab6b5.gif)

#### 跳跃的音符

![](http://jbcdn2.b0.upaiyun.com/2016/04/ddfb945c3961e58238e8cea081584725.gif)

可能上面的效果对精通 CSS3 的而言小菜一碟，写本文的目的也是我自己学习积累的一个过程，感兴趣的就可以一起往下看啦。

其实 CSS3 效果真的很强大，上面的效果都是纯 CSS 实现，个人感觉越是深入 CSS 的学习，越是觉得自己不懂 CSS ，不过话说回来，这些效果的实用场景不大，但是作为一个有追求的前端，我觉得还是有必要去好好了解一下这些属性。

所以本文接下来要讲的大概有：

*   transform-style: preserve-3d 三维效果
*   perspective and perspective-origin 3D视距，透视/景深效果
*   CSS3 filter CSS3滤镜
*   transparent、radial-gradient 透明与渐变

## transform-style

要利用 CSS3 实现 3D 的效果，最主要的就是借助 transform-style 属性。transform-style 只有两个值可以选择：
```javascript
// 语法：
transform-style: flat|preserve-3d;

transform-style: flat; // 默认，子元素将不保留其 3D 位置
transform-style: preserve-3d; // 子元素将保留其 3D 位置。
```

当我们指定一个容器的 transform-style 的属性值为 preserve-3d 时，容器的后代元素便会具有 3D 效果，这样说有点抽象，也就是当前父容器设置了 preserve-3d 值后，它的子元素就可以相对于父元素所在的平面，进行 3D 变形操作。

当父元素设置了 transform-style:preserve-3d 后，就可以对子元素进行 3D 变形操作了，3D 变形和 2D 变形一样可以，使用 transform 属性来设置，或者可以通过制定的函数或者通过三维矩阵来对元素变型操作：

1. 使用 translateX(length) 、translateY(length) 、 translateZ(length) 来进行 3D 位移操作，与 2D 操作一样，对元素进行位移操作，也可以合并为 translate3d(x,y,z) 这种写法；

2. 使用 scaleX() 、scaleY() 、scaleY() 来进行3D 缩放操作，也可以合并为 scale3d(number,number,number) 这种写法；

3. 使用 rotateX(angle) 、rotateY(angle) 、rotateZ(angle) 来进行 3D 旋转操作，也可以合并为 rotate3d(Xangle,Yangle,Zangle) 这种写法。

对于 API 的学习，我建议去源头看看，不要满足于消费别人的总结，[transform-style API](http://www.w3school.com.cn/cssref/pr_transform.asp)。

这里要特别提出的，3D 坐标轴，所谓的绕 X、Y、Z 轴的三个轴，这个不难，感觉空间想象困难的，照着 API 试试，绕每个轴都转一下就明白了：

![](http://jbcdn2.b0.upaiyun.com/2016/04/0e65a81235b9f60a85e8f0c6276ac3ea.jpg)

了解过后，那么依靠上面所说的，其实我们就已经可以做一个立方体出来了。所谓实践出真知，下面就看看该如何一步步得到一个立方体。

#### 准备六个正方形

这个好理解，正方体六个面，首先用 div 做出 6 个面，包裹在同一个父级容器下面，父级容器设置 transform-style:preserve-3d ，这样接下来就可以对 6 个面进行 3D 变换操作，为了方便演示，我用 6 个颜色不一样的面：

![](http://jbcdn2.b0.upaiyun.com/2016/04/94b732a2cd93b7d4f8b656c95d0ec7da.png)

上面的图是示意有 6 个面，当然我们要把 6 个正方形 div 设置为绝对定位，重叠叠在一起，那么应该是这样的，只能看到一个面：

![](http://jbcdn2.b0.upaiyun.com/2016/04/e5054b849f23db6959b3cef149234682.png)

#### 父容器做简单的变换

为了最后的看上去的效果好看，我们需要先对父容器进行变换，运用上面说的 rotate 属性，将容器的角度改变一下：
```javascript
.cube-container{
    -webkit-transform: rotateX(-33.5deg) rotateY(45deg);
    transform: rotateX(-33.5deg) rotateY(45deg);
}
```

那么，变换之后，得到这样一个图形：

![](http://jbcdn2.b0.upaiyun.com/2016/04/a9d305ea218f32582b9b0a9b2a7fb634.png)

嗯，这个时候，6 个 div 面仍然是重叠在一起的。

#### 对每个面做 3D 变换

接下来就是对每个面进行 3D 变换了，运用 rotate 可以对 div 平面进行旋转，运用 translate 可以对 div 平面进行平移，而且要记住现在我们是在三维空间内变换，转啊转啊，我们可能会得到这样的形状：

![](http://jbcdn2.b0.upaiyun.com/2016/04/e8a2d76df36016dd031d2226635e8f5e.png)

算好旋转角度和偏移距离，最后上面的 6 个面就可以完美拼成一个立方体咯！为了效果更好，我给每个面增加一些透明度，最后得到一个完整的立方体：

![](http://jbcdn2.b0.upaiyun.com/2016/04/e6790ac9e689b4af675c7d50330f2737.png)

为了更有立体感，我们可以调整父容器的旋转角度，旋转看上去更立体的角度:

![](http://jbcdn2.b0.upaiyun.com/2016/04/7ac5b80d441bae4e0a44a37a2b40f4d2.png)

至此，一个 3D 立方体就完成了。写这篇文章的时候，本来到这里，这一块应该就结束了，但是写到这里的时候，突然突发奇想，既然正方体可以（正六面体），那么正四面体，正八面体甚至球体应该也能做出来吧？

嗯，没有按住躁动的心，立马动手尝试了一番，最后做出了下面的两个：

![](http://jbcdn2.b0.upaiyun.com/2016/04/caac2d7e6f33d510bebbd3fbfbee894b.gif)  ![](http://jbcdn2.b0.upaiyun.com/2016/04/0c6cb469e19e5411f867ad31d3facfbd.gif)

就不再详细讨论如何一步一步得到这两个了，有兴趣的可以去我的 [github](https://github.com/chokcoco/css3-) 上看看源码，或者直接和我讨论交流，简单的谈谈思路：

##### 正四面体

和正方体一样，我们首先要准备 4 个三角形（下面会详细讲如何利用 CSS3 制作一个三角形 div），注意 4 个三角形应该是重叠在一起的，然后将其中三个分别沿着三条边的中心点旋转 70.5 度（正四面体临面夹角），就可以得到一个正四面体。

注意沿着三条边的中心点旋转 70.5 度这句话，意思是每个图形要定位一次旋转中心，也就是 [transform-origin](http://www.w3school.com.cn/cssref/pr_transform-origin.asp) 属性，它允许我们设置旋转元素的基点位置。

##### 球体

上面的 GIF 图因为添加了 animation 动画效果，看上去很像一个球体在运动，其实只用了 4 个 div，每个 div 利用 border-radius:100% 设置为圆形，然后以中心点为基准，每个圆形 div 绕 Y 轴旋转不同的角度，再让整个圆形容器绕 Y 轴动起来，就可以得到这样一个效果了。

## perspective and perspective-origin 3D视距，透视/景深效果

继续说 3D ，接下来要说的属性是 persepective 和 perspective-origin 。

### persepective 
```javascript
// 语法
perspective: number|none;
```

perspective 为一个元素设置三维透视的距离，仅作用于元素的后代，而不是其元素本身。

简单来说，当元素没有设置 perspective 时，也就是当 perspective:none/0 时所有后代元素被压缩在同一个二维平面上，不存在景深的效果。

而如果设置 perspective 后，将会看到三维的效果。

### perspective-origin

perspective-origin 表示 3D 元素透视视角的基点位置，默认的透视视角中心在容器是 perspective 所在的元素，而不是他的后代元素的中点，也就是 perspective-origin: 50% 50%。
```javascript
// 语法
perspective-origin: x-axis y-axis;

// x-axis : 定义该视图在 x 轴上的位置。默认值：50%
// y-axis : 定义该视图在 y 轴上的位置。默认值：50%
```

值得注意的是，CSS3 3D 变换中的透视的透视点是在浏览器的前方。

说总是很难理解，运用上面我们做出来的正方体试验一下，我设置了正方体的边长为 50 px ，这里设置正方体容器 cuber-inner 的 persepective 的为 100 px，而 perspective-origin 保持为默认值：
```javascript
-webkit-perspective-origin: 50% 50%;
perspective-origin: 50% 50%;
-webkit-perspective: 100px;
perspective: 100px;
```

上面这样设置，也就是相当于我站在 100px 的长度外去看这个立方体，效果如下：

![](http://jbcdn2.b0.upaiyun.com/2016/04/81c40acdcba6ec0a2231f382ca95317c.png)

通过调整 persepective 和 perspective-origin 的值，可以看到不一样的图形，这个很好理解，我们观测一个物体的角度和距离物体的距离不断发生改变，我们看的物体也是不一样的，嗯想象一下小学课文，杨桃和星星，就能容易明白了。

需要提出的是，我上面的几个正多面体图形和球形图形是没有加上 persepective 值的，感兴趣的可以加上试一下看看效果。


#### 3D 透视照片墙

回到文章一开始我贴的那个 3D 照片墙，运用 transform-style: preserve-3d 和 persepective ，可以做出效果很好的这种 3D 照片墙旋转效果。

代码就不贴了，本文已经很长了，只是简单的谈谈原理，感兴趣的去[扒源码](https://github.com/chokcoco/css3-)看看。

+ 设立一个舞台，也就是包裹旋转的图片们的容器，给他设置一个 persepective 距离，以及 transform-style: preserve-3d 让后代可以进行 3D 变换；

+ 准备 N 张图片置于容器内部，N 的大小看个人喜好了，图片的 3D 旋转木马效果是类似钢管舞旋转的运动，因此是绕 Y 轴的，我们关心的是 rotateY 的大小，根据我们添加的图片数量，用 360° 的圆周角将每个图片等分，也就是让每张图片绕 Y 轴旋转固定角度依次散开：（下面的图为示意效果，我调整了一下角度和透明度）

![](http://jbcdn2.b0.upaiyun.com/2016/04/63931b0d922eacae16e7a292c4581c10.png)

+ 这个时候，N 张图肯定是重合叠在了一起，所以这里关键一步是运用 translateZ(length) 让图片沿 Z 轴平移，也就是运用 translateZ 可以让图片离我们更近或者更远，因为上一步设置了图片不同的 rotateY() 角度，所以 N 张图片设定一个 translateZ 后，图片就很自然以中点为圆心分散开了，也就是这样：

![](http://jbcdn2.b0.upaiyun.com/2016/04/cee2ee4c0b43385cb0ad898ad14d3315.png)

+ 最后利用 animation ，我们让舞台，也就是包裹着图片的容器绕 Y 轴旋转起来（rotateY），那么一个类似旋转木马的 3D 照片墙效果就完成了！

这里要注意的一点是设置的 persepective 值和单个图片 translateZ(length) 的值，persepective 一定要比 translateZ(length) 的值大，否则就是相当于舞台跑你身后去了，肯定是看不到效果了。

本来想继续说

+ CSS3 filter CSS3滤镜
+ transparent、radial-gradient 透明与渐变

这些个可以让动画效果变得更赞的一些 CSS3 属性，但是觉得本文篇幅已经很长，而且这两个属性有点偏离主题，打算另起一文，再做深入探究。

再说两点本文没有谈到的，但是很有用处的小细节，感兴趣的可以去了解了解，也会在接下来进行详细探讨：

+ 使用 transform3d api 代替 transform api，强制开启 GPU 加速，提升网站动画渲染性能；

+ 使用 CSS3 will-change 提高页面滚动、动画等渲染性能

 
OK，本文到此结束，如果还有什么疑问或者建议，可以多多交流，原创文章，文笔有限，才疏学浅，文中若有不正之处，万望告知。

本文完整的代码，以及更多的 CSS3 效果，在我 [github](https://github.com/chokcoco/css3-) 上可以看到，也希望大家可以点个 star。

本文的 [demo](http://chokcoco.github.io/demo/css3demo/html/index.html) 戳我。

