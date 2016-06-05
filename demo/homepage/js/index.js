;/*!/static/js/index.js*/
(function(win, undefined) {
	var myAniShow = (function() {
		var stage = document.querySelector('#stage'),
			name = document.querySelector('.name'),
			coco = document.querySelector('.coco'),
			logo = document.querySelector('.logoimage'),
			word = document.querySelector('.word'),
			introduce = document.querySelector('.introduce'),
			timeLine = [1.5, 1, 3, 0.5, 1, 0.5, 1, 1, 0.5],
			// 缓动函数列表
			tweenArr = [
				Power0.easeNone,
				Power1.easeOut,
				Power2.easeOut,
				Power3.easeOut,
				Power4.easeOut,
				Power1.easeInOut,
				Power2.easeInOut,
				Power3.easeInOut,
				Power4.easeInOut,
				Power1.easeIn,
				Power2.easeIn,
				Power3.easeIn,
				Power4.easeIn,
				Back.easeIn.config(1.7),
				Back.easeInOut.config(1.7),
				Back.easeOut.config(1.7),
				Elastic.easeIn.config(1, 0.3),
				Elastic.easeInOut.config(1, 0.3),
				Elastic.easeOut.config(1, 0.3),
				Bounce.easeIn,
				Bounce.easeInOut,
				Bounce.easeOut,
				SlowMo.ease.config(0.7, 0.7, false),
				Circ.easeOut,
				Circ.easeIn,
				Circ.easeInOut,
				Expo.easeOut,
				Expo.easeIn,
				Expo.easeInOut,
				Sine.easeOut,
				Sine.easeIn,
				Sine.easeInOut
			],
			// 时间轴配置函数
			tmax_config = {
				delay: 0,
				onComplete: function() {
					console.log('animation is complete');
				}
			},
			// 时间轴对象
			timeLineMax = new TimelineMax(tmax_config);

		// 粒子外散动画
		// num 粒子数量
		// triggerTime 触发延时
		// singleRunTime 单个粒子动画时长
		// allRunTime 整个动画持续时长
		function particleOutAni(num, triggerTime, singleRunTime, allRunTime) {
			var k = 0,
				j = 0,
				ballDivs = [],
				cssContent = "z-index:-1;width:2px;height:2px;border-radius:50%;position:absolute;left:50%;top:50%;background-color: #fff;box-shadow:0 0 3px #fff;opacity:0;transform:scale(0.1)"

			for (; k < num; k++) {
				(function(i) {
					var
						elem = ballDivs[i],
						// 粒子位移的 X 坐标
						randomX = getRandomNum(-400, 400, 1),
						// 粒子位移的 Y 坐标
						randomY = getRandomNum(-300, 300, 1),
						// 粒子随机放大倍数
						randomScale = getRandomNum(1, 3),
						// 单个粒子触发间隔时间
						triggerInterval = (allRunTime - singleRunTime) / num;

					// 填充粒子过程
					elem = document.createElement('div');
					elem.setAttribute("class", 'particle');
					elem.style.cssText = cssContent;
					stage.appendChild(elem);

					// 粒子运动动画过程
					timeLineMax
						.to(elem, singleRunTime, {
							transform: 'scale(' + randomScale + ') translate(' + randomX + 'px,' + randomY + 'px)',
							opacity: 1,
							onComplete: function() {
								// elem.style.display = 'none';
							}
						}, triggerTime + i * triggerInterval)
						.to(elem, 0.01, {
							opacity: 0
						},singleRunTime + triggerTime + i * triggerInterval);
				})(k);
			}
		}

		// 容器内 div 随机分散
		function wordDispersion(container) {
			var divs = container.getElementsByTagName('div'),
				length = divs.length,
				i = 0;

			for (; i < length; i++) {
				var elem = divs[i],
					randomMarginX = 300 + getRandomNum(-500, 600, 1),
					randomMarginY = -getRandomNum(50, 250),
					randomRotate = getRandomNum(0, 360);

				elem.style.marginTop = randomMarginY + 'px';
				elem.style.marginLeft = randomMarginX + 'px';
				elem.style.transform = 'rotateZ(' + randomRotate + 'deg)';
			}
		}

		// 文字归位动画
		function wordFlyAni(container) {
			var divs = container.getElementsByTagName('div'),
				length = divs.length,
				gapTime = 1 / length,
				i = 0;

			for (; i <length; i++) {
				var elem = divs[i],
					randomConfigX = getRandomNum(1, 2.5),
					randomConfigY = getRandomNum(0.1, 0.5);

				// 粒子运动动画过程
				timeLineMax.to(elem, 2, {
					rotationZ: '0deg',
					marginTop: 0,
					marginLeft: 0,
					opacity: 1,
					ease: Elastic.easeOut.config(randomConfigX, randomConfigY)
				}, 6 + gapTime);
			}
		}

		// 文字下掉动画
		function wordTranslateDown(container){
			var divs = container.getElementsByTagName('div'),
				length = divs.length,
				i = 0;

			for(; i<length; i++){
				(function(j){
					var elem = divs[j],
						randomConfigX = getRandomNum(1, 2.5),
						randomConfigY = getRandomNum(0.1, 0.5),
						randomTween = tweenArr[parseInt(getRandomNum(0,32))];

						// 粒子运动动画过程
						timeLineMax.to(elem, 1, {
							marginTop: '150px',
							transform: 'scale(0.9)',
							ease: randomTween
						}, 8)
						.to(elem, 0.1, {
							opacity: 0.2,
							ease: randomTween
						}, 9)
						.to(elem, 0.1, {
							opacity: 0.9,
							ease: randomTween
						}, 9.1)
						.to(elem, 0.1, {
							opacity: 0.1,
							ease: randomTween
						}, 9.2)
						.to(elem, 0.1, {
							opacity: 0.8,
							ease: randomTween
						}, 9.3)
						.to(elem, 0.1, {
							opacity: 0,
							ease: randomTween
						}, 9.4);

				})(i)
			}
		}

		// 获取 n-m 范围内的随机数
		// isNegative -- true 表示可能是负数，默认为 0
		function getRandomNum(n, m, isNegative) {
			var num = Math.random() * (m - n) + n,
				isNegative = isNegative || 0;

			if (!isNegative) {
				return num;
			} else {
				return Math.random() > 0.5 ? num : -num;
			}
		}

		// 获取之前动画的时间
		function getAniDurationTime(step) {
			if (step < 0) {
				return;
			}

			var allTime = 0,
				i = 0;

			for (; i < step; i++) {
				allTime += timeLine[i];
			}
			return allTime;
		}

		return {
			aniControl: function() {
				// 文字随机排列
				wordDispersion(word);

				// 0 - 1.5
				timeLineMax.to(name, timeLine[0], {
					transform: 'scale(1)',
					opacity: 1,
					left: 0,
					ease: Elastic.easeOut.config(1.2, 0.3)
				});

				// 1.5 - 2.5
				timeLineMax
					.to(name, timeLine[1], {
						transform: 'scale(0.1) ',
						opacity: 0,
						// 完成后的回调函数
						onComplete: function() {
							// name.parentNode.removeChild(name);
						}
					})
					.to(name, timeLine[1], {
						rotationX: '360deg'
					}, getAniDurationTime(1));

				// 2.5 - 5.5
				timeLineMax.to(coco, timeLine[2], {
					opacity: 1,
					transform: 'scale(1.5)',
					ease: Power0.easeNone
				});
				// 粒子星光
				particleOutAni(100, timeLine[0] + timeLine[1], 1, timeLine[2] + timeLine[3]);

				// 5.5 - 6.0
				timeLineMax.to(coco, timeLine[3], {
					opacity: 0,
					transform: 'scale(2)',
					ease: Expo.easeOut,
					onComplete: function() {
						logo.style.display = 'block';
					}
				}, getAniDurationTime(3));

				// logo 模块
				// 6.0 - 7.0
				timeLineMax.to(logo, timeLine[4], {
					// transform: 'translate(-200px,-200px)',
					left: '100px',
					top: '100px',
					opacity: 1,
					rotationZ: '0deg',
					// delay: getAniDurationTime(4),
					ease: Back.easeOut.config(2),
					onComplete: function() {
						// 清除粒子
						var particles = document.getElementsByClassName('particle'),
							length = particles.length,
							i = length - 1;
						for (; i >= 0; i--) {
							// stage.removeChild(particles[i]);
						}
					}
				});

				// 7.0 - 7.5
				timeLineMax.to(logo, timeLine[5], {
					left: '150px',
					rotationY: '90deg',
					opacity: 0.8,
					// delay: getAniDurationTime(5),
					ease: Power0.easeNone,
					onComplete: function() {
						logo.querySelector('img').src = '../images/logo-CSS3.png';
						logo.style.opacity = '1';
					}
				});

				// 7.5 - 8.5
				timeLineMax.to(logo, timeLine[6], {
					rotationY: '270deg',
					opacity: 0.8,
					// delay: getAniDurationTime(6),
					ease: Power0.easeNone,
					onComplete: function() {
						logo.querySelector('img').src = '../images/logo-JS.png';
						logo.style.opacity = '1';
					}
				});

				// 8.5 - 9.5
				timeLineMax.to(logo, timeLine[7], {
					rotationY: '450deg',
					opacity: 0.8,
					// delay: getAniDurationTime(7),
					ease: Power0.easeNone,
					onComplete: function() {
						logo.querySelector('img').src = '../images/logo-me.png';
						logo.style.opacity = '1';
					}
				});

				// 9.5 - 10
				timeLineMax.to(logo, timeLine[8], {
					rotationY: '720deg',
					// delay: getAniDurationTime(8),
					ease: Power0.easeNone,
					onComplete: function() {
						logo.querySelector('img').src = '../images/logo-me.png';
					}
				});

				// 英文文字模块
				// 6.0 - 8.0
				wordFlyAni(word);
				// 8.0 - 9.5
				wordTranslateDown(word);

				// 9.5 - 10
				timeLineMax.to(introduce, 1.5, {
					opacity: 1,
					ease: Power4.easeOut,
					onComplete: function() {
						// introduce.style.display = 'none';
					}
				},8.5);
			},
			eventBind:function(){
				var playBtn = document.getElementsByClassName('play')[0],
					pauseBtn = document.getElementsByClassName('pause')[0],
					reverseBtn = document.getElementsByClassName('reverse')[0];

				playBtn.addEventListener("click",function(){
					timeLineMax.play();
				},false);

				pauseBtn.addEventListener("click",function(){
					timeLineMax.stop();
				},false);

				reverseBtn.addEventListener("click",function(){
					timeLineMax.reverse();
				},false);
			},
			init: function(){
				this.aniControl();
				this.eventBind();
			}
		}
	})();

	myAniShow.init();
})(window);
