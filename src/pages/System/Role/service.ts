import { request } from '@umijs/max';
import { parsePageResult } from "@/utils/requestUtil";

export async function rolePage(params?: any) {
  const apiResult = await request('/api/sysRole', {
    method: 'GET',
    credentials: 'include',
    params: { ...params },
  });
  return parsePageResult(apiResult);
}

export async function saveRole(params: any) {
  return request('/api/sysRole', {
    method: 'POST',
    credentials: 'include',
    datatype: 'json',
    data: params,
  });
}

export async function updateRole(params: any) {
  return request('/api/sysRole', {
    method: 'PUT',
    credentials: 'include',
    datatype: 'json',
    data: params,
  });
}


export async function deleteRole(id: number) {
  return request('/api/sysRole/' + id, {
    method: 'DELETE',
    credentials: 'include',
  });
}


