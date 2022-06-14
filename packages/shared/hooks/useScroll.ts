import { onMounted, onUnmounted, ref } from 'vue';

// gauss repo select
const isGaussScrollUp = ref(false);
const useScroll = (element: string) => {
  const w: Window = window;
  const isScrollDown = ref(false);
  const isScrollUp = ref(false);
  const handleScroll = (e: any) => {
    if (e.target.closest('.el-select-dropdown')) return;
    const sTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (element === 'up') {
      if (sTop === 0) {
        if (e.wheelDelta || e.detail) {
          if (e.wheelDelta > 0 || e.detail > 0) {
            isScrollUp.value = true;
            isGaussScrollUp.value = true;
          }
        }
      }
    } else if (element === 'down') {
      if (e.wheelDelta || e.detail) {
        if (e.wheelDelta < 0 || e.detail < 0) {
          isScrollDown.value = true;
          isGaussScrollUp.value = false;
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
    isGaussScrollUp,
  };
};
export default useScroll;
