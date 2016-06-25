---
title: 【CSS进阶】CSS 颜色体系详解
date: 2016-06-25 20:03:00
keywords: color, transparent , currentColor , gba(), hsl, 颜色关键字
tags: [CSS]
---
说到 CSS 颜色，相比大家都不会陌生，本文是我个人对 CSS 颜色体系的一个系统总结与学习，分享给大家。

先用一张图直观的感受一下与 CSS 颜色相关大概覆盖了哪些内容。

![CSS 颜色体系](../../../../images/post/cssColorSystem/CssSystem.png)<!-- more -->

接下来的行文内容大概会按照这个顺序进行，内容十分基础，可选择性跳到相应内容处阅读。

## 色彩关键字

嗯，色彩关键字很好理解。它表示一个具体的颜色值，且它不区分大小写。

在 CSS 3 之前，也就是 [CSS 标准 2](https://www.w3.org/TR/CSS2/)，一共包含了 17 个基本颜色，分别是：
+ black（黑）	#000000
+ silver（银）	#c0c0c0
+ gray[*]（灰）	#808080
+ white（白）	#ffffff
+ maroon（褐）	#800000
+ red（红）	#ff0000
+ purple（紫）	#800080
+ fuchsia（紫红）	#ff00ff
+ green（绿）	#008000
+ lime（绿黄）	#00ff00
+ olive（橄榄绿）	#808000
+ yellow（黄）	#ffff00
+ navy（藏青）	#000080
+ blue（蓝）	#0000ff
+ teal（青）	#008080
+ aqua（水绿）	#00ffff
+ orange（橙）	#ffa500
