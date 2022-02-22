<template>
  <div class="development-language">
    <div>
      <p>Java<span>29%</span></p>
    </div>
    <div>
      <p>C<span>25%</span></p>
    </div>
    <div>
      <p>C/C++<span>10%</span></p>
    </div>
    <div>
      <p>Go<span>10%</span></p>
    </div>
    <div>
      <p>Go<span>10%</span></p>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.development-language {
  position: relative;
  div {
    position: absolute;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 12px;

    animation: 0.5s ease-out backwards;
    animation-name: fadeinT;
    p {
      text-align: center;
    }
    span {
      display: block;
      font-size: 24px;
      margin-top: 8px;
    }
    &:nth-child(1) {
      background-color: #0a2255;
      width: 260px;
      height: 260px;
      left: 20px;
    }
    &:nth-child(2) {
      background-color: #a08dfc;
      width: 235px;
      height: 235px;
      left: 325px;
      top: 80px;
      animation-duration: 0.8s;
    }
    &:nth-child(3) {
      background-color: #679bec;
      width: 180px;
      height: 180px;
      left: 580px;
      top: 0px;
      animation-duration: 1.1s;
    }
    &:nth-child(4) {
      background-color: #fdc96e;
      width: 140px;
      height: 140px;
      left: 630px;
      bottom: 0px;
      animation-duration: 1.4s;
    }
    &:nth-child(5) {
      background-color: #79daab;
      width: 100px;
      height: 100px;
      left: 850px;
      top: 120px;
      animation-duration: 1.7s;
    }
  }
}
@keyframes fadeinT {
  0% {
    opacity: 0;
    -webkit-transform: translateY(100px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
  }
}
</style>
