import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Tree, Form, Image} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { findPage, saveUser, updateUser, deleteUser, listRole } from './service';
import { queryAndParseMenu } from '../Menu/service';

import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ProFormDigit,
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormInstance,
  ProTable,
  ProFormRadio,
  ProFormSelect
} from '@ant-design/pro-components';
import { SUCCESS } from '@/services/response';



const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [currentRow, setCurrentRow] = useState<any>({});
  const [checkedKeys, setCheckedKeys] = useState<any>([]);

  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      setCurrentRow({});
      if (formRef.current) {
        formRef.current.resetFields();
      }
      setCheckedKeys([]);
    } else {
      console.log('currentRow:', currentRow)
      setCheckedKeys(currentRow.permissions || []);
    }
    handleModalVisible(open);
  }


  useEffect(() => {
    if (formRef.current) {
      formRef.current.setFieldsValue(currentRow);
    }
  })


  const columns: ProColumns<any>[] = [
    {
      title: '用户id',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '真实名',
      dataIndex: 'realName',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: {1:'男', 2:'女'}
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      search: false,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      search: false,
      render: (_, record) => {
        return <Image height={50} width={50} src={record.avatar} />
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {0:'冻结', 1:'正常'}
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setCurrentRow(record);
            handleModalVisible(true);
            if (formRef.current) {
              formRef.current.setFieldsValue(record)
            }
          }}
        >
          编辑
        </a>,
        <Popconfirm key="confirm" title="确认删除吗" onConfirm={() => {
          deleteUser(record.id).then(res => {
            if (SUCCESS === res.code) {
              message.success("删除成功")
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          })
        }}>
          <a key="delete">
            删除
          </a>
        </Popconfirm>
        ,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<any>
        headerTitle={'用户列表'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            新建用户
          </Button>,
        ]}
        request={findPage}
        columns={columns}
        pagination={{pageSize: 10}}
      />
      <ModalForm
        title={currentRow.id ? '编辑用户' : '新建用户'}
        width="400px"
        open={createModalVisible}
        onOpenChange={handleOpenChange}
        formRef={formRef}
        preserve={false}
        onFinish={async (value) => {
          value.permissions = checkedKeys;
          console.log('value:', value)
          if (value.id) {
            updateUser(value).then(res => {
              if (SUCCESS === res.code) {
                message.success("更新成功")
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            })
          } else {
            saveUser(value).then(res => {
              if (SUCCESS === res.code) {
                message.success("创建成功")
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            })
          }
          handleModalVisible(false);
        }}
      >
        <ProFormDigit hidden name="id">
        </ProFormDigit>
        <ProFormText
          allowClear
          label="用户名:"
          rules={[
            {
              required: true,
              message: '用户名为必填项',
            },
          ]}
          width="md"
          name="username"
        />
        <ProFormText
          allowClear
          label="真实名:"
          width="md"
          name="realName"
        />
        <ProFormRadio.Group
            name="gender"
            label="性别："
            options={[
              {
                label: '男',
                value: 1,
              },
              {
                label: '女',
                value: 2,
              },
            ]}
          />
          <ProFormText
            allowClear
            label="手机号:"
            width="md"
            name="mobile"
          />
          <ProFormText
            allowClear
            label="邮箱:"
            width="md"
            name="email"
          />

          <ProFormRadio.Group
            name="status"
            label="状态："
            options={[
              {
                label: '冻结',
                value: 0,
              },
              {
                label: '正常',
                value: 1,
              },
            ]}
          />
        <ProFormText allowClear label="备注:" width="md" name="remark" />
        <ProFormSelect
            name="roles"
            label="角色:"
            request={async () => {
              const roleResult = await listRole();
              const roleList = roleResult.data.map((r: any) => {
                return {
                  label: r.roleName,
                  value: r.id
                }
              })
              return roleList;
            }}
            fieldProps={{
              mode: 'multiple',
            }}
          />
      </ModalForm>
    </PageContainer>
  );
};
export default TableList;
