import {
  ProFormSelect,
  ProFormText,
  ProFormDigit,
  ModalForm,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Modal } from 'antd';
import React from 'react';


const UpdateForm: React.FC<any> = (props) => {
  const {open, values, handleFinish, handleCancel, handleOpenChange} = props;
  const initialValues = values;
  return (
    <ModalForm
        title="创建菜单"
        width="400px"
        open={open}
        onOpenChange={handleOpenChange}
        onFinish={handleFinish}
        initialValues={initialValues}
        labelWrap={false}
        modalProps={{destroyOnClose: true}}
      >
        <ProFormSelect label="菜单类型" name="menuType"  valueEnum={{
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
        <ProFormText
          rules={[
            {
              required: true,
              message: "名称不能为空",
            },
          ]}
          width="md"
          name="name"
          label="菜单名称"
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
          label="编码"
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
          label="菜单路径"
        />
        <ProFormText
          width="md"
          name="icon"
          label="图标"
        />
        <ProFormDigit 
          width="md"
          name="sort"
          label="排序" />
        <ProFormText
          width="md"
          name="remark"
          label="备注"
        />
      </ModalForm>
  );
};

export default UpdateForm;
