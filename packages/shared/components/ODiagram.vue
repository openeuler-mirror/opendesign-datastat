<script setup lang="ts">
import * as d3 from "d3";
import { HierarchyNode } from "d3";
import { nextTick, onMounted, ref, watch } from "vue";
import html2canvas from "html2canvas";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { IObject } from "../@types/interface";
import { hasPermission, hasPermissions } from "../utils/login";
import { isTest } from "../utils/helper";
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      name: "flare",
      children: [
        {
          name: "sig",
          children: [
            {
              name: "A c",
              key: "A",
              imports: [],
            },
            {
              name: "B",
              imports: [],
            },
            {
              name: "C",
              imports: [],
            },
            {
              name: "D",
              imports: [],
            },
          ],
        },
        {
          name: "company",
          children: [
            {
              name: "a",
              key: "中文",
              imports: ["flare.sig.A c", "flare.sig.B", "flare.sig.C", "flare.sig.D"],
            },
            {
              name: "b",
              imports: ["flare.sig.A c", "flare.sig.B", "flare.sig.C", "flare.sig.D"],
            },
          ],
        },
      ],
    }),
  },
});
const isPhone = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
const { t } = useI18n();
const router = useRouter();
const colorin = "#000";
const colornone = "#ccc";
const colorCompany = "#002FA7";
const nocolor = "#cccccc";
const colorSig = "#FEB32A";
const width = 1200;
const radius = width / 2.8;
const line = d3
  .lineRadial()
  .curve(d3.curveBundle.beta(0.85))
  .radius((d: IObject) => d.y)
  .angle((d: IObject) => d.x);
const tree = d3.cluster().size([2 * Math.PI, radius - 100]);
function bilink(root: HierarchyNode<unknown>) {
  const map = new Map(root.leaves().map((d: IObject) => [id(d), d]));
  for (const d of root.leaves() as any)
    (d.incoming = []), (d.outgoing = d.data.imports.map((i: string) => [d, map.get(i)]));
  for (const d of root.leaves() as any) for (const o of d.outgoing) o[1].incoming.push(o);
  root.sort((a: any, b: any) => {
    if (a?.incoming?.length) {
      return d3.ascending(b?.incoming?.length, a?.incoming?.length);
    } else {
      return d3.ascending(a?.outgoing?.length, b?.outgoing?.length);
    }
  });
  return root;
}
function id(node: IObject): string {
  return `${node.parent ? `${id(node.parent)}.` : ""}${node.data.name}`;
}
const getTextColor = (d: IObject) => {
  if (d?.parent?.data?.name === "company" && hasPermission("companyread_all")) {
    return colorCompany;
  } else if (d?.parent?.data?.name === "company") {
    return nocolor;
  }
  return colorSig;
};
let tipTimer: any;
const clearTip = () => {
  tipTimer = setTimeout(() => {
    tooltip.style("display", "none");
  }, 1000);
};
const keepTip = () => {
  tipTimer && clearTimeout(tipTimer);
};
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "diagram-tooltip")
  .attr("opacity", 0.9)
  .attr("display", "none")
  .on("mouseover", keepTip)
  .on("mouseout", clearTip);
