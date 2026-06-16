import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 实时天气（Open-Meteo 免 API Key）
 * 默认坐标：上海，latitude=31.23, longitude=121.47
 * @param {Object} options
 * @param {number} options.lat
 * @param {number} options.lon
 * @param {string} options.locationName - 显示的城市名
 * @param {number} options.interval - 刷新间隔（ms），默认 30 分钟
 */
export function useWeather(options = {}) {
  const {
    lat = 31.23,
    lon = 121.47,
    locationName = '上海',
    interval = 30 * 60 * 1000,
  } = options

  const weather = ref({
    location: locationName,
    temperature: null,
    weatherCode: null,
    weatherText: '加载中…',
    icon: 'mdi:weather-cloudy',
  })
  const loading = ref(false)
  const error = ref(null)
  let timer = null

  function describeCode(code) {
    if (code === 0) return { text: '晴', icon: 'mdi:weather-sunny' }
    if ([1, 2].includes(code)) return { text: '多云', icon: 'mdi:weather-partly-cloudy' }
    if (code === 3) return { text: '阴', icon: 'mdi:weather-cloudy' }
    if ([45, 48].includes(code)) return { text: '雾', icon: 'mdi:weather-fog' }
    if ([51, 53, 55].includes(code)) return { text: '小雨', icon: 'mdi:weather-rainy' }
    if ([61, 63, 65].includes(code)) return { text: '雨', icon: 'mdi:weather-pouring' }
    if ([71, 73, 75].includes(code)) return { text: '雪', icon: 'mdi:weather-snowy' }
    if ([80, 81, 82].includes(code)) return { text: '阵雨', icon: 'mdi:weather-rainy' }
    if ([95, 96, 99].includes(code)) return { text: '雷雨', icon: 'mdi:weather-lightning' }
    return { text: '未知', icon: 'mdi:weather-cloudy' }
  }

  async function fetchWeather() {
    loading.value = true
    error.value = null
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const cur = data.current_weather
      if (!cur) throw new Error('No current_weather')
      const { text, icon } = describeCode(cur.weathercode)
      weather.value = {
        location: locationName,
        temperature: Math.round(cur.temperature),
        weatherCode: cur.weathercode,
        weatherText: text,
        icon,
      }
    } catch (e) {
      error.value = e.message || '获取失败'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchWeather()
    timer = setInterval(fetchWeather, interval)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return { weather, loading, error, refresh: fetchWeather }
}
