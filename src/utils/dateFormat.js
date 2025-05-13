/**
 * 格式化日期为中文格式
 * @param {string|Date} date 日期字符串或日期对象
 * @param {string} format 格式化模式 'full'|'short'|'year-month'|'month-day'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'full') {
  if (!date) return ''
  
  const dateObj = date instanceof Date ? date : new Date(date)
  
  if (isNaN(dateObj.getTime())) return ''
  
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  
  switch (format) {
    case 'full':
      return `${year}年${month}月${day}日`
    case 'short':
      return `${month}月${day}日`
    case 'year-month':
      return `${year}年${month}月`
    case 'month-day':
      return `${month}月${day}日`
    default:
      return `${year}年${month}月${day}日`
  }
}

/**
 * 计算相对日期描述
 * @param {string|Date} date 日期字符串或日期对象
 * @returns {string} 相对日期描述
 */
export function getRelativeDate(date) {
  if (!date) return ''
  
  const dateObj = date instanceof Date ? date : new Date(date)
  const now = new Date()
  
  // 计算天数差异
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
  const dayDiff = Math.round((targetDate - today) / (1000 * 60 * 60 * 24))
  
  if (dayDiff === 0) return '今天'
  if (dayDiff === 1) return '明天'
  if (dayDiff === -1) return '昨天'
  if (dayDiff > 0 && dayDiff < 7) return `${dayDiff}天后`
  if (dayDiff < 0 && dayDiff > -7) return `${Math.abs(dayDiff)}天前`
  
  return formatDate(date, 'full')
} 