import { request } from "@umijs/max";
import { SUCCESS } from "@/services/response";

export async function queryMenu() {
    const result = await request('/api/permission', {
        method: 'GET',
    });
    return {
        success: result.code === SUCCESS,
        data: result.data
    };
}

export async function deleteMenu(id: number) {
    const url = '/api/permission/' + id;
    return request(url, {
        method: 'DELETE'
    })
}


export async function updateStatus(id: number, status: number) {
    return request('/api/permission/', {
        method: 'PATCH',
        params: {
            id,
            status
        }
    })
}

export async function insertMenu(params: any) {
    return request('/api/permission', {
        method: 'POST',
        data: params,
    })

}

export async function updateMenu(params: any) {
    return request('/api/permission', {
        method: 'PUT',
        data: params,
    })

}