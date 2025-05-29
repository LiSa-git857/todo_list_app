/**
 * 性能监控工具
 * 用于在开发环境中记录和分析组件性能
 */

// 性能标记计数器
let perfMarkCounter = 0;

/**
 * 创建组件性能标记
 * @param {string} componentName - 组件名称
 * @param {string} action - 动作类型 (mount, update, unmount)
 * @returns {string} 生成的唯一标记ID
 */
export const createPerfMark = (componentName, action) => {
  const markId = `${componentName}-${action}-${perfMarkCounter++}`;
  if (process.env.NODE_ENV === 'development') {
    performance.mark(markId);
  }
  return markId;
};

/**
 * 测量两个标记之间的性能
 * @param {string} startMarkId - 开始标记ID
 * @param {string} endMarkId - 结束标记ID
 * @param {string} label - 性能测量标签
 */
export const measurePerf = (startMarkId, endMarkId, label) => {
  if (process.env.NODE_ENV === 'development') {
    performance.measure(label, startMarkId, endMarkId);
    const measures = performance.getEntriesByName(label);
    const lastMeasure = measures[measures.length - 1];
    console.log(`[性能] ${label}: ${lastMeasure.duration.toFixed(2)}ms`);
    
    // 清除不再需要的标记和测量
    performance.clearMarks(startMarkId);
    performance.clearMarks(endMarkId);
    performance.clearMeasures(label);
  }
};

/**
 * 组件性能监控钩子
 * @param {string} componentName - 组件名称
 * @returns {Object} 包含onBeforeMount, onMounted, onBeforeUpdate, onUpdated钩子的对象
 */
export const usePerformanceMonitor = (componentName) => {
  if (process.env.NODE_ENV !== 'development') {
    return {}; // 非开发环境不执行
  }
  
  return {
    onBeforeMount() {
      this._mountStartMark = createPerfMark(componentName, 'mount-start');
    },
    
    onMounted() {
      const mountEndMark = createPerfMark(componentName, 'mount-end');
      measurePerf(this._mountStartMark, mountEndMark, `${componentName} 挂载耗时`);
    },
    
    onBeforeUpdate() {
      this._updateStartMark = createPerfMark(componentName, 'update-start');
    },
    
    onUpdated() {
      const updateEndMark = createPerfMark(componentName, 'update-end');
      measurePerf(this._updateStartMark, updateEndMark, `${componentName} 更新耗时`);
    }
  };
};

/**
 * 记录函数执行时间的装饰器函数
 * @param {Function} fn - 要测量的函数
 * @param {string} name - 函数名称或标签
 * @returns {Function} 包装后的函数
 */
export const measureFunctionPerformance = (fn, name) => {
  if (process.env.NODE_ENV !== 'development') {
    return fn; // 非开发环境直接返回原函数
  }
  
  return (...args) => {
    const startMark = createPerfMark(name, 'fn-start');
    const result = fn(...args);
    
    // 处理Promise返回值
    if (result instanceof Promise) {
      return result.then(value => {
        const endMark = createPerfMark(name, 'fn-end');
        measurePerf(startMark, endMark, `函数 ${name} 执行耗时`);
        return value;
      });
    }
    
    // 处理普通返回值
    const endMark = createPerfMark(name, 'fn-end');
    measurePerf(startMark, endMark, `函数 ${name} 执行耗时`);
    return result;
  };
};

// 导出PerformanceObserver帮助函数
export const createLongTaskObserver = () => {
  if (typeof PerformanceObserver === 'undefined' || process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  try {
    // 监控长任务，超过50ms的任务会被记录
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.warn(`[性能警告] 检测到长任务: ${entry.name || '未命名任务'} - 耗时 ${entry.duration.toFixed(2)}ms`);
      });
    });
    
    observer.observe({ entryTypes: ['longtask'] });
    return observer;
  } catch (e) {
    console.error('不支持PerformanceObserver或longtask监控', e);
    return null;
  }
}; 