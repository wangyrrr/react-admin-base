import { request } from '@umijs/max';
import { parsePageResult } from "@/utils/requestUtil";

export async function listRole() {
  return request('/api/sysRole/list', {
    method: 'GET',
    credentials: 'include',
  });
}

export async function findPage(params?: any) {
  const apiResult = await request('/api/sysUser', {
    method: 'GET',
    credentials: 'include',
    params: { ...params },
  });
  return parsePageResult(apiResult);
}

export async function saveUser(params: any) {
  return request('/api/sysUser', {
    method: 'POST',
    credentials: 'include',
    datatype: 'json',
    data: params,
  });
}

export async function updateUser(params: any) {
  return request('/api/sysUser', {
    method: 'PUT',
    credentials: 'include',
    datatype: 'json',
    data: params,
  });
}


export async function deleteUser(id: number) {
  return request('/api/sysUser/' + id, {
    method: 'DELETE',
    credentials: 'include',
  });
}


