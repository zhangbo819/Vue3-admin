import { SumData } from "./interface";

// 处理原始数据
export const formatOriginalData = (data: SumData[]) => {
  // console.log("formatOriginalData in", data);

  data.forEach((item) => {
    // let value = Number(item.value);
    if (item.data) {
      let value = 0

      item.data.forEach((son) => {
        // 1 根据子集的数目重新计算父级 value
        value += Number(son.value);
      });

      item.value = Number(value.toFixed(2));
    }

  });

  return data;
};

// 处理展示数据，不影响原始数据
export const formatShowData = (formatData: SumData[]) => {
  const newData = formatData.filter(
    (item) =>
      (item.data && item.data.reduce((r, i) => r + Number(i.value), 0)) || // 有子类时，子类也必须有值
      +item.value // 这两项全没有则隐藏
  );

  let sum = 0; // 总值

  newData.forEach((item) => {
    item = { ...item }; // 这里浅拷贝下，不要影响原有的数据
    if (item.data) {
      item.data = item.data.filter((item) => item.value); // 1 过滤掉为空项

      // 左小右大排序
      item.data.sort((a, b) => Number(b.value) - Number(a.value));
    } else {
      // 没有子集，给一个子集
      item.data = [{ ...item }];
    }

    sum += Number(item.value);
  });

  // 左小右大排序
  newData.sort((a, b) => Number(b.value) - Number(a.value));

  // 合并
  _mergeSmallData(newData, sum)

  // console.log("newData", newData);
  return { newData, sum };
};

// 展示优化 将最小的几个合并成一个
function _mergeSmallData(newData: SumData[], sum: number) {
  const smallTarget = sum / 10; // 小于总值的10分之一
  let res = 0, mergeArr: SumData[] = [];

  for (let i = newData.length - 1; i >= 0; i--) {
    const item = newData[i];

    if (Number(item.value) + res >= smallTarget) {
      mergeArr = newData.splice(i + 1) // i + 1 如果加上后超过了，不算这个值
      break;
    }

    res += Number(item.value)
  }

  // 没有结果，return
  if (!mergeArr.length) return

  // 把 mergeArr 里的 data 中的元素拆分
  mergeArr = mergeArr.reduce((r, i) => {
    if (i.data?.length) {
      i.data.forEach((j) => {
        if (j.value) {
          r.push({ ...j, name: `${i.name} ${j.name}` })
        }
      })
    } else {
      r.push(i)
    }
    return r
  }, [] as SumData[])

  newData.push({
    name: '小仓位',
    value: mergeArr.reduce((r, i) => r + Number(i.value), 0),
    data: mergeArr
  })
}