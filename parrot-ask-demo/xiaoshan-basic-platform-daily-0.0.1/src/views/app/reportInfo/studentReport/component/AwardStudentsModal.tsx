import React, { useState, useRef, useEffect } from 'react';
import GT from 'types';
import { Form, Table, Modal, Space, Button, Select, message, Row, Input, TreeSelect, Cascader } from 'antd';
import constant from 'src/constant';
import api from 'src/api';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useRequest } from 'ahooks';
import SelectMemberModal from 'src/components/selectMember';
import useDictionary from 'src/hook/useDictionary';
import { CascaderOptionType } from 'antd/lib/cascader';
import StudentList from 'src/views/app/baseData/student/Student';

// 获奖学生列表
export default function AwardStudentsModal(props: GT.Modal.Props&{studentLists?: GT.Model.Student[]}) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('获奖学生详情');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<GT.Model.Student[]>((props.studentLists !== undefined) ? props.studentLists : []);
  const [canOperate, setCanOperate] = useState(true)
  const selectModal = useRef<GT.Modal.Ref>();
  const {renderText, renderSelect} = useDictionary();
  const [options, setOptions] = useState<CascaderOptionType[]>([]);
 
  const [form] = Form.useForm();
  const { data: treeData } = useRequest(api.organization.getAll);
  // 获取学生竞赛获奖等级

  useEffect(() => {
    refresh();
  }, [students]);
  // 根据model去提取数据
  const getStudentsData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    // 过滤参数 taskName
    let lists = students;
    // console.log(formData);
    // console.log(form.getFieldValue('departmentIds'));
    if (formData.name) {
      // 存在需要搜索的数据
      lists = students?.filter(t=>t.name.includes(formData.name));
    }

    if (formData.departmentIds&&formData.departmentIds.length > 0) {
      // 查询3级部门 查询出来是一个数组
      let length = formData.departmentIds.length;
      let lastParams = formData.departmentIds[length - 1];
      if (length === 1) {
        // 查询学段 
        lists = lists.filter(model=>model.sectionId===lastParams);
      } else if (length === 2) {
        // 查询届数
        lists = lists.filter(model=>model.enrollmentYear===lastParams);
      } else if (length === 3) {
        // 查询班级
        lists = lists.filter(model=>model.classId===lastParams);
      }
    }

    // 总数据为筛选过后的总数据
    const totalList = lists;
    
    // 分页数据加载
    lists = lists?.slice((current - 1) * size, current * size)
    return Promise.resolve({list: lists, total: totalList.length})
  };
  
  const { tableProps, search, refresh } = useAntdTable(getStudentsData, {
    form: form,
    refreshDeps:[],
  });
  const { submit, reset } = search;

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const getSections = (open: boolean) => {
    if (open && !options.length) {
      api.section.getAll({ params: { all: false } }).then((sections) => {
        setOptions(
          sections.map((section) => ({
            label: section.name,
            value: section.id,
            type: 'section',
            isLeaf: false,
          })),
        );
      });
    }
  };

  const loadData = (selectedOptions: CascaderOptionType[] | undefined) => {
    if (selectedOptions) {
      const target = selectedOptions[selectedOptions.length - 1];
      switch (target.type) {
        case 'section':
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
                  type: 'grade',
                  value: grade.enrollmentYear,
                  isLeaf: false,
                }));
                setOptions([...options]);
              });
          break;
        case 'grade':
          const [sectionType, enrollmentYear] = selectedOptions.map((item) => item.value);
          api.section
            .getClasses({ sectionType: Number(sectionType), enrollmentYear })
            .then((classes) => {
              target.children = classes.map((c) => ({
                label: c.name,
                type: 'class',
                value: c.id,
              }));
              setOptions([...options]);
            });
          break;
      }
    }
  };

  props.onRef({
    setVisible,
    setTitle,
    setStudents,
    setCanOperate,
    form: form,
  });

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
    reset();
    props.onOk && props.onOk(students);
  };
  const columns: ColumnType<GT.Model.Student>[] = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: '学段',
      dataIndex: 'sectionName',
      align: 'center',
    },
    {
      title: '年级',
      dataIndex: 'gradeName',
      align: 'center',
    },
    {
      title: '班级',
      dataIndex: 'className',
      align: 'center',
    },
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
    {
      title: '操作',
      align: 'center',
      render: (text, record) =>
        <Space>
          <Button type='link' danger 
            disabled={!canOperate}
            onClick={() => onDelete(record)}>
            删除
          </Button>
        </Space>
        
    },
  ];
  const onDelete = (record: GT.Model.Student) => {
    // 删除任务对象
    Modal.confirm({
      title: '确认删除当前人员吗？',
      onOk() {
        message.success('删除成功');
        // 数组中对应的数据删除
        let deletedLists =  students.filter(item => item.id !== record.id)
        setStudents(deletedLists);
        // search.reset();
      },
    });
  };

  // 新增学生关联数据
  const onSubmit = (data: Map<string, any>) => {
    console.log(data);
    let addStudents: GT.Model.Student[] = [...data.values()].reduce((arr, item) => {
      console.log(item)
      console.log(arr)
      arr = arr.concat(item.nodes);
      return arr;
    }, []);

    // 过滤相同的学生
    let currentLists = students;
    for (let index = 0; index < currentLists.length; index++) {
      const element = currentLists[index];
      // 新增的学生中过滤掉相同的数据
      addStudents = addStudents.filter(item => (item.id !== element.id));
    }

    currentLists = currentLists.concat(addStudents);
    setStudents(currentLists);
    // refresh();
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
        footer={
          []
        }>
        <Form
          className='search_form'
          preserve={false}
          form={form}
          // initialValues={{}}
          >
          <Row>
            <Row className='search_form_items'>
               <Form.Item name='departmentIds' label='学生组织'>
                 <Cascader
                    placeholder='请选择'
                    loadData={loadData}
                    options={options}
                    changeOnSelect
                    onPopupVisibleChange={getSections}>  
                  </Cascader>
               </Form.Item>
               <Form.Item label='姓名' name='name'>
                 <Input placeholder='请输入姓名' />
               </Form.Item>
            </Row>
             <Form.Item>
                <Space>
                  <Button type='primary' onClick={submit}>
                    搜索
                  </Button>
                  <Button onClick={reset}>清空</Button>
                </Space>
             </Form.Item>
         </Row>
          {canOperate ? (
            <p>
              <Space>
                  <Button type='primary' ghost
                  onClick={() => {
                    selectModal.current?.setVisible(true);
                    selectModal.current?.setMembers(new Map());
                  }}>
                    添加获奖学生
                  </Button>
              </Space>
            </p>
          ) : null}
        </Form>
        <Table style={appStyle.table}
              columns={columns}
              rowKey='id'
              {...tableProps}
              size='small'/>
      </Modal>
      <SelectMemberModal
        tabs={['student']}
        studentQuery={{fullStudent: true, all: false, yearScope: 4}}
        onRef={(ref) => (selectModal.current = ref)}
        onOk={onSubmit}></SelectMemberModal>
    </div>
  );
}
