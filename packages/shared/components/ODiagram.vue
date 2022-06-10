<script setup lang="ts">
import * as d3 from 'd3';
import { HierarchyNode } from 'd3';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { IObject } from '../@types/interface';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      name: 'flare',
      children: [
        {
          name: 'sig',
          children: [
            {
              name: 'A c',
              key: 'A',
              imports: [],
            },
            {
              name: 'B',
              imports: [],
            },
            {
              name: 'C',
              imports: [],
            },
            {
              name: 'D',
              imports: [],
            },
          ],
        },
        {
          name: 'company',
          children: [
            {
              name: 'a',
              key: '中文',
              imports: [
                'flare.sig.A c',
                'flare.sig.B',
                'flare.sig.C',
                'flare.sig.D',
              ],
            },
            {
              name: 'b',
              imports: [
                'flare.sig.A',
                'flare.sig.B',
                'flare.sig.C',
                'flare.sig.D',
              ],
            },
          ],
        },
      ],
    }),
  },
});
const { t } = useI18n();
const router = useRouter();
const colorin = '#000';
const colornone = '#ccc';
const colorCompany = '#002FA7';
const colorSig = '#FEB32A';
const width = 800;
const radius = width / 1.8;
const line = d3
  .lineRadial()
  .curve(d3.curveBundle.beta(0.85))
  .radius((d: IObject) => d.y)
  .angle((d: IObject) => d.x);
const tree = d3.cluster().size([2 * Math.PI, radius - 100]);
function bilink(root: HierarchyNode<unknown>) {
  const map = new Map(root.leaves().map((d: IObject) => [id(d), d]));
  for (const d of root.leaves())
    (d.incoming = []),
      (d.outgoing = d.data.imports.map((i) => [d, map.get(i)]));
  for (const d of root.leaves())
    for (const o of d.outgoing) o[1].incoming.push(o);
  return root;
}
function id(node: IObject): string {
  return `${node.parent ? `${id(node.parent)}.` : ''}${node.data.name}`;
}
const getTextColor = (d: IObject) => {
  if (d?.parent?.data?.name === 'company') {
    return colorCompany;
  }
  return colorSig;
};
let tipTimer: any;
const clearTip = () => {
  tipTimer = setTimeout(() => {
    tooltip.style('display', 'none');
  }, 1000);
};
const keepTip = () => {
  tipTimer && clearTimeout(tipTimer);
};
const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'diagram-tooltip')
  .attr('opacity', 0.9)
  .attr('display', 'none')
  .on('mouseover', keepTip)
  .on('mouseout', clearTip);
const getTipsHtml = (d: IObject) => {
  const jump = () => {
    router.push('/${localStorage.lang}/company/${d.data.name}');
  };
  if (d?.parent?.data?.name === 'company') {
    return `<div>${t('company')}</div>
            <div style="padding: 8px 0">
              <span style="font-size: 16px" class="mark">${d.data.name}</span> 
              ${t('Participated1')} 
              <span style="font-size: 18px" class="mark">
              ${d.outgoing.length}
              </span> ${t('Participated2')}
            </div>
            <div class="mark" 
                onclick="window.location.href='${window?.location?.origin}/${
      localStorage?.lang
    }/company/${d.data.key}'"
            >${t('viewDetail')} <span style="color: #002fa7">→</span></div>`;
  }
  return `<div>${t('interestGroup')}</div>
            <div style="padding: 8px 0">
              <span style="font-size: 16px" class="mark">
                ${d.data.name}
              </span> 
                ${t('Participated3')}  
              <span style="font-size: 18px" class="mark">${
                d.incoming.length
              }</span> ${t('Participated4')}
            </div>
            <div class="mark"
                onclick="window.location.href='${window?.location?.origin}/${
    localStorage?.lang
  }/sig/${d.data.key}'"
            >${t('viewDetail')} <span style="color: #002fa7">→</span></div>`;
};
const chart = () => {
  const root = tree(
    bilink(
      d3
        .hierarchy(props.data)
        .sort(
          (a, b) =>
            d3.ascending(b.height, a.height) ||
            d3.ascending(b.data.name, a.data.name)
        )
    )
  );

  const svg = d3
    .select('#svg')
    .attr('viewBox', [-width / 2, -width / 2, width, width]);
  const node = svg
    .append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .selectAll('g')
    .data(root.leaves())
    .join('g')
    .attr(
      'transform',
      (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
    )
    .append('text')
    .attr('dy', '0.31em')
    .attr('x', (d) => (d.x < Math.PI ? 6 : -6))
    .attr('fill', (d: IObject) => getTextColor(d))
    .attr('text-anchor', (d) => (d.x < Math.PI ? 'start' : 'end'))
    .attr('transform', (d) => (d.x >= Math.PI ? 'rotate(180)' : null))
    .attr('cursor', () => 'pointer')
    .text((d) => d.data.name)
    .each(function (d) {
      d.text = this;
    })
    .on('mouseover', overed)
    .on('mouseout', outed);

  const link = svg
    .append('g')
    .attr('stroke', colornone)
    .attr('fill', 'none')
    .selectAll('path')
    .data(root.leaves().flatMap((leaf) => leaf.outgoing))
    .join('path')
    .style('mix-blend-mode', 'multiply')
    .attr('d', ([i, o]) => line(i.path(o)))
    .each(function (d) {
      d.path = this;
    });

  function overed(event, d) {
    keepTip();
    tooltip
      .html(getTipsHtml(d))
      .style('display', 'block')
      .style('left', `${event.pageX}px`)
      .style('top', `${event.pageY + 20}px`);
    link.style('mix-blend-mode', null);
    d3.select(this).attr('font-weight', 'bold');
    d3.selectAll('text').attr('fill', (dd: any) => {
      if (dd.data.name === d.data.name) {
        return getTextColor(dd);
      }
      return colornone;
    });
    d3.selectAll(d.incoming.map((d) => d.path))
      .attr('stroke', colorin)
      .raise();
    d3.selectAll(d.incoming.map(([d]) => d.text))
      .attr('fill', colorCompany)
      .attr('font-weight', 'bold');
    d3.selectAll(d.outgoing.map((d) => d.path))
      .attr('stroke', colorin)
      .raise();
    d3.selectAll(d.outgoing.map(([, d]) => d.text))
      .attr('fill', colorSig)
      .attr('font-weight', 'bold');
  }

  function outed(event, d) {
    clearTip();
    link.style('mix-blend-mode', 'multiply');
    d3.select(this).attr('font-weight', null);
    d3.selectAll(d.incoming.map((d) => d.path)).attr('stroke', null);
    d3.selectAll(d.incoming.map(([d]) => d.text))
      // .attr('fill', null)
      .attr('font-weight', null);
    d3.selectAll(d.outgoing.map((d) => d.path)).attr('stroke', null);
    d3.selectAll(d.outgoing.map(([, d]) => d.text))
      // .attr('fill', null)
      .attr('font-weight', null);
    d3.selectAll('text').attr('fill', (d: any) => getTextColor(d));
  }

  return svg.node();
};
onMounted(() => {
  chart();
});
</script>
<template>
  <div>
    <svg id="svg" :width="width" :height="width"></svg>
  </div>
</template>
<style lang="scss" scoped>
.t {
  transition: 'opcity' 3s;
}
</style>
