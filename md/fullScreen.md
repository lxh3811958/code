## 监听是否全屏

```js
const resize = () => {
  const fullScreen = !!(
    window.fullScreen ||
    document.webkitIsFullScreen ||
    document.msFullscreenEnabled
  );
  return fullScreen;
};

window.addEventListener("resize", resize);
window.removeEventListener("resize", resize);
```

## 全屏

```js
const requestFullScreen = () => {
  const ele = document.documentElement;
  const cb =
    ele.requestFullScreen ||
    ele.webkitRequestFullScreen ||
    ele.mozRequestFullScreen ||
    ele.msRequestFullScreen;
  if (typeof cb === "function") {
    cb.call(ele);
  }
};
```

## 取消全屏

```js
const cancelFullScreen = () => {
  const cb =
    document.exitFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitExitFullscreen;
  if (typeof cb === "function") {
    cb.call(document);
  }
};
```
