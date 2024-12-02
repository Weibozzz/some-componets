import styled from 'styled-components';
import back from './back.png';
import front from './front.png';
import { useEffect, useRef } from 'react';
const Tmp = () => {
  const boxRef = useRef();
  const frontRef = useRef();
  const backRef = useRef();
  useEffect(() => {
    if (!boxRef.current || !backRef.current || !frontRef.current) return;
    const { width, height, top, left, x, y } = frontRef.current.getBoundingClientRect();
    let isMouseDown = false;
    let startX = 0;
    let startY = 0;
    let cardWidth = 1;
    let cardHeight = 1;
    let cardTop = 1;
    let cardLeft = 1;
    let moveInstance = 0;
    const isTouch = 'ontouchstart' in window;
    // 右上 RT
    const calcXYRT = (x, y) => {
      if (x * y == 0) return;
      var x1 = (x * x + y * y) / 2 / x;
      var y1 = (x * x1) / y;

      // 设置底图分割坐标
      var p1 = `0% ${cardHeight - y1}px, 0% 0%, 100% 0%, 100% 100%, ${x1}px 100%`;
      var p2 = `100% ${cardHeight - y1}px, 100% 100%,${cardWidth - x1}px 100%`;

      frontRef.current.style.clipPath = `polygon(${p1})`;
      backRef.current.style.clipPath = `polygon(${p2})`;
      backRef.current.style.top = `${cardTop - y}px`;
      backRef.current.style.left = `${x + cardLeft - cardWidth - 2}px`;
      // 计算角度
      var j = (Math.acos((y1 - y) / y1) / Math.PI) * 180;
      backRef.current.style.transformOrigin = `100% 100%`;
      backRef.current.style.transform = `rotate(-${j}deg)`;
      backRef.current.style.zIndex = 3;
    };
    // 右下 RB
    const calcXYRB = (x, y) => {
      if (x * y == 0) return;
      var x1 = (x * x + y * y) / 2 / x;
      var y1 = (x * x1) / y;

      // 设置底图分割坐标
      var p1 = `${x1}px 0%,100% 0%, 100% 100%, 0% 100%, 0% ${y1}px`;
      var p2 = `100% ${y1}px, 100% 0%,${cardWidth - x1}px 0%`;

      frontRef.current.style.clipPath = `polygon(${p1})`;
      backRef.current.style.clipPath = `polygon(${p2})`;
      backRef.current.style.top = `${cardTop + y}px`;
      backRef.current.style.left = `${cardLeft - cardWidth + x - 2}px`;
      // 计算角度
      var j = (Math.acos((y1 - y) / y1) / Math.PI) * 180;
      backRef.current.style.transformOrigin = `100% 0%`;
      backRef.current.style.transform = `rotate(${j}deg)`;
      backRef.current.style.zIndex = 3;
    };

    // 左上 LT
    const calcXYLT = (x, y) => {
      if (x * y == 0) return;
      var x1 = (x * x + y * y) / 2 / x;
      var y1 = (x * x1) / y;

      // 设置底图分割坐标
      var p1 = `100% ${cardHeight - y1}px, 100% 0%, 0% 0%, 0% 100%, ${cardWidth - x1}px 100%`;
      var p2 = `0% ${cardHeight - y1}px, 0% 100%,${x1}px 100%`;

      frontRef.current.style.clipPath = `polygon(${p1})`;
      backRef.current.style.clipPath = `polygon(${p2})`;
      backRef.current.style.top = `${cardTop - y}px`;
      backRef.current.style.left = `${cardLeft + cardWidth - x + 2}px`;
      // 计算角度
      var j = (Math.acos((y1 - y) / y1) / Math.PI) * 180;
      backRef.current.style.transformOrigin = `0% 100%`;
      backRef.current.style.transform = `rotate(${j}deg)`;
      backRef.current.style.zIndex = 3;
    };
    // 左下 LB
    const calcXYLB = (x, y) => {
      if (x * y == 0) return;
      var y1 = (x * x + y * y) / 2 / y;
      var x1 = (y * y1) / x;

      // 设置底图分割坐标
      var p1 = `0% 0%,${cardWidth - x1}px 0%,100% ${y1}px, 100% 100%, 0% 100%`;
      var p2 = `0% ${y1}px, 0% 0%,${x1}px 0%`;

      frontRef.current.style.clipPath = `polygon(${p1})`;
      backRef.current.style.clipPath = `polygon(${p2})`;
      backRef.current.style.top = `${cardTop + y}px`;
      backRef.current.style.left = `${cardLeft + cardWidth - x + 2}px`;
      // 计算角度
      var j = (Math.acos((y1 - y) / y1) / Math.PI) * 180;
      backRef.current.style.transformOrigin = `0% 0%`;
      backRef.current.style.transform = `rotate(-${j}deg)`;
      backRef.current.style.zIndex = 3;
    };
    const mousedown = e => {
      e = (isTouch ? e.touches : [e])[0];
      startX = e.pageX;
      startY = e.pageY;
      cardWidth = width;
      cardHeight = height;
      cardTop = top - y;
      cardLeft = left - x;
      isMouseDown = true;
    };
    const mouseup = () => {
      isMouseDown = false;
      try {
        // 恢复原状
        if (moveInstance) {
          backRef.current.style.zIndex = cardWidth < moveInstance ? 2 : 1;
        }
      } catch (error) {
        console.error(error);
      }
      moveInstance = 0;
      backRef.current.style.transform = 'rotate(0deg)';
      backRef.current.style.top = 0;
      backRef.current.style.left = 0;
      backRef.current.style.clipPath = `polygon(0% 0%, 100% 0%,100% 100%,0% 100%)`;
      frontRef.current.style.clipPath = `polygon(0% 0%, 100% 0%,100% 100%,0% 100%)`;
    };
    const mousemove = e => {
      e = (isTouch ? e.touches : [e])[0];
      if (isMouseDown) {
        var dtX = e.pageX - startX;
        moveInstance = dtX;
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
    };
    if (isTouch) {
      boxRef.current.addEventListener('touchstart', mousedown);
      window.addEventListener('touchend', mouseup);
      window.addEventListener('touchmove', mousemove);
      return;
    }
    boxRef.current.addEventListener('mousedown', mousedown);
    window.addEventListener('mouseup', mouseup);
    window.addEventListener('mousemove', mousemove);
    return () => {
      if (isTouch) {
        boxRef.current.removeEventListener('touchstart', mousedown);
        window.removeEventListener('touchend', mouseup);
        window.removeEventListener('touchmove', mousemove);
        return;
      }
      boxRef.current.removeEventListener('mousedown', mousedown);
      window.removeEventListener('mouseup', mouseup);
      window.removeEventListener('mousemove', mousemove);
    };
  }, [boxRef, backRef, frontRef]);
  return (
    <>
      <Div>
        <div className="main-area" ref={boxRef}>
          <div className="front-card card-wrap" ref={frontRef}>
            111
          </div>
          <div className="back-card card-wrap" ref={backRef}>
            222
          </div>
        </div>
      </Div>
    </>
  );
};
const Div = styled.div`
  .main-area {
    position: relative;
    margin: 20vw 10vw;
    width: 20vw;
    height: 28vw;
  }

  .card-wrap {
    width: 20vw;
    height: 28vw;
    top: 0;
    left: 0;
  }

  .front-card {
    position: absolute;
    background-image: url(${front});
    background-size: 100%;
    z-index: 2;
  }

  .back-card {
    position: absolute;
    background-image: url(${back});
    background-size: 100%;
    transform-origin: 100% 100%;
    z-index: 1;
  }
`;
export default Tmp;
