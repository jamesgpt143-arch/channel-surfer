export interface Channel {
  id: string;
  title: string;
  manifest: string;
  keys: { kid: string; key: string }[];
  category: string;
}

const categorize = (title: string): string => {
  const t = title.toLowerCase();
  if (/news|cnn|bloomberg|aljazeera|france24|channelnews|bbc.*world|onenews|cgtn/.test(t)) return "News";
  if (/sport|nba|pba|uaap|premier|spotv|tap_sport|onesport/.test(t)) return "Sports";
  if (/movie|hbo|cinemax|cinema|hits_movie|tagalog|tvn|celestial|viva|tapmovie/.test(t)) return "Movies";
  if (/cartoon|nick|dreamwork|moonbug|animax/.test(t)) return "Kids";
  if (/food|hgtv|travel|history|discovery|animal|bbc.*earth|fashion|global/.test(t)) return "Lifestyle";
  if (/tv5|a2z|kapatid|ibc|ptv|nbn|oneph|rptv|tvup|tvmaria|wil|deped|pbo|buko/.test(t)) return "Local";
  if (/entertainment|axn|warner|thrill|crime|lifetime|kix|rock_ent|hits_hd|hitsnow/.test(t)) return "Entertainment";
  return "Other";
};

const parseKey = (key: string | string[]): { kid: string; key: string }[] => {
  const raw = Array.isArray(key) ? key : [key];
  return raw.map((k) => {
    const [kid, keyVal] = k.split(":");
    return { kid, key: keyVal };
  });
};

