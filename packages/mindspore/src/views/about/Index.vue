<script setup lang="ts">
import { computed } from 'vue';
import AppFooter from '@/components/AppFooter.vue';
import { useCommonStore } from '@/stores/common';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const useCommon = useCommonStore();
const language = computed(() => useCommon.language);
locale.value = localStorage.getItem('lang') || 'zh';

const dataList = [
  { label: '社区用户 User', value: '使用开源社区软件包的用户（下载用户）' },
  {
    label: '贡献者 Contributor',
    value:
      '参与了社区开源项目的开发者。包括在开源社区代码仓库参与如下贡献的开发者：star、watch、fork、issue提交、代码提交、评论等贡献',
  },
  {
    label: '单位会员 Organization Member',
    value: '包括签署了CLA的组织等',
  },
  {
    label: '合并请求 PR',
    value:
      '合并请求（Pull Request），是指提交一次代码 ，包括因新的需求编写的新代码或者程序运行异常而进行的修复代码，即通常意义的Bug修复或者特性开发',
  },
  {
    label: '需求&问题 Issue',
    value:
      '指对现有仓库提交的议题（Issue）。对代码仓库提交的问题，或者是一个新的任务，新的功能特性需求',
  },
  {
    label: '评审 Comment',
    value:
      '是指提交的Issue、PR的评论、也就是评审当前PR中的代码，或者对现有的Issue进行回复或者评论',
  },
  {
    label: 'CLA',
    value:
      'Contributor License Agreement, 贡献者许可协议。开源社区需要将所有参与开发的开发者进行正式的认证',
  },
];
const dataListEN = [
  {
    label: 'User',
    value:
      'A user who uses (downloads) the software packages of the open source community',
  },
  {
    label: 'Contributor',
    value:
      'A developer who participates in open source projects in the community. Contributors include developers who star, watch, or fork the community Repository, submit issue or comment, code contributors',
  },
  {
    label: 'Organization Member',
    value: 'An organization that has signed the CLA, etc',
  },
  {
    label: 'PR (Pull Request)',
    value:
      'A pull request (PR) is a submission of code, including new code written for new requirements or code for bug fixes or feature development',
  },
  {
    label: 'Issue',
    value:
      'An issue is an inquiry, task, or feature request submitted to a code repository',
  },
  {
    label: 'Comment',
    value:
      'A comment can be submitted to an issue or PR to reply to or comment on the issue or to review the code in the PR',
  },
  {
    label: 'CLA',
    value:
      'Contributor License Agreement. An open source community needs to authenticate all developers who participate in the development',
  },
];
</script>

