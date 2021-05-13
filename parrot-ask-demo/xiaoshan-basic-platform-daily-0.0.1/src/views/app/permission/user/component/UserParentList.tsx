import React, { useState } from "react";
import {
  Table,
  Form,
  Input,
  Row,
  Button,
  Space,
  Modal,
  message,
  Tag,
  Select,
  Avatar,
} from "antd";
import { PaginatedParams } from "ahooks/lib/useAntdTable";
import { useAntdTable } from "ahooks";
import GT from "types";
import { ColumnType } from "antd/es/table/interface";
import appStyle from "src/App.style";
import api from "src/api";
import constant from "src/constant";
import useMoment from "src/hook/useMoment";
import Cascader, { CascaderOptionType } from "antd/lib/cascader";
import PrivateComponent from "src/components/PrivateComponent";
import OneLineText from "src/components/OneLineText";

export default function UserParentList() {
  const [form] = Form.useForm<GT.DTO.SearchUserParentParams>();
  const { datetime_m } = useMoment();
  const [options, setOptions] = useState<CascaderOptionType[]>([]);
  const [roles, setRoles] = useState<GT.Model.Role[]>();
  const getTableData = (
    { current, pageSize: size }: PaginatedParams[0],
    formData: any
  ) => {
    const { org = [], ...rest } = formData;
    const [sectionType, enrollmentYear, classId] = org;
    return api.user.getParentPage({
      ...rest,
      sectionType,
      enrollmentYear,
      classId,
      current,
      size,
    });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;

  const onReset = (record: GT.Model.UserParent) => {
    Modal.confirm({
      title: "重置后，该用户的登录密码将设置为123456，确认要重置密码吗？",
      onOk: () => {
        api.user.resetParentPassword(record.userId).then(() => {
          message.success("重置成功");
        });
      },
    });
  };
  const onForbidden = (record: GT.Model.UserParent) => {
    Modal.confirm({
      title: "禁用后，该用户将不能登录系统，确认要禁用账号吗？",
      onOk: () => {
        api.user.forbiddenParent(record.userId).then(() => {
          message.success("禁用成功");
          refresh();
        });
      },
    });
  };

  const onResume = (record: GT.Model.UserParent) => {
    Modal.confirm({
      title: "恢复后，该用户可以正常登录系统，确认要恢复账号吗？",
      onOk: () => {
        api.user.resuymeParent(record.userId).then(() => {
          message.success("恢复成功");
          refresh();
        });
      },
    });
  };
  const columns: ColumnType<GT.Model.UserParent>[] = [
    {
      title: "家长姓名",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "家长账号",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "绑定学生数量",
      dataIndex: "students",
      align: "center",
      render: (students) => students?.length,
    },
    {
      title: "学生信息",
      dataIndex: "students",
      align: "center",
      render: (students) =>
        students?.map((student: GT.Model.SimpleStudent) => (
          <div>
            {student.gradeName}/{student.className}/{student.name}/
            {student.studentNo}
          </div>
        )),
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
      align: "center",
      render: (state, record) => (
        <Space>
          <PrivateComponent id={200}>
            <Button type="link" onClick={() => onReset(record)}>
              重置密码
            </Button>
          </PrivateComponent>
          <PrivateComponent id={201}>
            {state === 1 && (
              <Button type="link" danger onClick={() => onForbidden(record)}>
                禁用账号
              </Button>
            )}
            {state === 2 && (
              <Button type="link" onClick={() => onResume(record)}>
                恢复账号
              </Button>
            )}
            {state === 0 && (
              <Button type="link" danger disabled>
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
  const loadData = (selectedOptions: CascaderOptionType[] | undefined) => {
    if (selectedOptions) {
      const target = selectedOptions[selectedOptions.length - 1];
      switch (target.type) {
        case "section":
          target.value &&
            api.section
              .getGrades({
                params: {
                  sectionType: target.value,
                },
              })
              .then((grades) => {
                target.children = grades.map((grade) => ({
                  label: grade.name,
                  type: "grade",
                  value: grade.enrollmentYear,
                  isLeaf: false,
                }));
                setOptions([...options]);
              });
          break;
        case "grade":
          const [sectionType, enrollmentYear] = selectedOptions.map(
            (item) => item.value
          );
          api.section
            .getClasses({ sectionType: Number(sectionType), enrollmentYear })
            .then((classes) => {
              target.children = classes.map((c) => ({
                label: c.name,
                type: "class",
                value: c.id,
              }));
              setOptions([...options]);
            });
          break;
      }
    }
  };
  const getSections = (open: boolean) => {
    if (open && !options.length) {
      api.section.getAll({ params: { all: false } }).then((sections) => {
        setOptions(
          sections.map((section) => ({
            label: section.name,
            value: section.id,
            type: "section",
            isLeaf: false,
          }))
        );
      });
    }
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
            <Form.Item label="学生组织" name="org">
              <Cascader
                placeholder="请选择"
                loadData={loadData}
                options={options}
                changeOnSelect
                onPopupVisibleChange={getSections}
              ></Cascader>
            </Form.Item>

            <Form.Item label="家长姓名" name="name">
              <Input placeholder="请输入"></Input>
            </Form.Item>
            <Form.Item label="家长账号" name="username">
              <Input placeholder="请输入"></Input>
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
        scroll={{ scrollToFirstRowOnChange: true }}
      />
    </div>
  );
}
