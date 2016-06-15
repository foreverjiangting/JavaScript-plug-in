;(function() {
	'use strict';

	function WaterFull(ele, opts) {
		this.ele = this._selector(ele);
		this.conWidth = this.ele.offsetWidth;
		this.defaults = {
			type: 1
		};
		this.opts = this._extend({}, this.defaults, opts);
	}

	WaterFull.prototype = {
		
		create: function(dataArr) {
			var type = this.opts.type,
				str = '';
			if (!type || !dataArr.length) {
				return;
			}
			switch (type) {
				case 1:
					str = this.createFirst(dataArr);
					break;
				case 2:
					str = this.createSecond(dataArr);
					break;
				case 3:
					str = this.createThird(dataArr);
					break;
				default:
					return;
			}

			var listNode = document.createElement('div');
			listNode.id = 'wf-container';
			listNode.style.width = '100%';
			listNode.style.position = 'relative';
			listNode.style.overflow = 'hidden';
			listNode.innerHTML = str;
			this.ele.appendChild(listNode);

			if (type === 2) {
				this.secondeReflows();
			}

		},

		createFirst: function(dataArr) {
			// console.log(dataArr);
			var result = dataArr.map(function(item, index) {
				return '<div class="wf-item wf-item-1" style="background-image: url('+item.picUrl+');"></div>';
			});
			return result.join('');
		},

		createSecond: function(dataArr) {
			var _this = this,
				result = dataArr.map(function(item, index) {
					var height = _this._countRate(item.width, item.height) * 47 + '%';
					return '<div class="wf-item wf-item-2" style="padding-bottom: '+height+';background-image: url('+item.picUrl+');"></div>';
				});
			return result.join('');
		},

		secondeReflows: function() {
			var container = document.getElementById('wf-container'),
				itemList = Array.prototype.slice.call(document.getElementsByClassName('wf-item-2')),
				marginVal = this.conWidth * 0.02,
				columnHeightArr = new Array(2);

				itemList.forEach(function(item, index) {
					if (index < 2) {
						columnHeightArr[index] = item.offsetHeight + marginVal;
					} else {
						var minHeight = Math.min.apply(null, columnHeightArr),
							minHeightIndex = columnHeightArr.indexOf(minHeight);

						item.style.position = 'absolute';
						item.style.top = minHeight + 'px';

						if (minHeightIndex !== 0) {
							item.style.left = '49%';
						}

						columnHeightArr[minHeightIndex] += item.offsetHeight + marginVal;
					}
				});

				container.style.minHeight = Math.max.apply(null, columnHeightArr) + 'px';
		},

		createThird: function(dataArr) {
			// console.log(dataArr);
			var max = dataArr.length,
                template = [],
                contentWidth = this.conWidth,
                _this = this;

            for (var i = 0; i < max; i += 2) {
            	template.push(countPicList(dataArr[i], dataArr[i+1]));
            }

			function countPicList(pic1, pic2) {

                if (!pic2) { //一行一张
                    var rate = _this._countRate(pic1.width, pic1.height),
                    	height = 100 * rate + '%';
                    return '<div class="wf-item" style="padding-bottom:'+height+'; width:100%; background-image:url('+pic1.picUrl+')"></div>';
                } else { //一行两张
                    var rate1 = _this._countRate(pic1.width, pic1.height),
                    	rate2 = _this._countRate(pic2.width, pic2.height),
                    	totalRate = rate1 + rate2,
                    	width1 = rate2 / totalRate * 98 ,
                    	width2 = rate1 / totalRate * 98,
                    	height = width1 * rate1;

					return '<div style="overflow: hidden;">' +
	                       		'<div class="wf-item" style="padding-bottom:'+height+'%; width:'+width1+'%; margin-right:2%; background-image:url('+pic1.picUrl+')"></div>' +
	                            '<div class="wf-item" style="padding-bottom:'+height+'%; width:'+width2+'%; background-image:url('+pic2.picUrl+')"></div>' +
	                       '</div>';
                }
            }
            return template.join('');
		},

		_countRate: function(width, height) {
			return height / width;
		},

		_extend: function() {
			var args = Array.prototype.slice.call(arguments),
				len = args.length,
				obj = null, i;

			for (i = 0; i < len; i ++) {
				if (typeof(args[i]) !== 'object') {
					break;
				}
				if (i !== 0) {
					for (var o in args[i]) {
						obj[o] = args[i][o];
					}
				} else {
					obj = args[0];
				}
			}

			return obj;
		},

		_selector: function(ele) {
			if (!ele) {
				return;
			}
			return document.querySelector(ele);
		}
	}

	window.WaterFull = WaterFull;

})();

//waterfull AMD Export

if (typeof module !== 'undefined') {
	module.exports = window.WaterFull;
} else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.WaterFull;
    });
}