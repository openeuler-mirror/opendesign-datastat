<script lang="ts" setup>
import { computed, onBeforeMount, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { IObject } from 'shared/@types/interface';
import { ElScrollbar } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import useVirtualList from 'shared/hooks/useVirtualList';

const { t } = useI18n();
const props = defineProps({
  data: {
    type: Array as () => IObject[],
    default: () => [],
  },
  value: {
    type: String,
    default: '',
  },
  dropdownItemIndexGetter: {
    type: Function as PropType<(find: string) => number>,
    required: false,
  }
});

const emit = defineEmits(['update:value']);

// 搜索过滤
const searchInput = ref('');
const reallData = ref([] as IObject[]);
const initReallData = () => {
  reallData.value = [...props.data];
};

onBeforeMount(() => {
  initReallData();
})

watch(
  () => props.data,
  () => {
    initReallData();
  },
  { deep: true }
);

// 顶部选择
const sencondTitle = computed({
  set(v) {
    emit('update:value', v);
  },
  get() {
    return props.value;
  }
});
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const scrollWrapper = computed(() => scrollbarRef.value?.wrap$!)
const { visibleData, totalHeight, windowOffset } = useVirtualList(scrollWrapper, reallData, 32);
const inputSlider = (value: number) => {
  scrollbarRef.value?.setScrollTop(value);
};
const showDropdown = (e: any) => {
  if (e) {
    let number = 0;
    if (typeof props.dropdownItemIndexGetter === 'function') {
      number = props.dropdownItemIndexGetter(sencondTitle.value);
    } else {
      let index = 0;
      for (const item of reallData.value) {
        if (item.label === sencondTitle.value) {
          number = index;
          break;
        }
        index++;
      }
    }
    inputSlider(number * 32);
  }
};

const querySearch = () => {
  if (searchInput.value !== '') {
    const newList = props.data.filter((item: any) =>
      item.label.toLowerCase().includes(searchInput.value)
    );
    reallData.value = newList;
  } else {
    initReallData();
  }
};
// 清除搜索
const clearSearchInput = () => {
  clean();
};
const clean = () => {
  searchInput.value = '';
};

const clickDrownItem = (item: IObject) => {
  clean();
  sencondTitle.value = item.value;
};
</script>

<template>
  <div>
    <el-dropdown
      trigger="click"
      placement="bottom-start"
      @visible-change="showDropdown"
    >
      <div class="title">
        <span :title="sencondTitle">{{ sencondTitle }}</span>
        <span class="btnc"></span>
      </div>
      <template #dropdown>
        <div class="searchInput">
          <el-input
            v-model="searchInput"
            clearable
            :debounce="300"
            class="w-50 m-2"
            :placeholder="t('enterName')"
            :prefix-icon="Search"
            @input="querySearch"
            @clear="clearSearchInput"
          />
        </div>

        <el-scrollbar ref="scrollbarRef" always height="400px" :view-style="{ height: `${totalHeight}px` }">
          <div :style="{ transform: `translateY(${windowOffset}px)` }">
            <el-dropdown-item
              v-for="item in visibleData"
              :key="item.value"
              class="dropdownItem"
              @click="clickDrownItem(item as any)"
            >
              {{ item.label }}</el-dropdown-item
            >
          </div>
        </el-scrollbar>
      </template>
    </el-dropdown>
  </div>
</template>
<style lang="scss" scoped>
.title {
  font-size: 18px;
  font-family: HarmonyOS_Sans_SC_Medium;
  color: #002fa7;
  font-weight: 500;
  height: 1.5rem;
  line-height: 1.5rem;
  text-overflow: ellipsis;
  width: 100vw;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  .btnc {
    background-image: url('@/assets/down.png');
    width: 24px;
    height: 24px;
    position: absolute;
    right: 1rem;
  }
}
.searchInput {
  width: 350px;
  margin: 10px;
  .search-icon {
    font-size: 20px;
  }
  :deep(.el-autocomplete) {
    width: 100%;
    &.active .el-input__inner {
      box-shadow: 0 0 0 1px #002fa7 inset;
    }
  }
  :deep(.el-input__prefix) {
    left: 12px;
    align-items: center;
  }
  @media screen and (min-width: 900px) {
    :deep(.el-input__inner) {
      padding-left: 40px;
    }
  }
  @media screen and (max-width: 900px) {
    :deep(.el-input__prefix) {
      left: 10px;
    }
  }
  :deep(.el-input__inner:focus) {
    box-shadow: 0 0 0 1px #002fa7 inset;
  }
}
</style>
