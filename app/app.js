'use strict';

(function () {
  /*
  var getWindowSize = function() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };
  let canvas = document.createElement('canvas');
  canvas.id = 'hanabi';
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style['z-index'] = -1;
   document.body.appendChild(canvas);
   window.addEventListener('resize', function () {
    let canvas = document.getElementById('hanabi');
    let size = getWindowSize();
    canvas.width = size.width + 'px';
    canvas.height = size.height + 'px';
  });
   setTimeout(function () {
    var canvas = {
      elem : undefined,
      width : 0,
      height : 0,
      ctx : undefined,
      left : 0,
      top : 0,
      posX : 0,
      posY : 0
    };
     var hanabi = {
      // 火花の数
      quantity: 150,
      // 火花の大きさ
      size: 3,
      // 減衰力（花火自体の大きさに影響
      circle: 0.97,
      // 重力
      gravity: 1.1,
      // 火花の速度
      speed: 5,
      // 爆発縦位置
      top: 3,
      // 爆発横位置
      left: 2,
      color: '#ffff00',
      hibana: [],
      frame: 0
    };
     Math.Radian = Math.PI * 2;
     var initHanabi = function() {
      canvas.posY = (canvas.height / hanabi.top) - canvas.top;
      canvas.posX = canvas.width / hanabi.left - canvas.left;
      for (var i = 0; i < hanabi.quantity; i++) {
        let angle = Math.random() * Math.Radian;
        let speed = Math.random() * hanabi.speed;
        hanabi.hibana.push({
          posX: canvas.posX,
          posY: canvas.posY,
          velX: Math.cos(angle) * speed,
          velY: Math.sin(angle) * speed
        });
      };
      hanabi.frame = 0;
      requestAnimationFrame(render);
    };
    setTimeout(function() {
      initHanabi();
    }, 0)
     function clearPoint (x, y, size) {
      setTimeout(function () {
        requestAnimationFrame(function() {
          canvas.ctx.save();
          canvas.ctx.beginPath();
          canvas.ctx.arc(x, y, size*1.2, 0, Math.Radian, true);
          canvas.ctx.clip();
          canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.ctx.restore();
        });
      }, 50)
    };
    // 火花描画
    let render = function() {
      if (!hanabi.hibana.length) {
        initHanabi();
        return;
      };
      canvas.ctx.fillStyle = (++hanabi.frame % 2) ? 'rgba(256, 256, 256, 0.8)' : hanabi.color;
      hanabi.hibana.forEach(function(elem, index, array) {
        clearPoint(elem.posX, elem.posY, hanabi.size);
        elem.posX += elem.velX;
        elem.posY += elem.velY;
        elem.velX *= hanabi.circle;
        elem.velY *= hanabi.circle;
        elem.posY += hanabi.gravity;
        if (hanabi.size < 0.1 || !elem.posX || !elem.posY || elem.posX > canvas.width || elem.posY > canvas.height) {
          array.splice(index, 1);
          return;
        };
        canvas.ctx.beginPath();
        canvas.ctx.arc(elem.posX, elem.posY, hanabi.size, 0, Math.Radian, true);
        canvas.ctx.fill();
      });
      hanabi.size *= hanabi.circle;
      canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(render);
    }
     canvas.elem = document.getElementById('hanabi');
    let body = document.body;
    let doc = document.documentElement;
    canvas.width = Math.max(body.clientWidth, body.scrollWidth, doc.scrollWidth, doc.clientWidth);
    canvas.height = Math.max(body.clientHeight, body.scrollHeight, doc.scrollHeight, doc.clientHeight);
    canvas.elem.height = canvas.height;
    canvas.elem.width = canvas.width;
    canvas.ctx = canvas.elem.getContext('2d');
    canvas.left = canvas.elem.getBoundingClientRect ? canvas.elem.getBoundingClientRect().left : 0 ;
    canvas.top = canvas.elem.getBoundingClientRect ? canvas.elem.getBoundingClientRect().top : 0;
  }, 0);
   (function() {
    let requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();
  */

}).call();