<template>
  <div class="about-panel">
    <div class="about-data">
      <h1>{{ t('footer.about') }}</h1>
      <div class="about-data-content">
        <p class="title">1. {{ t('about.explain') }}</p>
        <ul class="about-list">
          <li class="head">
            <span class="lable"> {{ t('about.name') }}</span>
            <div class="value">{{ t('about.definition') }}</div>
          </li>
          <li
            v-for="(item, index) in language === 'zh' ? dataList : dataListEN"
            :key="index"
          >
            <span class="lable">{{ item.label }}</span>
            <div class="value">{{ item.value }}</div>
          </li>
        </ul>
        <div v-if="language === 'zh'" class="info">
          <p class="title">2. 不承诺责任声明</p>
          <p class="text">
            MindSpore开源项目网站所载的材料和信息，包括但不限于文本、图片、数据、观点、建议、网页或链接，MindSpore开源项目力图在网站上提供准确的材料和信息，但MindSpore开源项目并不保证这些材料和内容的准确、完整、充分和可靠性，并且明确声明不对这些材料和内容的错误或遗漏承担责任，也不对这些材料和内容作出任何明示或默示的、包括但不限于有关所有权担保、没有侵犯第三方权利、质量和没有计算机病毒的保证。
            MindSpore开源项目可以在没有任何通知或提示的情况下随时对MindSpore开源项目服务网站上的内容进行修改，为了得到最新版本的信息，请您定时访问MindSpore开源项目网站。MindSpore开源项目在MindSpore开源项目网站上所提及的非MindSpore开源项目产品或服务仅仅是为了提供相关信息，并不构成对这些产品、服务的认可或推荐。MindSpore开源项目并不就网址上提供的任何产品、服务或信息做出任何声明、保证或认可，所有销售的产品和服务应受MindSpore开源项目的销售合同和条款的约束。
            鉴于<a href="https://www.mindspore.cn">https://www.mindspore.cn</a
            >提供的部分服务属于电子公告牌（BBS）服务，<a
              href="https://www.mindspore.cn"
              >https://www.mindspore.cn</a
            >上关于其会员或其会员发布的相关信息（包括但不限于用户名称、公司名称、
            联系人及联络信息，相关图片、视讯等）的信息均是由会员自行提供，会员依法应对其提供的任何信息承担全部责任。
            任何企业或个人认为<a href="https://www.mindspore.cn"
              >https://www.mindspore.cn</a
            >网页内容（包括但不限于<a href="https://www.mindspore.cn"
              >https://www.mindspore.cn</a
            >会员发布的商品信息）可能涉嫌侵犯其合法权益，应该及时向MindSpore开源项目提出书面权利通知，并提供身份证明、权属证明、具体链接（URL）及详细侵权情况证明。MindSpore开源项目在收到上述法律文件后，将会依法尽快移除相关涉嫌侵权的内容。
          </p>
        </div>
        <div v-else class="info">
          <p class="title">2. General Disclaimer</p>
          <p class="text">
            Although MindSpore open source project has attempted to provide
            accurate information on the website (<a
              href="https://www.mindspore.cn"
              >https://www.mindspore.cn</a
            >), including but not limited to the texts, pictures, data,
            opinions, suggestions, web pages, and links, the project does not
            guarantee the accuracy, completeness, fullness or reliability of
            these materials and content, and explicitly states that it does not
            take responsibility for errors or omissions in these data and
            content, or make any express or implied warranty on these materials
            and information, including but not limited to guarantee concerning
            relevant ownerships, free from infringement upon third-party rights,
            quality or computer viruses. MindSpore open source project may
            change the information on the website (<a
              href="https://www.mindspore.cn"
              >https://www.mindspore.cn</a
            >) at any time without notice. You shall periodically visit this
            website to obtain the latest version information. Mention of
            products or services that are not related to MindSpore open source
            project is for information purposes only and constitutes neither an
            endorsement nor a recommendation. MindSpore open source project does
            not provide any statement, guarantee or authorization for any of the
            products or services appearing on the website (<a
              href="https://www.mindspore.cn"
              >https://www.mindspore.cn</a
            >). All products and services are governed by the sales agreement of
            MindSpore open source project. Whereas some of the services provided
            on the website (<a href="https://www.mindspore.cn"
              >https://www.mindspore.cn</a
            >) are bulletin board system (BBS) service, the relevant information
            about or posted by its members on the website (including but not
            limited to usernames, company names, contact persons and details,
            related images and videos) is all provided by the members, who shall
            be full responsible for any information they provide. Any entity or
            individual who considers the content on the website (<a
              href="https://www.mindspore.cn"
              >https://www.mindspore.cn</a
            >) (including but not limited to the commodity information posted by
            the members of the website) suspected of infringing their legal
            interest shall make an infringement statement in writing to
            MindSpore open source project, together with their identification,
            ownership certification, particular URL and detailed proof of
            infringement. MindSpore open source project will remove the content
            alleged to be infringing by law upon receiving the foregoing legal
            document.
          </p>
        </div>
      </div>
    </div>
    <footer>
      <app-footer></app-footer>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
a {
  color: #40adff;
}
.about-panel {
  padding: 80px 0 0;
  background: no-repeat top center;
}
.about-data {
  width: 880px;
  margin: 0px auto 60px;
  h1 {
    font-size: 36px;
    font-weight: 300;
    color: #000;
    line-height: 48px;
    text-align: center;
    margin-top: 40px;
  }
  &-content {
    margin-top: 40px;
    .title {
      font-size: 24px;
      font-weight: 500;
      color: #000000;
      line-height: 32px;
      margin-bottom: 24px;
    }
    .info {
      .text {
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 22px;
        text-align: justify;
      }
    }

    .about-list {
      margin-bottom: 40px;
      list-style: none;
      background: #fff;
      .head {
        background: #e5e8f0;
        font-size: 16px;
        color: #000;
        font-weight: normal;
        text-transform: capitalize;
        line-height: 56px;
        padding: 0 40px;
      }
      li {
        line-height: 22px;
        font-size: 14px;
        color: #555;
        padding: 10px 40px;
        display: grid;
        min-height: 56px;
        grid-template-columns: 220px auto;
        border-bottom: 1px solid #e5e5e5;
        align-items: center;

        .value {
          text-align: justify;
        }
      }
    }
  }
}
</style>
