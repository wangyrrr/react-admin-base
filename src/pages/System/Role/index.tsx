import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Tree, Form} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { rolePage, saveRole, updateRole, deleteRole } from './service';
import { queryAndParseMenu } from '../Menu/service';

import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ProFormDigit,
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormInstance,
  ProTable,
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
  const [treeNode, setTreeNode] = useState<any>([]);
  const [checkedKeys, setCheckedKeys] = useState<any>([]);

  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      setCurrentRow({});
      if (formRef.current) {
        formRef.current.resetFields();
      }
      setCheckedKeys([]);
    } else {
      const treeNode = await queryAndParseMenu();
      console.log(treeNode)
      setTreeNode(treeNode)
      console.log('currentRow:', currentRow)
      setCheckedKeys(currentRow.permissions || []);
    }
    handleModalVisible(open);
  }

  const onCheck = (checkedKeysValue: any) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  useEffect(() => {
    if (formRef.current) {
      formRef.current.setFieldsValue(currentRow);
    }
  })


  const columns: ProColumns<any>[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
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
          deleteRole(record.id).then(res => {
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
        headerTitle={'角色列表'}
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
            新建角色
          </Button>,
        ]}
        request={rolePage}
        columns={columns}
        pagination={{pageSize: 10}}
      />
      <ModalForm
        title={currentRow.id ? '编辑角色' : '新建角色'}
        width="400px"
        open={createModalVisible}
        onOpenChange={handleOpenChange}
        formRef={formRef}
        preserve={false}
        onFinish={async (value) => {
          value.permissions = checkedKeys;
          console.log('value:', value)
          if (value.id) {
            updateRole(value).then(res => {
              if (SUCCESS === res.code) {
                message.success("更新成功")
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            })
          } else {
            saveRole(value).then(res => {
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
          label="角色编码:"
          rules={[
            {
              required: true,
              message: '角色编码为必填项',
            },
          ]}
          width="md"
          name="roleCode"
        />
        <ProFormText
          allowClear
          label="角色名称:"
          rules={[
            {
              required: true,
              message: '角色名称为必填项',
            },
          ]}
          width="md"
          name="roleName"
        />
        <ProFormText allowClear label="备注:" width="md" name="remark" />
        <Form.Item  label="权限:" >
          <Tree
            checkable
            treeData={treeNode}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
          />
        </Form.Item>
      </ModalForm>
    </PageContainer>
  );
};
export default TableList;
