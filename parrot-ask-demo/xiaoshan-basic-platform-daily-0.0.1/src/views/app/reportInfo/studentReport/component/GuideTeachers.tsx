import React, { useState, useRef, useEffect } from "react";
import GT from "types";
import {
  Form,
  Table,
  Modal,
  Space,
  Button,
  Select,
  message,
  Row,
  Input,
  TreeSelect,
} from "antd";
import constant from "src/constant";
import PrivateComponent from "src/components/PrivateComponent";
import api from "src/api";
import { ColumnType } from "antd/es/table/interface";
import appStyle from "src/App.style";
import useAntdTable, { PaginatedParams } from "ahooks/lib/useAntdTable";
import { useRequest } from "ahooks";
import { TreeNode } from "antd/lib/tree-select";
import SelectMemberModal from "src/components/selectMember";

export default function GuideTeacherModal(
  props: GT.Modal.Props & { taskId?: number; teacherLists?: GT.Model.Teacher[] }
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("指导教练详情");
  const [buttonTitle, setButtonTitle] = useState("添加接收对象");
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<GT.Model.Teacher[]>(
    props.teacherLists !== undefined ? props.teacherLists : []
  );
  const [canOperate, setCanOperate] = useState(true);
  const selectModal = useRef<GT.Modal.Ref>();

  const [form] = Form.useForm();
  const { data: treeData } = useRequest(api.organization.getAll);
  // 获取学生竞赛获奖等级

  useEffect(() => {
    refresh();
  }, [teachers]);

  // 根据model去提取数据
  const getTeachersData = (
    { current, pageSize: size }: PaginatedParams[0],
    formData: any
  ) => {
    // 过滤参数 taskName
    let lists = teachers;
    console.log(formData);
    if (formData.taskName) {
      // 过滤姓名
      lists = teachers?.filter((t) => t.name.includes(formData.taskName));
    }
    
    if (formData.departmentIds) {
      // 过滤部门 若是群组 是用的parentIds

      lists = lists.filter((model) =>
        (model.parentIds ? model.parentIds : model.departmentIds).includes(formData.departmentIds)
      );
    }

    const totalList = lists;
    // 分页数据加载
    lists = lists?.slice((current - 1) * size, current * size);
    return Promise.resolve({ list: lists, total: totalList.length });
  };

  const { tableProps, search, refresh } = useAntdTable(getTeachersData, {
    form: form,
    refreshDeps: [],
  });
  const { submit, reset } = search;

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const renderTreeNode = (data: GT.Model.Organization[]) => {
    return data.map((item) => (
      <TreeNode
        value={item.id}
        title={item.name}
        selectable={item.type === 2}
        disabled={item.type === 1}
      >
        {item.departments && renderTreeNode(item.departments)}
      </TreeNode>
    ));
  };

  props.onRef({
    setVisible,
    setTitle,
    setButtonTitle,
    setTeachers,
    setCanOperate,
    form: form,
  });

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
    reset();
    props.onOk && props.onOk(teachers);
  };
  const columns: ColumnType<GT.Model.Teacher>[] = [
    {
      title: "序号",
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: "姓名",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "部门",
      dataIndex: "departmentName",
      align: "center",
    },
    {
      title: "操作",
      align: "center",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            danger
            disabled={!canOperate}
            onClick={() => onDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const onDelete = (record: GT.Model.Teacher) => {
    // 删除任务对象
    Modal.confirm({
      title: "确认删除当前人员吗？",
      onOk() {
        message.success("删除成功");
        // 数组中对应的数据删除
        let deletedLists = teachers.filter((item) => item.id !== record.id);
        setTeachers(deletedLists);
      },
    });
  };

  // 新增教师关联数据
  const onSubmit = (data: Map<string, any>) => {
    // console.log(data);
    let addTeachers: GT.Model.Teacher[] = [...data.values()].reduce(
      (arr, item) => {
        arr = arr.concat(item.nodes);
        return arr;
      },
      []
    );
    // addteachers中需要去重
    let filterMap = new Map<number, any>([])
    addTeachers.forEach((item) => {filterMap.set(item.id, item)})
    addTeachers = [...filterMap.values()].reduce((arr, item) => {
      arr = arr.concat(item);
      return arr
    }, []);

    // 过滤相同的教师
    console.log(addTeachers);

    let currentLists = teachers ? teachers : [];
    for (let index = 0; index < currentLists.length; index++) {
      const element = currentLists[index];
      // 新增的老师中过滤掉相同的数据 兼容Id
      const elementId = element.memberId ? element.memberId : element.id;
      addTeachers = addTeachers.filter(
        (item) => {
          return ((item.memberId ? item.memberId : item.id) != elementId)
        });
      console.log(elementId, addTeachers);
    }

    console.log(addTeachers, currentLists);
    // debugger
    currentLists = currentLists.concat(addTeachers);
    setTeachers(currentLists);
  };

  return (
    <div>
      <Modal
        width={1000}
        title={title}
        visible={visible}
        onOk={handleCancel}
        onCancel={handleCancel}
        afterClose={handleCancel}
        confirmLoading={loading}
        footer={[]}
      >
        <Form
          className="search_form"
          preserve={false}
          form={form}
          // initialValues={{}}
          {...constant.form.layout}
        >
          <Row>
            <Row className="search_form_items">
              <Form.Item
                name="departmentIds"
                label="部门"
              >
                <TreeSelect
                  allowClear={true}
                  showSearch
                  treeNodeFilterProp={"title"}
                  placeholder="请选择"
                >
                  {renderTreeNode(treeData || [])}
                </TreeSelect>
              </Form.Item>
              <Form.Item label="姓名" name="taskName">
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Row>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={submit}>
                  搜索
                </Button>
                <Button onClick={reset}>清空</Button>
              </Space>
            </Form.Item>
          </Row>
          {canOperate ? (
            <p>
              <Space>
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    selectModal.current?.setVisible(true);
                    selectModal.current?.setMembers(new Map());
                  }}
                >
                  {buttonTitle}
                </Button>
              </Space>
            </p>
          ) : null}
        </Form>
        <Table
          style={appStyle.table}
          columns={columns}
          rowKey="id"
          {...tableProps}
          size="small"
        />
      </Modal>
      <SelectMemberModal
        tabs={["organization", "group"]}
        customQuery={{propertyType: 0}}
        onRef={(ref) => (selectModal.current = ref)}
        onOk={onSubmit}
      ></SelectMemberModal>
    </div>
  );
}