const rawChannels = [
  { Title: "rptv", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cnn_rptv_prod_hd/default/index.mpd", Key: ["1917f4caf2364e6d9b1507326a85ead6:a1340a251a5aa63a9b0ea5d9d7f67595"] },
  { Title: "truefmtv", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/truefm_tv/default/index.mpd", Key: "a4e2b9d61c754f3a8d109b6c2f1e7a55:1d8d975f0bc2ed90eda138bd31f173f4" },
  { Title: "wil-tv", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/wiltv/default/index.mpd", Key: ["b1773d6f982242cdb0f694546a3db26f:ae9a90dbea78f564eb98fe817909ec9a"] },
  { Title: "kapatid_hd", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/kapatid_hd/default/index.mpd", Key: "045d103180f64562b1db7c932741c3ba:c3380548b9075c767a6ae2006ef4bff8" },
  { Title: "tv5vibetv", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/tv5_hd/default1/index.mpd", Key: ["2615129ef2c846a9bbd43a641c7303ef:07c7f996b1734ea288641a68e1cfdc4d"] },
  { Title: "oneph", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/oneph_sd/default/index.mpd", Key: "b1c7e9d24f8a4d6c9e337a2f1c5b8d60:8ff2e524cc1e028f2a4d4925e860c796" },
  { Title: "tv5", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/tv5_hd/default1/index.mpd", Key: ["2615129ef2c846a9bbd43a641c7303ef:07c7f996b1734ea288641a68e1cfdc4d"] },
  { Title: "bilyonaryoch", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/bilyonaryoch/default/index.mpd", Key: ["227ffaf09bec4a889e0e0988704d52a2:b2d0dce5c486891997c1c92ddaca2cd2"] },
  { Title: "cg_hitsnow", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hitsnow/default/index.mpd", Key: "f9c3d6b18a2e4d7f9e453b1a8c6d2f70:ce8874347ec428c624558dcdc3575dd4" },
  { Title: "cg_hbohd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbohd/default/index.mpd", Key: "c2b7a1e95d4f4c3a8e617f9d0a2b6c18:27fca1ab042998b0c2f058b0764d7ed4" },
  { Title: "tvup_prd", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/tvup_prd/default/index.mpd", Key: "e6d1f4a82b9c4f7e9a135c8d7b0e1f26:a5ec27f2fd8e81e7ca224b22a326c8f2" },
  { Title: "tvmaria_prd", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/tvmaria_prd/default/index.mpd", Key: ["fa3998b9a4de40659725ebc5151250d6:998f1294b122bbf1a96c1ddc0cbb229f"] },
  { Title: "lotusmacau_prd", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/lotusmacau_prd/default/index.mpd", Key: "9a7c2d1f4e8b4a6d8f301b5c9e7d2a44:ca88469cabc18aa33d1f2e46a6efb4f7" },
  { Title: "cg_tvnmovie", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_tvnmovie/default/index.mpd", Key: ["2e53f8d8a5e94bca8f9a1e16ce67df33:3471b2464b5c7b033a03bb8307d9fa35"] },
  { Title: "cg_dreamworktag", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_dreamworktag/default/index.mpd", Key: ["564b3b1c781043c19242c66e348699c5:d3ad27d7fe1f14fb1a2cd5688549fbab"] },
  { Title: "cg_tagalogmovie", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_tagalogmovie/default/index.mpd", Key: ["96701d297d1241e492d41c397631d857:ca2931211c1a261f082a3a2c4fd9f91b"] },
  { Title: "globaltrekker", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/globaltrekker/default/index.mpd", Key: "b7a6c5d23f1e4a9d8c721e5d9f4a6b13:63ca9ad0d88fccb8c667b028f47287ba" },
  { Title: "cgtnenglish", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cgtn/default/index.mpd", Key: ["0f854ee4412b11edb8780242ac120002:9f2c82a74e727deadbda389e18798d55"] },
  { Title: "cartoon_net_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cartoonnetworkhd/default/index.mpd", Key: ["a2d1f552ff9541558b3296b5a932136b:cdd48fa884dc0c3a3f85aeebca13d444"] },
  { Title: "cnn_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_cnnhd/default/index.mpd", Key: ["900c43f0e02742dd854148b7a75abbec:da315cca7f2902b4de23199718ed7e90"] },
  { Title: "a2z", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_a2z/default/index.mpd", Key: "3f6d8a2c1b7e4c9f8d52a7e1b0c6f93d:4019f9269b9054a2b9e257b114ebbaf2" },
  { Title: "animal_planet", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_animal_planet_sd/default/index.mpd", Key: "1c9f7a6d3b2e4e5d8a61f4d0c2b9e813:b8f52451c67a2b54f272543eef45b621" },
  { Title: "SPOTV_HD", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_spotvhd/default/index.mpd", Key: ["ec7ee27d83764e4b845c48cca31c8eef:9c0e4191203fccb0fde34ee29999129e"] },
  { Title: "nbn4", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_ptv4_sd/default/index.mpd", Key: ["71a130a851b9484bb47141c8966fb4a3:ad1f003b4f0b31b75ea4593844435600"] },
  { Title: "premiersports_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_ps_hd1/default/index.mpd", Key: ["b8b595299fdf41c1a3481fddeb0b55e4:cd2b4ad0eb286239a4a022e6ca5fd007"] },
  { Title: "blueant_extreme", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_rockextreme/default/index.mpd", Key: "8d2a6f1c9b7e4c3da5f01e7b9c6d2f44:23841651ebf49fa03fdfcd7b43337f87" },
  { Title: "tap_sports", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_tapsports/default/index.mpd", Key: "5e7c1b9a2d8f4a6c9f30b1d6e2a8c744:6178d9d177689eec5028e2dd608ae7b6" },
  { Title: "bbcearth_hd", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_bbcearth_hd1/default/index.mpd", Key: ["34ce95b60c424e169619816c5181aded:0e2a2117d705613542618f58bf26fc8e"] },
  { Title: "onesportsplus_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_onesportsplus_hd1/default/index.mpd", Key: "f00bd0122a8a4da1a49ea6c49f7098ad:a4079f3667ba4c2bcfdeb13e45a6e9c6" },
  { Title: "SPOTV_HD2", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_spotv2hd/default/index.mpd", Key: ["7eea72d6075245a99ee3255603d58853:6848ef60575579bf4d415db1032153ed"] },
  { Title: "rock_entertainment", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_rockentertainment/default/index.mpd", Key: "a8b2d6f14c9e4d7a8f552c1e9b7d6a30:b61a33a4281e7c8e68b24b9af466f7b4" },
  { Title: "discovery", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/discovery/default/index.mpd", Key: ["d9ac48f5131641a789328257e778ad3a:b6e67c37239901980c6e37e0607ceee6"] },
  { Title: "cctv4", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_cctv4/default/index.mpd", Key: ["b83566836c0d4216b7107bd7b8399366:32d50635bfd05fbf8189a0e3f6c8db09"] },
  { Title: "pbarush_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_pbarush_hd1/default/index.mpd", Key: "d7f1a9c36b2e4f8d9a441c5e7b2d8f60:fb83c86f600ab945e7e9afed8376eb1e" },
  { Title: "arirang", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/arirang_sd/default/index.mpd", Key: ["13815d0fa026441ea7662b0c9de00bcf:2d99a55743677c3879a068dd9c92f824"] },
  { Title: "onenews_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/onenews_hd1/default/index.mpd", Key: "2e6a9d7c1f4b4c8a8d33c7b1f0a5e924:4c71e178d090332fbfe72e023b59f6d2" },
  { Title: "cg_hbofam", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbofam/default/index.mpd", Key: "872910c843294319800d85f9a0940607:f79fd895b79c590708cf5e8b5c6263be" },
  { Title: "cg_cinemax", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_cinemax/default/index.mpd", Key: "b207c44332844523a3a3b0469e5652d7:fe71aea346db08f8c6fbf0592209f955" },
  { Title: "cg_hbosign", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbosign/default/index.mpd", Key: "a06ca6c275744151895762e0346380f5:559da1b63eec77b5a942018f14d3f56f" },
  { Title: "cg_hbohits", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbohits/default/index.mpd", Key: "b04ae8017b5b4601a5a0c9060f6d5b7d:a8795f3bdb8a4778b7e888ee484cc7a1" },
  { Title: "cg_tvnpre", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_tvnpre/default/index.mpd", Key: "e1bde543e8a140b38d3f84ace746553e:b712c4ec307300043333a6899a402c10" },
  { Title: "cgnl_nba", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cgnl_nba/default/index.mpd", Key: "d1f8a0c97b3d4e529a6f2c4b8d7e1f90:58ab331d14b66bf31aca4284e0a3e536" },
  { Title: "dreamworks_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_dreamworks_hd1/default/index.mpd", Key: "7b1e9c4d5a2f4d8c9f106d3a8b2c1e77:8b2904224c6cee13d2d4e06c0a3b2887" },
  { Title: "kbs_world", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/kbsworld/default/index.mpd", Key: "22ff2347107e4871aa423bea9c2bd363:c6e7ba2f48b3a3b8269e8bc360e60404" },
  { Title: "kix_hd", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/kix_hd1/default/index.mpd", Key: "c9d4b7a18e2f4d6c9a103f5b7e1c2d88:7f3139092bf87d8aa51ee40e6294d376" },
  { Title: "lifetime", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_lifetime/default/index.mpd", Key: "cf861d26e7834166807c324d57df5119:64a81e30f6e5b7547e3516bbf8c647d0" },
  { Title: "bbcworld_news", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/bbcworld_news_sd/default/index.mpd", Key: "f59650be475e4c34a844d4e2062f71f3:119639e849ddee96c4cec2f2b6b09b40" },
  { Title: "hgtv_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/hgtv_hd1/default/index.mpd", Key: "f1e8c2d97a3b4f5d8c669d1a2b7e4c30:03aaa7dcf893e6b934aeb3c46f9df5b9" },
  { Title: "uaap_varsity", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_uaap_cplay_sd/default/index.mpd", Key: "95588338ee37423e99358a6d431324b9:6e0f50a12f36599a55073868f814e81e" },
  { Title: "travel_channel", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/travel_channel_sd/default/index.mpd", Key: "f3047fc13d454dacb6db4207ee79d3d3:bdbd38748f51fc26932e96c9a2020839" },
  { Title: "premier_tennishd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/premiersports2hd/default/index.mpd", Key: "59454adb530b4e0784eae62735f9d850:61100d0b8c4dd13e4eb8b4851ba192cc" },
  { Title: "pbo", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/pbo_sd/default/index.mpd", Key: "dcbdaaa6662d4188bdf97f9f0ca5e830:31e752b441bd2972f2b98a4b1bc1c7a1" },
  { Title: "hits_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/hits_hd1/default/index.mpd", Key: "6d2f8a1c9b5e4c7da1f03e7b9d6c2a55:37c9835795779f8d848a6119d3270c69" },
  { Title: "aljazeera", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_aljazeera/default/index.mpd", Key: "7f3d900a04d84492b31fe9f79ac614e3:d33ff14f50beac42969385583294b8f2" },
  { Title: "foodnetwork_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_foodnetwork_hd1/default/index.mpd", Key: "4a9d2f7c1e6b4c8d8a55d7b1e3f0c926:2e62531bdb450480a18197b14f4ebc77" },
  { Title: "depedchannel", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/depedch_sd/default/index.mpd", Key: "0f853706412b11edb8780242ac120002:2157d6529d80a760f60a8b5350dbc4df" },
  { Title: "history_hd", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_historyhd/default/index.mpd", Key: "e2a8c7d15b9f4d6a9c101f7e3b2d8a44:397ca914a73b1e00bc94ed9eccf9c258" },
  { Title: "fashiontv_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/fashiontvhd/default/index.mpd", Key: "9d7c1f2a6b4e4a8d8f33c1e5b7d2a960:3a18c535c52db7c79823f59036a9d195" },
  { Title: "celestialmovie_pinoy", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/celmovie_pinoy_sd/default/index.mpd", Key: "0f8537d8412b11edb8780242ac120002:2ffd7230416150fd5196fd7ea71c36f3" },
  { Title: "viva", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/viva_sd/default/index.mpd", Key: "07aa813bf2c147748046edd930f7736e:3bd6688b8b44e96201e753224adfc8fb" },
  { Title: "bloomberg", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/bloomberg_sd/default/index.mpd", Key: "3b8e6d1f2c9a4f7d9a556c1e7b2d8f90:09f0bd803966c4befbd239cfa75efe23" },
  { Title: "nhk_japan", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nhk_japan/default/index.mpd", Key: "3d6e9d4de7d7449aadd846b7a684e564:0800fff80980f47f7ac6bc60b361b0cf" },
  { Title: "asianfoodnetwork", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/asianfoodnetwork_sd/default/index.mpd", Key: "1619db30b9ed42019abb760a0a3b5e7f:5921e47fb290ae263291b851c0b4b6e4" },
  { Title: "onesports", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_onesports_hd/default/index.mpd", Key: "53c3bf2eba574f639aa21f2d4409ff11:3de28411cf08a64ea935b9578f6d0edd" },
  { Title: "nickjr", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickjr/default/index.mpd", Key: "bab5c11178b646749fbae87962bf5113:0ac679aad3b9d619ac39ad634ec76bc8" },
  { Title: "warnertv_hd", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_warnerhd/default/index.mpd", Key: "7f2a9c6d1e5b4c8a8d10a2b7e1c9f344:ae3d135d5ddd9e8f3a7bbfbfae0e40d1" },
  { Title: "animax", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_animax_sd_new/default/index.mpd", Key: "1e7b9d2c6a4f4d8c9f33b5c1a8d7e260:67336c0c5b24fb4b8caac248dad3c55d" },
  { Title: "ibc13", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/ibc13_sd_new/default1/index.mpd", Key: "16ecd238c0394592b8d3559c06b1faf5:05b47ae3be1368912ebe28f87480fc84" },
  { Title: "axn", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_axn_sd/default/index.mpd", Key: "8a6c2f1e9d7b4c5aa1f04d2b7e9c1f88:05e6bfa4b6805c46b772f35326b26b36" },
  { Title: "tapmovies_hd", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_tapmovies_hd1/default/index.mpd", Key: "71cbdf02b595468bb77398222e1ade09:c3f2aa420b8908ab8761571c01899460" },
  { Title: "taptv", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_taptv_sd/default/index.mpd", Key: "5c1e7b9d2f6a4d8c8a55e9d2c7b1a344:e72d21a22e89660ff0ec33627eb4ef35" },
  { Title: "moonbug_kids", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_moonbug_kids_sd/default/index.mpd", Key: "0bf00921bec94a65a124fba1ef52b1cd:0f1488487cbe05e2badc3db53ae0f29f" },
  { Title: "france24", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/france24/default/index.mpd", Key: "257f9fdeb39d41bdb226c2ae1fbdaeb6:e80ead0f4f9d6038ab34f332713ceaa5" },
  { Title: "abc_australia", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/abc_aus/default/index.mpd", Key: "d6f1a8c29b7e4d5a8f332c1e9d7b6a90:790bd17b9e623e832003a993a2de1d87" },
  { Title: "hits_movies", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_hitsmovies/default/index.mpd", Key: "2c8a5f1e7b9d4c6a9e55f1d7b2a8c360:c9f622dff27e9e1c1f78617ba3b81a62" },
  { Title: "channelnews_asia", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/channelnewsasia/default/index.mpd", Key: "b259df9987364dd3b778aa5d42cb9acd:753e3dba96ab467e468269e7e33fb813" },
  { Title: "thrill", Manifest: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_thrill_sd/default/index.mpd", Key: "928114ffb2394d14b5585258f70ed183:a82edc340bc73447bac16cdfed0a4c62" },
  { Title: "crime_investigation", Manifest: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/crime_invest/default/index.mpd", Key: "21e2843b561c4248b8ea487986a16d33:db6bb638ccdfc1ad1a3e98d728486801" },
  { Title: "buko", Manifest: "https://live-streaming.live.pldt.quickplay.com/plsdi5/buko.isml/.mpd", Key: "4ebfa6bf03fc4377ad0adee4cd12b298:d4676c3b23e818b5286ede30ffaa4c2d" },
];

export const channels: Channel[] = rawChannels.map((ch) => ({
  id: ch.Title.toLowerCase().replace(/[^a-z0-9]/g, "_"),
  title: ch.Title.replace(/_/g, " ").replace(/cg /gi, "").replace(/dr /gi, "").replace(/prd/gi, "").trim(),
  manifest: ch.Manifest,
  keys: parseKey(ch.Key),
  category: categorize(ch.Title),
}));

export const categories = ["All", ...Array.from(new Set(channels.map((c) => c.category))).sort()];
