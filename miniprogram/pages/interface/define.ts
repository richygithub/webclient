interface Camp {
  image: string;
  title: string;
  description: string;
}

// 新增类型定义
interface Order {
  _id: string
  expireAt: number
  course: {
    title: string
    // 添加其他必要字段
  }
  // 添加其他必要字段
}