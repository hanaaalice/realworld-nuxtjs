import { request } from '@/plugins/request'


// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}

// 用户注册
export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

// 获取用户信息
export const getUser = data => {
  return request({
    method: 'GET',
    url: '/api/user',
    data
  })
}

// 获取用户文件
export const getProfile = data => {
  return request({
    method: 'GET',
    url: '/api/profiles/' + data.username,
    data
  })
}

// 关注用户
export const follow = data => {
  return request({
    method: 'POST',
    url: '/api/profiles/' + data.username + '/follow',
    data
  })
}

// 取消关注用户
export const unfollow = data => {
  return request({
    method: 'DELETE',
    url: '/api/profiles/' + data.username + '/follow',
    data
  })
}

// 更新用户信息
export const update = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data
  })
}
