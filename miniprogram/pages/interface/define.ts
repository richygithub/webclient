interface Camp {
  image: string;
  title: string;
  description: string;
}
interface ApiResponse<T> {
  code: number
  message?: string
  data: T
}

interface BaseInfo{
  phone:string|undefined,
  travelers: Traveler[],
}

interface LoginResp{
  data:number,
  token:string,
  baseInfo:BaseInfo
}
interface BindPhoneRet{
  error:number,
  phone:string
}
interface CourseInfo {
  id: string
  title: string
  price: number
  cover: string
  desc: string
  images: string[]
  duration: string
  location: string
  features: string[]
}
interface CourseCode{
  data :ArrayBuffer
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
