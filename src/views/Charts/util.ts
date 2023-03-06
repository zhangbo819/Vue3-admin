import { SumData } from "./interface";

// 处理原始数据
export const _formatOriginalData = (data: SumData[]) => {
  // console.log("_formatOriginalData in", data);

  data.forEach((item) => {
    if (item.data) {
      let value = 0;

      item.data = item.data.map((son) => {
        // 根据子集的数目重新计算父级 value
        value += Number(son.value);

        return son;
      });

      item.value = value;
    }
  });

  return data;
};

// 处理展示数据，不影响原始数据
export const _formatShowData = (formatData: SumData[]) => {
  const newData = formatData.filter(
    (item) =>
      (item.data && item.data.reduce((r, i) => r + i.value, 0)) || // 有子类时，子类也必须有值
      +item.value // 这两项全没有则隐藏
  );

  let sum = 0; // 总值

  newData.forEach((item) => {
    item = { ...item }; // 这里浅拷贝下，不要影响原有的数据
    if (item.data) {
      item.data = item.data.filter((item) => item.value); // 1 过滤掉为空项

      // 左小右大排序
      item.data.sort((a, b) => b.value - a.value);
    } else {
      // 没有子集，给一个子集
      item.data = [{ ...item }];
    }

    sum += Number(item.value);
  });

  // 左小右大排序
  newData.sort((a, b) => b.value - a.value);

  //  TODO 将最小的几个合并
  // const smallTarget = sum / 5; // 小于总值的五分之一
  // for (let i = newData.length - 1; i >= 0; i--) {
  //   const item = newData[i];

  //   if (item.data?.length === 1) {
  //   }
  // }

  // console.log("newData", newData);
  return { newData, sum };
};