var isMouseDown = false;
var startX = 0;
var startY = 0;

var cardWidth = 1;
var cardHeight = 1;
var cardTop = 1;
var cardLeft = 1;
var moveInstance = 0
var isTouch = 'ontouchstart' in window;

function mousedown(e) {

	e = ((isTouch) ? e.originalEvent.touches : [e])[0];
	startX = e.pageX;
	startY = e.pageY;

	cardWidth = $(".positive-card").width();
	cardHeight = $(".positive-card").height();
	var pos = $(".positive-card").position();
	cardTop = pos.top;
	cardLeft = pos.left;
	isMouseDown = true;
}
function mouseup(e) {
	isMouseDown = false;
	try {
		e = ((isTouch) ? e.originalEvent.touches : [e])[0];
		// var dtX = e.pageX - startX;
		// var dtY = e.pageY - startY;
		// 恢复原状
		if(moveInstance){
			$(".obverse-card").css("z-index", cardWidth < moveInstance ? 2 : 1);
		}
	} catch (error) {
	  console.error(error)
	}
	moveInstance = 0
	$(".obverse-card").css("transform", `rotate(0deg)`);
	$(".obverse-card").css("top", `0`);
	$(".obverse-card").css("left", `0`);
	$(".obverse-card").css("clip-path", `polygon(0% 0%, 100% 0%,100% 100%,0% 100%)`);
	$(".positive-card").css("clip-path", `polygon(0% 0%, 100% 0%,100% 100%,0% 100%)`);
}
function mousemove(e) {
	e = ((isTouch) ? e.originalEvent.touches : [e])[0];
	if (isMouseDown) {
		// console.log(e);
		var dtX = moveInstance = e.pageX - startX;
		var dtY = e.pageY - startY;
		if (dtX == 0) {
			if (dtY < 0) {
				// 往上翻
			} else if (dtY > 0) {
				// 往下翻
			}
		} else if (dtX < 0) {
			// 往左翻
			if (dtY < 0) {
				// 往上翻
				calcXYLT(-dtX, -dtY);
			} else if (dtY > 0) {
				// 往下翻
				calcXYLB(-dtX, dtY);
			} else {
				// 平移
			}
		} else {
			// 往右翻
			if (dtY < 0) {
				// 往上翻
				calcXYRT(dtX, -dtY);
			} else if (dtY > 0) {
				// 往下翻
				calcXYRB(dtX, dtY);
			} else {
				// 平移
			}
		}

	}
}
// 右上 RT
function calcXYRT(x, y) {
	if (x * y == 0) return;
	var x1 = (x * x + y * y) / 2 / x;
	var y1 = (x * x1) / y;

	// 设置底图分割坐标
	var p1 = `0% ${cardHeight - y1}px, 0% 0%, 100% 0%, 100% 100%, ${x1}px 100%`;
	var p2 = `100% ${cardHeight - y1}px, 100% 100%,${cardWidth - x1}px 100%`;

	$(".positive-card").css("clip-path", `polygon(${p1})`);
	$(".obverse-card").css("clip-path", `polygon(${p2})`);
	$(".obverse-card").css("top", `${cardTop - y}px`);
	$(".obverse-card").css("left", `${x + cardLeft - cardWidth - 2}px`);
	// 计算角度
	var j = (Math.acos((y1 - y) / y1) / Math.PI) * 180;
	$(".obverse-card").css("transform-origin", `100% 100%`);
	$(".obverse-card").css("transform", `rotate(-${j}deg)`);
	$(".obverse-card").css("z-index", 3);
}
// 右下 RB
function calcXYRB(x, y) {
	if (x * y == 0) return;
	var x1 = (x * x + y * y) / 2 / x;
	var y1 = (x * x1) / y;

	// 设置底图分割坐标
	var p1 = `${x1}px 0%,100% 0%, 100% 100%, 0% 100%, 0% ${y1}px`;
	var p2 = `100% ${y1}px, 100% 0%,${cardWidth - x1}px 0%`;

	$(".positive-card").css("clip-path", `polygon(${p1})`);
	$(".obverse-card").css("clip-path", `polygon(${p2})`);
	$(".obverse-card").css("top", `${cardTop + y}px`);
	$(".obverse-card").css("left", `${cardLeft - cardWidth + x - 2}px`);
	// 计算角度
	var j = (Math.acos((y1 - y) / y1) / Math.PI) * 180;
	$(".obverse-card").css("transform-origin", `100% 0%`);
	$(".obverse-card").css("transform", `rotate(${j}deg)`);
	$(".obverse-card").css("z-index", 3);
}
// 左上 LT
function calcXYLT(x, y) {
	if (x * y == 0) return;
	var x1 = (x * x + y * y) / 2 / x;
	var y1 = (x * x1) / y;

	// 设置底图分割坐标
	var p1 = `100% ${cardHeight - y1}px, 100% 0%, 0% 0%, 0% 100%, ${cardWidth - x1}px 100%`;
	var p2 = `0% ${cardHeight - y1}px, 0% 100%,${x1}px 100%`;

	$(".positive-card").css("clip-path", `polygon(${p1})`);
	$(".obverse-card").css("clip-path", `polygon(${p2})`);
	$(".obverse-card").css("top", `${cardTop - y}px`);
	$(".obverse-card").css("left", `${cardLeft + cardWidth - x + 2}px`);
	// 计算角度
	var j = (Math.acos((y1 - y) / y1) / Math.PI) * 180;
	$(".obverse-card").css("transform-origin", `0% 100%`);
	$(".obverse-card").css("transform", `rotate(${j}deg)`);
	$(".obverse-card").css("z-index", 3);
}
// 左下 LB
function calcXYLB(x, y) {
	if (x * y == 0) return;
	var y1 = (x * x + y * y) / 2 / y;
	var x1 = (y * y1) / x;

	// 设置底图分割坐标
	var p1 = `0% 0%,${cardWidth - x1}px 0%,100% ${y1}px, 100% 100%, 0% 100%`;
	var p2 = `0% ${y1}px, 0% 0%,${x1}px 0%`;

	$(".positive-card").css("clip-path", `polygon(${p1})`);
	$(".obverse-card").css("clip-path", `polygon(${p2})`);
	$(".obverse-card").css("top", `${cardTop + y}px`);
	$(".obverse-card").css("left", `${cardLeft + cardWidth - x + 2}px`);
	// 计算角度
	var j = (Math.acos((y1 - y) / y1) / Math.PI) * 180;
	$(".obverse-card").css("transform-origin", `0% 0%`);
	$(".obverse-card").css("transform", `rotate(-${j}deg)`);
	$(".obverse-card").css("z-index", 3);
}
$(document).ready(function () {
	const ele = $('body')
	// 初始化监听鼠标事件
	if (isTouch) {
		ele
			.on("touchstart", mousedown);
		ele
			.on("touchmove", mousemove);
		ele
			.on("touchend", mouseup);
		return;
	}
	ele
		.on("mousedown", mousedown);
	ele
		.on("mouseup", mouseup);
	ele
		.on("mousemove", mousemove);
})
