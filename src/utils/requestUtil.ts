import { SUCCESS, Response } from "@/services/response";
import { request } from "@umijs/max";
import { message } from 'antd';

export function parsePageResult(apiResult: any) {
  const result = {
    success: apiResult.code === SUCCESS,
    data: apiResult.data.records,
    total: apiResult.data.total,
  };
  return result;
}
  
export async function sendRequest(url: any, options: any) {
  let result: Response;
  try {
    result = await request(url, options);
    if (SUCCESS !== result.code) {
      message.error(result.message);
    }
  } catch (error) {
    message.error('网络繁忙');
  }
  return result;
}
