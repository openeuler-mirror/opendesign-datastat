import { onMounted, onUnmounted, ref } from 'vue';

const useScroll = (element: string) => {
  const w: Window = window;
  const isScrollDown = ref(false);
  const isScrollUp = ref(false);
  const handleScroll = (e: any) => {
    const sTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (element === 'up') {
      if (sTop === 0) {
        if (e.wheelDelta || e.detail) {
          if (e.wheelDelta > 0 || e.detail > 0) {
            isScrollUp.value = true;
          }
        }
      }
    } else if (element === 'down') {
      if (e.wheelDelta || e.detail) {
        if (e.wheelDelta < 0 || e.detail < 0) {
          isScrollDown.value = true;
        }
      }
    }
  };
  // 监听滚动事件
  onMounted(() => {
    w.addEventListener('mousewheel', handleScroll, false);
    w.addEventListener('DOMMouseScroll', handleScroll, false);
  });
  // 销毁事件
  onUnmounted(() => {
    w.removeEventListener('mousewheel', handleScroll, false);
    w.removeEventListener('DOMMouseScroll', handleScroll, false);
  });

  return {
    isScrollUp,
    isScrollDown,
  };
};
export default useScroll;