(function (DATA, base64) {
  var CANVAS_WIDTH = 433;
  var CANVAS_HEIGHT = 323;
  var getData = (function () {
    var threshold = 128; // しきい値
    var reductionRate = 10; // データ削減率
    var convertGrayScale = function convertGrayScale(base64Data) {
      var img = new Image();
      img.src = base64Data;

      var cvs = document.createElement('canvas');
      cvs.width = CANVAS_WIDTH;
      cvs.height = CANVAS_HEIGHT;
      var ctx = cvs.getContext('2d');
      var Uint8Array = window.Uint8Array || Array;
      var W = CANVAS_WIDTH;
      var H = CANVAS_HEIGHT;
      var AR = W / H;

      var w = img.width,
          h = img.height,
          ar = w / h;

      var scale = undefined;
      var arr = new Uint8Array(W * H);

      // 画像のほうが横長の場合
      if (ar > AR) {
        scale = W / w;

        // 画像が縦長の場合
      } else {
          scale = H / h;
        }

      w = w * scale | 0;
      h = h * scale | 0;

      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, W - w >> 1, H - h >> 1, w, h);

      var cpa = ctx.getImageData(0, 0, W, H).data;
      document.body.appendChild(cvs);

      var len = undefined,
          i = undefined,
          j = undefined;
      for (i = 0, j = 0, len = cpa.length; i < len;) {
        var r = cpa[i++];
        var g = cpa[i++];
        var b = cpa[i++];

        arr[j++] = r * 0.298912 + g * 0.586611 + b * 0.114478;
      }

      return arr;
    };

    function reduceDataSize(pos, per) {
      pos = [].concat(pos); // 念のためcopy

      var ret = [],
          len = pos.length * (per / 100) | 0,
          random = Math.random,
          i,
          j = 0;

      while (j < len) {
        i = random() * pos.length | 0;
        ret[j++] = pos[i];
        pos.splice(i, 1);
      }

      return ret;
    }

    function normalize(pos, dist) {
      var i = pos.length,
          p;

      while (i--) {
        p = pos[i];
        pos[i] = [p[0] * 100 / dist | 0, p[1] * 100 / dist | 0];
      }

      return pos;
    }

    function translate(pos, offsetX, offsetY) {
      var i = pos.length,
          p;

      while (i--) {
        p = pos[i];
        pos[i] = [p[0] - offsetX, p[1] - offsetY];
      }

      return pos;
    }

    function getBoundingRect(pos) {
      var xMin,
          yMin,
          xMax,
          yMax,
          xSum = 0,
          ySum = 0,
          len = pos.length,
          i = len;

      xMin = xMax = pos[0][0];
      yMin = yMax = pos[0][1];

      while (i--) {
        var p = pos[i];
        var x = p[0];
        var y = p[1];

        if (x < xMin) xMin = x;
        if (x > xMax) xMax = x;

        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;

        xSum += x;
        ySum += y;
      }

      return {
        x: xMin,
        y: yMin,
        width: xMax - xMin,
        height: yMax - yMin,
        center: [
        // 軽量化のため小数点切捨てる
        xSum / len | 0, ySum / len | 0]
      };
    }

    function getPos(arr, w, h) {
      var pos = [],
          x,
          y,
          i,
          j = 0;

      for (y = 0; y < h; ++y) {
        for (x = 0; x < w; ++x) {
          i = w * y + x;
          if (arr[i]) {
            pos[j++] = [x, y];
          }
        }
      }

      return pos;
    }

    function getRadius(pos) {
      var rMax = 0,
          i = pos.length,
          sqrt = Math.sqrt,
          p,
          x,
          y,
          r;

      while (i--) {
        p = pos[i];
        x = p[0];
        y = p[1];
        r = sqrt(x * x + y * y);
        if (r > rMax) {
          rMax = r;
        }
      }

      return rMax;
    }

    return function (base64Data) {
      var grayScaleData = convertGrayScale(base64Data);
      var i = grayScaleData.length,
          arr = new Uint8Array(i),
          pos,
          rect;

      if (!i) {
        return [];
      }

      while (i--) {
        arr[i] = grayScaleData[i] < threshold ? 1 : 0;
      }

      pos = getPos(arr, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (!pos.length) {
        return [];
      }

      rect = getBoundingRect(pos);

      // 座標を中心基準に変更する
      pos = translate(pos, rect.center[0], rect.center[1]);

      // 座標を中心からの距離（％）に変更する
      pos = normalize(pos, getRadius(pos));

      // 軽量化のため座標点数を間引く
      pos = reduceDataSize(pos, reductionRate);

      return pos;
    };
  })();

  var renderHanabi = function renderHanabi(dataArr) {
    var cvs = document.createElement('canvas'),
        ctx = cvs.getContext('2d'),
        sty = cvs.style;

    var WIDTH = cvs.width = window.innerWidth;
    var HEIGHT = cvs.height = window.innerHeight;

    var RADIUS = 400;

    var BG_WIDTH = 465;

    var centerX = WIDTH >> 1;
    var centerY = HEIGHT >> 1;

    var requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || window.requestAnimationFrame || function (func) {
      setTimeout(func, 1000 / 60);
    };

    var bg = 0;
    var per = 0;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalCompositeOperation = 'destination-out';

    cvs.style.position = 'absolute';
    cvs.style.top = 0;
    cvs.style['z-index'] = -1;

    document.body.appendChild(cvs);

    render();

    // 放物線生成用
    function tween(x) {
      var y = -(x - 50) * (x - 50) / 2500 + 1;
      return y > 0 ? y : 0;
    }

    function render() {
      var c = ctx,
          d = dataArr,
          p,
          i,
          t,
          JUMP = 80;

      ++bg;
      if (bg > BG_WIDTH) {
        bg = 0;
      }
      sty.backgroundPosition = bg + 'px 0';

      c.save();
      c.globalCompositeOperation = 'source-over';
      c.fillStyle = 'rgba(0, 0, 0, .1)';
      c.fillRect(0, 0, WIDTH, HEIGHT);
      c.restore();

      if (per < 100) {
        c.save();
        t = tween(per);
        c.globalAlpha = t;
        c.translate(centerX, centerY - t * JUMP);
        for (i = d.length; i--;) {
          p = d[i];
          c.fillRect(p[0] * RADIUS * per / 10000, p[1] * RADIUS * per / 10000, 1, 1);
        }
        c.restore();
      }

      if (per < 110) {
        requestAnimationFrame(render);
      } else {
        initPos();
      }
      ++per;
    }

    function initPos() {
      centerX = Math.random() * WIDTH;
      centerY = Math.random() * HEIGHT;
      per = 0;
      setTimeout(function () {
        render();
      }, 800);
    }
  };
  var data = getData(base64);
  renderHanabi(data);
})(
// 好きな画像のbase64エンコード
'data:image/png;base64,hogehoge;');