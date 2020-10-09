<template>
  <div>
    <div class="tishi">
     <p>{{title}}</p>

    </div>
  </div>
</template>
<script>
import {
Languge
} from "../api/index.js";
export default {
  data(){
    return {
      title:''
    }
  },
  mounted(){
    if(navigator.onLine){
      if (Languge() != "zh") {
        this.title='request timeout' 
      }else{
        this.title='请求超时'      
      }
    }else{
      if (Languge() != "zh") {
        this.title='No network' 
      }else{
        this.title='无网络连接'      
      }
    }
  }
}
</script>
<style scoped>
.tishi{
  width:4rem /* 150/37.5 */;
  background: #444;
  border-radius: .32rem /* 12/37.5 */;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,0)
}
.tishi p{
  color: aliceblue;
  font-size: .346667rem /* 13/37.5 */;
  text-align: center;
  padding: .533333rem /* 20/37.5 */ 0;
}
</style>

