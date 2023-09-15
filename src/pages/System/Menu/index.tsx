import { addRule, removeRule, rule, updateRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ProFormDigit,
  ModalForm,
  PageContainer,
  ProFormTreeSelect,
  ProFormText,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Popconfirm, message, Switch } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import UpdateForm from './components/UpdateForm';
import { queryMenu, deleteMenu, updateStatus, insertMenu, updateMenu } from './service';
import { SUCCESS } from '@/services/response';

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};


const parseTreeNode = (treeNode: any) => {
  const parseResult = {
    title: treeNode.name,
    value: treeNode.id,
    children: []
  }
  if (treeNode.children && treeNode.children.length > 0) {
      const children = treeNode.children.map((m: any) => parseTreeNode(m));
      parseResult.children = children;
  }
  return parseResult;
}

const parseInitValue = (currentRow) => {
  console.log('转换前：', currentRow)
  if (currentRow.menuType) {
    console.log('menuType:', typeof currentRow.menuType)
    console.log('partent:', typeof currentRow.parentId)
    console.log('转换菜单类型方法执行')
    const result =  {
      ...currentRow,
      menuType: currentRow.menuType.toString(),
      parentId: currentRow.parentId.toString()
    }
    console.log('转换后：', result)
    console.log('menuType:', typeof result.menuType)
    console.log('partent:', typeof result.parentId)
    if ("0" === result.parentId) {
      result.parentId = null;
    }
    return result;
  }
  return currentRow;
}


const TableList: React.FC = () => {

  const [modelOpen, handleModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>({});
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const handleOpenChange = (open: boolean) => {
    console.log('open:', open)
    console.log('currentRow:', currentRow)
    if (!open) {
      setCurrentRow({});
      if (formRef.current) {
        formRef.current.resetFields();
      }
    }
    handleModalOpen(open);
  }

  useEffect(() => {
    console.log('初始化钩子')
    if (formRef.current) {
      console.log('表单初始化完成')
      formRef.current.setFieldsValue(currentRow);
    }
  })

  const columns: ProColumns<any>[] = [
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      valueEnum: {
        0: '按钮',
        1: '一级菜单',
        2: '二级菜单',
        3: '三级菜单',
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '菜单路径',
      dataIndex: 'path',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      search: false,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
    },
    {
      title:'状态',
      dataIndex: 'status',
      render: (_, record) => {
        return <Switch defaultChecked={record.status === 1} onChange={(checked: boolean) => {
          updateStatus(record.id, checked ? 1: 0).then(res => {
            if (SUCCESS === res.code && actionRef.current) {
              actionRef.current.reload();
            }
          })
        }} />;
        
      }
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
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            handleModalOpen(true);
            if (formRef.current) {
              formRef.current.setFieldsValue(record);
            }
          }}
        >
          编辑
        </a>,
        <Popconfirm key="confirm" title="确认删除吗" onConfirm={() => {
          deleteMenu(record.id).then(res => {
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
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle="菜单列表"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            创建菜单
          </Button>,
        ]}
        request={queryMenu}
        columns={columns}
      />
      <ModalForm
        title= {currentRow.id ? "编辑菜单" : "创建菜单"}
        width="450px"
        layout='horizontal'
        labelCol={{span: 8}}
        wrapperCol={{span: 14}}
        modalProps={{destroyOnClose: true}}
        open={modelOpen}
        onOpenChange={handleOpenChange}
        initialValues={parseInitValue(currentRow)}
        formRef={formRef}
        onFinish={async (value) => {
          console.log("表单值：", value)
          if (value.id) {
            updateMenu(value).then(res => {
              if (res.code === SUCCESS) {
                message.success('更新成功');
                handleModalOpen(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            })

          } else {
            const res = await insertMenu({...value});
            if (res.code === SUCCESS) {
              message.success('创建成功');
              handleModalOpen(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
      >
      <ProFormDigit hidden name="id">
      </ProFormDigit>
      <ProFormSelect label="菜单类型：" name="menuType" valueEnum={{
          0: '按钮',
          1: '一级菜单',
          2: '二级菜单',
          3: '三级菜单',
        }} 
        rules={[
          {
            required: true,
            message: "菜单类型不能为空",
          },
        ]}
        width="md"/>
        <ProFormTreeSelect
          request={async () => {
            const menus = await queryMenu();
            return new Promise((res, rej) => {
                const tree = menus.data?.map(p => parseTreeNode(p));
                res(tree)
            })
          }}
          width="md"
          name="parentId"
          label="上级菜单名称："
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: "名称不能为空",
            },
          ]}
          width="md"
          name="name"
          label="菜单名称："
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: "编码不能为空",
            },
          ]}
          width="md"
          name="code"
          label="编码："
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: "路径不能为空",
            },
          ]}
          width="md"
          name="path"
          label="菜单路径："
        />
        <ProFormText
          width="md"
          name="icon"
          label="图标："
        />
        <ProFormDigit 
          width="md"
          name="sort"
          label="排序：" />
        <ProFormText
          width="md"
          name="remark"
          label="备注："
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
