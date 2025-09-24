const watches = [
  {
    id: 1,
    name: "Apple Watch Series 9",
    brand: "apple",
    price: 2999,
    rating: 4.8,
    features: ["心电图监测", "血氧检测", "GPS", "防水50米", "全天候显示"],
    image: "⌚",
  },
  {
    id: 2,
    name: "华为 Watch 4 Pro",
    brand: "huawei",
    price: 2699,
    rating: 4.6,
    features: ["eSIM独立通话", "健康监测", "长续航", "卫星通信", "运动模式"],
    image: "⌚",
  },
  {
    id: 3,
    name: "三星 Galaxy Watch6",
    brand: "samsung",
    price: 1899,
    rating: 4.5,
    features: ["睡眠监测", "身体成分分析", "旋转表圈", "无线充电", "健康管理"],
    image: "⌚",
  },
  {
    id: 4,
    name: "小米手环8 Pro",
    brand: "xiaomi",
    price: 399,
    rating: 4.3,
    features: ["超长续航", "血氧心率监测", "多种运动模式", "NFC", "性价比高"],
    image: "⌚",
  },
  {
    id: 5,
    name: "Garmin Fenix 7",
    brand: "garmin",
    price: 4580,
    rating: 4.7,
    features: ["专业运动追踪", "太阳能充电", "地图导航", "多星定位", "极限运动"],
    image: "⌚",
  },
  {
    id: 6,
    name: "Apple Watch SE",
    brand: "apple",
    price: 1999,
    rating: 4.4,
    features: ["基础健康监测", "GPS", "防水", "运动追踪", "性价比选择"],
    image: "⌚",
  },
]

function getPriceRange(price) {
  if (price < 1000) return "budget"
  if (price <= 3000) return "mid-range"
  return "premium"
}

function renderWatches(watchesToRender) {
  const grid = document.getElementById("watch-grid")
  grid.innerHTML = ""

  if (watchesToRender.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: #7f8c8d; font-size: 1.2rem;">没有找到匹配的手表</p>'
    return
  }

  watchesToRender.forEach((watch) => {
    const card = document.createElement("div")
    card.className = "watch-card"
    card.innerHTML = `
            <div class="watch-image">${watch.image}</div>
            <div class="watch-info">
                <h3>${watch.name}</h3>
                <div class="watch-brand">${watch.brand.charAt(0).toUpperCase() + watch.brand.slice(1)}</div>
                <div class="watch-price">¥${watch.price}</div>
                <ul class="watch-features">
                    ${watch.features.map((feature) => `<li>${feature}</li>`).join("")}
                </ul>
                <div class="rating">评分: ${watch.rating}/5</div>
            </div>
        `
    grid.appendChild(card)
  })
}

function filterWatches() {
  const priceFilter = document.getElementById("price-range").value
  const brandFilter = document.getElementById("brand").value

  const filteredWatches = watches.filter((watch) => {
    const priceMatch = priceFilter === "all" || getPriceRange(watch.price) === priceFilter
    const brandMatch = brandFilter === "all" || watch.brand === brandFilter
    return priceMatch && brandMatch
  })

  renderWatches(filteredWatches)
}

document.addEventListener("DOMContentLoaded", () => {
  renderWatches(watches)

  document.getElementById("price-range").addEventListener("change", filterWatches)
  document.getElementById("brand").addEventListener("change", filterWatches)
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("price-range").value = "all"
    document.getElementById("brand").value = "all"
    renderWatches(watches)
  }
})
