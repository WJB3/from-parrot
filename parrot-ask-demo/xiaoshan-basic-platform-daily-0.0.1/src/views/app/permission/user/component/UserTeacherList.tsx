import React, { useRef, useState } from "react";
import {
  Table,
  Form,
  Input,
  Row,
  Button,
  Space,
  Modal,
  message,
  TreeSelect,
  Tag,
  Select,
  Avatar,
  Image,
} from "antd";
import { PaginatedParams } from "ahooks/lib/useAntdTable";
import { useAntdTable, useRequest } from "ahooks";
import GT from "types";
import { ColumnType } from "antd/es/table/interface";
import appStyle from "src/App.style";
import api from "src/api";
import constant from "src/constant";
import { TreeNode } from "antd/lib/tree-select";
import useMoment from "src/hook/useMoment";
import UpdateTeacherRoleModal from "./UpdateTeacherRole";
import PrivateComponent from "src/components/PrivateComponent";
import OneLineText from "src/components/OneLineText";

export default function UserTeacherList() {
  const [form] = Form.useForm<GT.DTO.SearchTeacherParams>();
  const { datetime_m } = useMoment();
  const [roles, setRoles] = useState<GT.Model.Role[]>();
  const { data: treeData } = useRequest(api.organization.getAll);
  const modal = useRef<GT.Modal.Ref>();
  const getTableData = (
    { current, pageSize: size }: PaginatedParams[0],
    formData: any
  ) =>
    api.user.getTeacherPage({
      ...formData,
      current,
      size,
    });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;

  const onReset = (record: GT.Model.UserTeacher) => {
    Modal.confirm({
      title: "重置后，该用户的登录密码将设置为123456，确认要重置密码吗？",
      onOk: () => {
        api.user.resetTeacherPassword(record.userId).then(() => {
          message.success("重置成功");
        });
      },
    });
  };
  const onForbidden = (record: GT.Model.UserTeacher) => {
    Modal.confirm({
      title: "禁用后，该用户将不能登录系统，确认要禁用账号吗？",
      onOk: () => {
        api.user.forbiddenTeacher(record.userId).then(() => {
          message.success("禁用成功");
          refresh();
        });
      },
    });
  };
  const updateRole = (record: GT.Model.UserTeacher) => {
    api.user.getTeacherRoles(record.userId).then((roleIds) => {
      modal.current?.setVisible(true);
      modal.current?.form?.setFieldsValue({
        id: record.userId,
        roleIds,
      });
      modal.current?.setFormData({
        id: record.userId,
        roleIds,
      });
    });
  };

  const onResume = (record: GT.Model.UserTeacher) => {
    Modal.confirm({
      title: "恢复后，该用户可以正常登录系统，确认要恢复账号吗？",
      onOk: () => {
        api.user.resuymeTeacher(record.userId).then(() => {
          message.success("恢复成功");
          refresh();
        });
      },
    });
  };
  const columns: ColumnType<GT.Model.UserTeacher>[] = [
    {
      title: "姓名",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "IC卡号",
      dataIndex: "icCardNo",
      align: "center",
    },
    {
      title: "部门",
      dataIndex: "departments",
      render: (val) => {
        return <OneLineText maxWidth={180}>{val.join(",")}</OneLineText>;
      },
      align: "center",
    },
    {
      title: "角色",
      dataIndex: "roles",
      render: (roles) => {
        return (
          <OneLineText maxWidth={200}>
            {roles.map((role: string) => (
              <Tag color="geekblue">{role}</Tag>
            ))}
          </OneLineText>
        );
      },
      align: "center",
    },
    {
      title: "登录账号",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "账号状态",
      dataIndex: "state",
      render: (state: 2 | 0 | 1) => {
        const colors = {
          2: "#FE4F54",
          0: "#FF8948",
          1: "#3CC251",
        };
        return (
          <span style={{ color: colors[state] }}>
            {constant.user.state.get(state)}
          </span>
        );
      },
      align: "center",
    },
    {
      title: "关注公众号",
      dataIndex: "subscribed",
      align: "center",
      render: (subscribed) => {
        return (
          <div
            style={{
              fontFamily: "PingFang SC",
              fontSize: 13,
              color: "#303133",
            }}
          >
            {subscribed ? "是" : "否"}
          </div>
        );
      },
    },
    {
      title: "微信绑定",
      dataIndex: "nickname",
      align: "center",
      render: (nickname, record) => {
        return nickname ? (
          <div
            style={{
              fontFamily: "PingFang SC",
              fontSize: 13,
              color: "#303133",
            }}
          >
            <OneLineText maxWidth={200}>
              <Avatar
                size={26}
                src={record.avatarUrl as string}
                style={{ marginRight: 6 }}
              />
              {nickname}
            </OneLineText>
          </div>
        ) : (
          <div
            style={{
              fontFamily: "PingFang SC",
              fontSize: 13,
              color: "#303133",
            }}
          >
            未绑定
          </div>
        );
      },
    },
    {
      title: "登录次数",
      dataIndex: "loginCount",
      align: "center",
    },
    {
      title: "末次登录时间",
      dataIndex: "lastLoginTime",
      render: (date) => datetime_m(date),
      align: "center",
    },
    {
      title: "操作",
      fixed: "right",
      dataIndex: "state",
      width: 250,
      align: "center",
      render: (state, record) => (
        <Space>
          <PrivateComponent id={196}>
            <Button type="link" size="small" onClick={() => updateRole(record)}>
              分配角色
            </Button>
          </PrivateComponent>
          <PrivateComponent id={197}>
            <Button type="link" size="small" onClick={() => onReset(record)}>
              重置密码
            </Button>
          </PrivateComponent>
          <PrivateComponent id={107}>
            {state === 1 && (
              <Button
                type="link"
                size="small"
                danger
                onClick={() => onForbidden(record)}
              >
                禁用账号
              </Button>
            )}
            {state === 2 && (
              <Button type="link" size="small" onClick={() => onResume(record)}>
                恢复账号
              </Button>
            )}
            {state === 0 && (
              <Button type="link" size="small" danger disabled>
                禁用账号
              </Button>
            )}
          </PrivateComponent>
        </Space>
      ),
    },
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const renderTreeNode = (data: GT.Model.Organization[]) => {
    return data.map((item) => (
      <TreeNode value={item.id} title={item.name}>
        {item.departments && renderTreeNode(item.departments)}
      </TreeNode>
    ));
  };
  const onDropdownVisibleChange = (open: boolean) => {
    if (open) {
      api.user.getTeacherRolesOptions().then((roles) => {
        setRoles(roles);
      });
    }
  };

  return (
    <div>
      <Form form={form} className="search_form">
        <Row>
          <Row className="search_form_items">
            <Form.Item label="关键字" name="keyword">
              <Input placeholder="请输入姓名或IC卡号" />
            </Form.Item>
            <Form.Item name="departmentId" label="部门" style={{ width: 230 }}>
              <TreeSelect
                showSearch
                maxTagCount={1}
                treeNodeFilterProp={"title"}
                placeholder="请选择"
                showArrow
              >
                {renderTreeNode(treeData || [])}
              </TreeSelect>
            </Form.Item>
            <Form.Item label="角色" name="roleId">
              <Select
                placeholder="请选择"
                showSearch
                optionFilterProp="children"
                onDropdownVisibleChange={onDropdownVisibleChange}
              >
                {roles?.map((role) => (
                  <Select.Option value={role.id}>{role.zhName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="账号状态" name="state">
              <Select placeholder="请选择">
                {[...constant.user.state.entries()].map(([value, label]) => (
                  <Select.Option value={value} key={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={submit}>
                查询
              </Button>
              <Button onClick={reset}>重置</Button>
            </Space>
          </Form.Item>
        </Row>
      </Form>
      <Table
        style={appStyle.table}
        columns={columns}
        rowKey="id"
        {...tableProps}
        size="small"
        scroll={{ scrollToFirstRowOnChange: true, x: 1800 }}
      />
      <UpdateTeacherRoleModal
        onRef={(ref) => (modal.current = ref)}
        onOk={refresh}
      ></UpdateTeacherRoleModal>
    </div>
  );
}
