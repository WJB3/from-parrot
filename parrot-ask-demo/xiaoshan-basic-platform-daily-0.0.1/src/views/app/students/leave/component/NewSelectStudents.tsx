import React, { useEffect, useState } from 'react';
import { Table, Form, Input, Row, Button, Space, Cascader, Modal } from 'antd';
import GT from 'types';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import api from 'src/api';
import { ColumnType } from 'antd/es/table/interface';
import constant from 'src/constant';
import appStyle from 'src/App.style';
import { useGlobalState } from 'src/store';

export default function StudentListModal(props: GT.Modal.Props & {studentGroup: any[]}) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('选择请假学生');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [rows, setRows] = useState<GT.Model.Student[]>([]);
  const [state] = useGlobalState();

  // 重新提交时已选学生信息，只有第一次进入才有，默认选择班级及对应学生
  const setPreStudents = (preStudents: GT.Model.Student[]) => {
    setRows(preStudents);
    const student = preStudents[0];
    const classes: number[] = [student.sectionId, student.enrollmentYear, student.classId];
    form.setFieldsValue({class: classes});
  };

  // 回调
  props.onRef({
    setVisible,
    setTitle,
    form: form,
    setPreStudents,
  });

  useEffect(() => {
    let classes: number[] = [];
    if (props.studentGroup.length > 0) {
      const one = props.studentGroup[0];
      classes.push(one.value);
      if (one.children.length > 0) {
        const two = one.children[0];
        classes.push(two.value);
        if (two.children.length > 0) {
          const three = two.children[0];
          classes.push(three.value);
        }
      }
    }
    form.setFieldsValue({class: classes});
  }, []);

  // 学生信息
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    if (requestType == 1) {
      const clases = form.getFieldValue('class');//formData['class'];

      if (clases == undefined || clases.length == 0) {
        return Promise.resolve({list: [], total: 0});
      }
      const classId: number = clases[clases.length - 1];
      if (classId == undefined) {
        return Promise.resolve({list: [], total: 0});
      }
      setLoading(true);
      return api.student.getPage({
        classId,
        scope: 4,
        current: -1,
        size: -1,
      })
      .then((res)=> {
        setStudents(res.list);
        setRequestType(3);
        // 分页数据加载
        let lists = res.list;
        return Promise.resolve({list: lists, total: res.list.length});
      }).finally(() => {
        setLoading(false);
      });
    } else if (requestType == 3) {
        // 分页数据加载
        let lists = students
        // lists = lists?.slice((current - 1) * size, current * size);
        return Promise.resolve({list: lists, total: students.length});
    } else {
      let lists = students;
      if (formData.name) {
        lists = students?.filter(t=>t.name.includes(formData.name));
      }
      // 分页数据加载
      // let clists = lists?.slice((current - 1) * size, current * size);
      return Promise.resolve({list: lists, total: lists.length});
    }
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;

  // 当前班级学生
  const [students, setStudents] = useState<GT.Model.Student[]>([]);
  const [requestType, setRequestType] = useState(1);
  const getData = (isName: 1 | 2 | 3) => {
    // 含有name的则是在已有列表上请求数据，无则请求classId下面数据
    // 1: 重新请求 2: 本地搜索 3: 分页点击
    setRows([]);
    setRequestType(isName);
    submit();
  };

  // 弹窗
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
  };

  const handleOk = () => {
    setVisible(false);
    setLoading(false);
    // 回调已学生学生
    props.onOk && props.onOk(rows);
  };

  const columns: ColumnType<GT.Model.Student>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'IC卡号',
      dataIndex: 'icCardNo',
      align: 'center',
    },
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.Student[]) => {
    setRows(selectedRows);
  };

  // 是否隐藏学生组织, 年级组成员和校领导不隐藏
  const isHiddenClass = ()=> {
    if (state.user?.roles.includes("school_leader")) {
      return false;
    } else if (state.user?.roles.includes("ROLE_grade_group_members")) {
      return false
    }
    return true;
  };

  return (
    <Modal
    width={800}
    title={title}
    visible={visible}
    onOk={handleOk}
    onCancel={handleCancel}
    afterClose={handleCancel}
    confirmLoading={loading}>
    <div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>
            <Form.Item label='学生组织' name='class' style={{ width: 300 }} hidden={isHiddenClass()}>
              <Cascader
                placeholder='请选择'
                options={props.studentGroup}
                onChange={()=>getData(1)}></Cascader>
            </Form.Item>

            <Form.Item label='姓名' name='name'>
              <Input placeholder='请输入' />
            </Form.Item>

          </Row>
          <Form.Item>
            <Button type='primary' onClick={()=>getData(2)}>
              搜索
            </Button>
          </Form.Item>
        </Row>
      </Form>

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        rowSelection={{ type: 'checkbox', onChange, selectedRowKeys: rows.map((item) => item.id) }}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true }}
      />

    </div>
    </Modal>
  );
}