const getTipsHtml = (d: IObject) => {
  const jump = () => {
    router.push("/${localStorage.lang}/company/${d.data.name}");
  };
  if (d?.parent?.data?.name === "company" && hasPermission("companyread_all")) {
    return `<div>${t("company")}</div>
            <div style="padding: 8px 0">
              <span style="font-size: 16px" class="mark">${d.data.name}</span>
              ${t("Participated1")}
              <span style="font-size: 18px" class="mark">
              ${d.outgoing.length}
              </span> ${t("Participated2")}
            </div>
            <div class="mark"
            style="cursor: pointer"
                onclick="window.open(
        '${window?.location?.origin}/${localStorage?.lang}/company/${d.data.key}',
        '_blank'
      )"
            >${t("viewDetail")} <span style="color: #002fa7">→</span></div>`;
  } else if (d?.parent?.data?.name === "company") {
    return `<div>${t("company")}</div>
            <div style="padding: 8px 0">
              <span style="font-size: 16px" class="mark">${d.data.name}</span>
              ${t("Participated1")}
              <span style="font-size: 18px" class="mark">
              ${d.outgoing.length}
              </span> ${t("Participated2")}
            </div>`;
  }
  return `<div>${t("interestGroup")}</div>
            <div style="padding: 8px 0">
              <span style="font-size: 16px" class="mark">
                ${d.data.name}
              </span>
                ${t("Participated3")}
              <span style="font-size: 18px" class="mark">${d.incoming.length}</span> ${t(
    "Participated4"
  )}
            </div>
            <div class="mark"  style="cursor: pointer"
                onclick="window.open(
        '${window?.location?.origin}/${localStorage?.lang}/sig/${d.data.key}',
        '_blank'
      )"
            >${t("viewDetail")} <span style="color: #002fa7">→</span></div>`;
};
const chart = () => {
  const root = tree(bilink(d3.hierarchy(props.data)));

  const svg = d3.select("#svg").attr("viewBox", [-width / 2, -width / 2, width, width]);
  const node = svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`)
    .append("text")
    .attr("dy", "0.31em")
    .attr("x", (d) => (d.x < Math.PI ? 6 : -6))
    .attr("fill", (d: IObject) => getTextColor(d))
    .attr("text-anchor", (d) => (d.x < Math.PI ? "start" : "end"))
    .attr("transform", (d) => (d.x >= Math.PI ? "rotate(180)" : null))
    .attr("cursor", (d: IObject) =>
      hasPermission("companyread_all") ? "pointer" : "auto"
    )
    .text((d: IObject) => d.data.name)
    .each(function (d: IObject) {
      d.text = this;
    })
    .on("mouseover", overed)
    .on("mouseout", outed)
    .on("click", jumped);

  const link = svg
    .append("g")
    .attr("stroke", colornone)
    .attr("fill", "none")
    .selectAll("path")
    .data(root.leaves().flatMap((leaf: IObject) => leaf.outgoing))
    .join("path")
    .style("mix-blend-mode", "multiply")
    .attr("d", ([i, o]) => line(i.path(o)))
    .each(function (d) {
      d.path = this;
    });

  function jumped(this: any, event: IObject, d: IObject) {
    // 手机端不执行
    if (isPhone) {
      return;
    }
    if (d?.parent?.data?.name === "company" && hasPermission("companyread_all")) {
      window.open(
        `${window?.location?.origin}/${localStorage?.lang}/company/${d.data.key}`,
        "_blank"
      );
    } else if (d?.parent?.data?.name === "sig") {
      window.open(
        `${window?.location?.origin}/${localStorage?.lang}/sig/${d.data.key}`,
        "_blank"
      );
    }
  }
  function overed(this: any, event: IObject, d: IObject) {
    // 手机端不执行
    if (isPhone) {
      return;
    }
    keepTip();
    tooltip
      .html(getTipsHtml(d))
      .style("display", "block")
      .style("left", `${event.pageX + 5}px`)
      .style("top", `${event.pageY}px`);
    link.style("mix-blend-mode", null);
    d3.select(this).attr("font-weight", "bold");
    d3.selectAll("text").attr("fill", (dd: any) => {
      if (dd.data.name === d.data.name) {
        return getTextColor(dd);
      }
      return colornone;
    });
    d3.selectAll(d.incoming.map((d: IObject) => d.path))
      .attr("stroke", colorin)
      .raise();
    d3.selectAll(d.incoming.map((d: IObject) => d[0].text))
      .attr("fill", colorCompany)
      .attr("font-weight", "bold");
    d3.selectAll(d.outgoing.map((d: IObject) => d.path))
      .attr("stroke", colorin)
      .raise();
    d3.selectAll(d.outgoing.map((d: IObject) => d[1].text))
      .attr("fill", colorSig)
      .attr("font-weight", "bold");
  }

  function outed(this: any, event: IObject, d: IObject) {
    // 手机端不执行
    if (isPhone) {
      return;
    }
    clearTip();
    link.style("mix-blend-mode", "multiply");
    d3.select(this).attr("font-weight", null);
    d3.selectAll(d.incoming.map((d: IObject) => d.path)).attr("stroke", null);
    d3.selectAll(d.incoming.map((d: IObject) => d[0].text))
      // .attr('fill', null)
      .attr("font-weight", null);
    d3.selectAll(d.outgoing.map((d: IObject) => d.path)).attr("stroke", null);
    d3.selectAll(d.outgoing.map((d: IObject) => d[1].text))
      // .attr('fill', null)
      .attr("font-weight", null);
    d3.selectAll("text").attr("fill", (d: any) => getTextColor(d));
  }

  return svg.node();
};
watch(
  () => props.data,
  () => {
    chart();
    if (isPhone) {
      nextTick(() => {
        html2canvas(wrapIns.value as HTMLElement, {
          useCORS: true,
          allowTaint: true,
        }).then((canvas) => {
          const img = new Image();
          // 导出图片地址
          img.src = canvas.toDataURL();
          imgSrc.value = canvas.toDataURL();
        });
      });
    }
  },
  { deep: true }
);
onMounted(() => {
  chart();
});
const wrapIns = ref({});
const imgSrc = ref("");
</script>
<template>
  <div class="img-wrap">
    <div ref="wrapIns" :style="{ visibility: isPhone && imgSrc ? 'hidden' : 'visible' }">
      <svg v-if="isPhone" id="svg" :width="'100%'" :height="'100%'"></svg>
      <svg v-else id="svg" :width="width" :height="width"></svg>
    </div>
    <div v-if="isPhone && imgSrc" class="img-png">
      <img :src="imgSrc" alt="img" class="png" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.t {
  transition: "opcity" 3s;
}
.img-wrap {
  position: relative;
  .img-png {
    position: absolute;
    top: 0;
  }
}
.png {
  width: 100%;
  height: 100%;
}
</style>
