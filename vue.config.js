module.exports = {
  "devServer": {
    "proxy": {
      "/world_heritage/list/ja/xml": {
        target: "https://whc.unesco.org/ja/list/xml",
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}