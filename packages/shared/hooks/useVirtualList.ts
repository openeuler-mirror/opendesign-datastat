import { computed, onMounted, onUnmounted, ref, Ref, unref } from 'vue';

export default function useVirtualList<T>(el: Ref<HTMLElement> | HTMLElement, data: Ref<T[]> | T[], itemHeight: number) {
  const startIndex = ref(0);
  const totalHeight = computed(() => (unref(data)?.length ?? 0) * itemHeight);
  const containerHeight = ref(0);
  const visibleCount = computed(() => {
    const container = unref(el);
    if (!container) return 0;
    return Math.ceil(containerHeight.value / itemHeight);
  });
  const visibleData = computed(() => unref(data)?.slice(startIndex.value, startIndex.value + visibleCount.value) ?? []);
  const windowOffset = ref(0)
  function update() {
    const container = unref(el);
    startIndex.value = Math.floor((container?.scrollTop ?? 0) / itemHeight);
  }

  let obs: ResizeObserver | null = null;

  onMounted(() => {
    const container = unref(el);
    containerHeight.value = container.clientHeight;
    obs = new ResizeObserver(([res]) => {
      containerHeight.value = res.contentRect.height;
    });
    obs.observe(container);
    container.addEventListener('scroll', function () {
      const scrollTop = this.scrollTop;
      startIndex.value = Math.floor(scrollTop / itemHeight);
      windowOffset.value = scrollTop - (scrollTop % itemHeight);
    });
  });

  onUnmounted(() => obs?.disconnect());

  return {
    startIndex,
    visibleCount,
    visibleData,
    totalHeight,
    windowOffset,
    update
  };
}
