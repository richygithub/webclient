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

interface Course {
  id: string
  title: string
  price: number
  cover: string
}

// 出行人类型
interface Traveler {
  name: string
  age?: number | string
  gender?: '男' | '女' | string
  class?: string
  idCard: string

  relation?: string
}

interface UserInfo{
  travelers: Traveler[],
}
