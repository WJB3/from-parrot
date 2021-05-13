import React, { useState } from 'react';
import { Modal, Form, Input, Select, message, DatePicker, Alert } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import { useRequest } from 'ahooks';
import useMoment from 'src/hook/useMoment';
import useCalendar from 'src/hook/useCalendar';

export default function CreateSemesterModal(props: GT.Modal.Props & { last?: GT.Model.Semester }) {
  const [visible, setVisible] = useState(false);
  const { createDateMap, createTableData } = useCalendar();
  const { moment } = useMoment();
  const [title, setTitle] = useState('开启新学期');
  const [loading, setLoading] = useState(false);
  const { data: current } = useRequest(api.semester.getCurrent);
  const [form] = Form.useForm<any>();
  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });
  const setWeek = () => {
    api.semester.getCurrent().then((semester) => {
      const dateMap = createDateMap(moment(semester.startDate), moment(semester.endDate));
      const rows = createTableData([...dateMap.values()]);
      const weekData = rows.map(({ month, year, ...days }, index) => {
        return {
          days,
          month,
          year: year,
          week: index + 1,
        };
      });
      const data = weekData.map((item) => {
        const keys = Object.keys(item.days).map((key) => Number(key));
        const dates = keys.map((key) => item.days[key]?.date?.valueOf());
        const min = Math.min.apply(null, dates);
        const max = Math.max.apply(null, dates);
        return {
          number: item.week,
          endDay: moment(new Date(max)).format('YYYY-MM-DD'),
          startDay: moment(new Date(min)).format('YYYY-MM-DD'),
        };
      });
      api.calendar.updateWeekConfig(semester?.id, data);
      setVisible(false);
      props.onOk?.();
    });
  };
  const handleOk = () => {
    form.validateFields().then(() => {
      const { date, ...rest } = form.getFieldsValue();
      const [startDate, endDate] = date;
      if (rest.id) {
        setLoading(true);
        api.semester
          .update({
            ...rest,
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
          })
          .then((res) => {
            message.success('编辑成功');
            setWeek();
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        Modal.confirm({
          title: '开启新学期操作之后，不可回退，确定要开启新学期吗？',
          onOk: () => {
            setLoading(true);
            api.semester
              .create({
                ...rest,
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD'),
              })
              .then((res) => {
                message.success('操作成功');
                setWeek();
              })
              .catch(() => {
                setLoading(false);
              });
          },
        });
      }
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <Form preserve={false} form={form} initialValues={{}} {...constant.form.layout}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item name='orderNo' hidden={true}></Form.Item>
        <Form.Item name='startYear' hidden={true}></Form.Item>
        <Form.Item name='endYear' hidden={true}></Form.Item>
        <Form.Item label='新学期'>
          {form.getFieldValue('startYear')}-{form.getFieldValue('endYear')}
          {constant.semester.orderNo.get(form.getFieldValue('orderNo'))}
        </Form.Item>
        <Form.Item
          name='date'
          label='起止时间'
          hasFeedback
          rules={[{ required: true }]}
          extra={
            <p>
              {form.getFieldValue('id')
                ? '注：编辑起止时间后，开始日期所在的周默认为第①周，可以在校历中修改。'
                : '注：若新学期为某学期第一学期，所有学生将按照原班级默认升级。原高三学生将做毕业处理，数据移至学生档案'}
            </p>
          }>
          <DatePicker.RangePicker
            hideDisabledOptions
            defaultPickerValue={
              current?.endDate
                ? [moment(current.endDate), moment(current.endDate)]
                : [
                    moment(form.getFieldValue('startYear') + ' 01-01'),
                    moment(form.getFieldValue('startYear') + ' 01-01'),
                  ]
            }
            disabledDate={(date: moment.Moment) => {
              const startYear = form.getFieldValue('startYear');
              const endYear = form.getFieldValue('endYear');

              if (date.year() < startYear || date.year() > endYear) {
                return true;
              }
              // 新增
              if (current && !form.getFieldValue('id')) {
                return moment(current.endDate) >= date;
              }

              // 编辑
              if (form.getFieldValue('id') && props.last) {
                return moment(props.last.endDate) >= date;
              }
              return false;
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
