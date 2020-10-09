// Copyright 2013 Google Inc. All Rights Reserved.
// You may study, modify, and use this example for any purpose.
// Note that this example is provided "as is", WITHOUT WARRANTY
// of any kind either expressed or implied.


export const initAd = () => {
  var ua = navigator.userAgent;
  var isWeixin = ua.indexOf('miniProgram') > -1;
  if (!isWeixin) {
  // if(true){
    var adsManager;
    var adsLoader;
    var adDisplayContainer;
    var intervalTimer;
    var playButton;
    var videoContent;
    var videoContent;
    var adwit = document.documentElement.clientWidth,
      adhit = document.documentElement.clientHeight,
      addiv = document.createElement("div");
    addiv.style.cssText = "position:absolute;width:100%; heitght:100%; text-align:center; top:0; left:0; right:0; bottom:0;";
    addiv.id = "gameContainerv3";
    document.getElementById('content').appendChild(addiv);
    document.getElementById("gameContainerv3").width = adwit;
    document.getElementById("gameContainerv3").height = adhit;
    var adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById("gameContainerv3"));
    adDisplayContainer.initialize();
    var adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, !1);
    adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, !1);

    function onAdError(a) {
      console.log(a.getError());
      a = document.getElementById("gameContainerv3");
      null == a.innerHTML && a.parentNode.removeChild(a);
      null != a && a.parentNode.removeChild(a);
      console.log("adderro!");
      adsManager.destroy()
    }
    var contentEndedListener = function () {
        adsLoader.contentComplete()
      },
      adsRequest = new google.ima.AdsRequest;

    // adsRequest.adTagUrl = "https://googleads.g.doubleclick.net/pagead/ads?ad_type\x3dvideo_image\x26client\x3dca-games-pub-6286294410238482\x26description_url\x3dhttp%3A%2F%2Fwww.dob5.com\x26channel\x3d5555438795\x26videoad_start_delay\x3d0\x26hl\x3den\x26max_ad_duration\x3d30000";
    // adsRequest.adTagUrl = "https://googleads.g.doubleclick.net/pagead/ads?ad_type\x3dvideo_image\x26client\x3dca-games-pub-4968145218643279\x26description_url\x3dhttp%3A%2F%2Fwww.google.com\x26channel\x3d5555438795\x26videoad_start_delay\x3d0\x26hl\x3den\x26max_ad_duration\x3d30000&adtest\x3don";
    adsRequest.adTagUrl = 'https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_text_image&client=ca-games-pub-8878899479089144&description_url=http%3A%2F%2Fcicigirl.com&videoad_start_delay=0&hl=en&max_ad_duration=30000'
    // adsRequest.adTagUrl = 'http://googleads.g.doubleclick.net/pagead/ads?ad_type=video&client=ca-games-pub-4968145218643279&videoad_start_delay=0&description_url=http%3A%2F%2Fwww.google.com&max_ad_duration=20000&adtest=on'

    adsRequest.linearAdSlotWidth = adwit;
    adsRequest.linearAdSlotHeight = adhit;
    adsRequest.nonLinearAdSlotWidth = adwit;
    adsRequest.nonLinearAdSlotHeight = adhit;

    function requestAds() {
      adsLoader.requestAds(adsRequest)
    }

    function onAdsManagerLoaded(a) {
      var b = new google.ima.AdsRenderingSettings;
      b.restoreCustomPlaybackStateOnAdBreakComplete = !0;
      adsManager = a.getAdsManager(b);
      adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
      adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, onContentLoaded);
      adsManager.addEventListener(google.ima.AdEvent.Type.USER_CLOSE, onContentclosed);
      adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested);
      adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested);
      try {
        adsManager.init(adwit, adhit, google.ima.ViewMode.NORMAL), adsManager.start()
      } catch (c) {}
    }

    function onContentLoaded(a) {
      a.getAd().isLinear() || setTimeout(function () {
        var a = document.getElementById("gameContainerv3");
        null != a && a.parentNode.removeChild(a);
        null == a.innerHTML && a.parentNode.removeChild(a);
        console.log("isLinear")
      }, 1E4)
    }

    function onContentclosed() {
      var a = document.getElementById("gameContainerv3");
      null != a && a.parentNode.removeChild(a);
      null == a.innerHTML && a.parentNode.removeChild(a)
    }

    function onContentPauseRequested() {
      document.getElementById("gameContainerv3").style.visibility = "visible";
      console.log("change visibility")
    }

    function onContentResumeRequested() {
      var a = document.getElementById("gameContainerv3");
      null == a.innerHTML && a.parentNode.removeChild(a);
      null != a && a.parentNode.removeChild(a);
      console.log("remove CONTENT__RESUME")
    }
    requestAds();
  }
}