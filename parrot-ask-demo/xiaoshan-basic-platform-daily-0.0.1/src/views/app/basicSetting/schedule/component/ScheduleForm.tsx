import { useRequest } from 'ahooks';
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  TimePicker,
  TreeSelect,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ColumnType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'src/api';
import constant from 'src/constant';
import useDictionary from 'src/hook/useDictionary';
import useMoment from 'src/hook/useMoment';
import qs from 'qs';

import {
  PlusCircleFilled,
  MinusCircleFilled,
  UpCircleFilled,
  DownCircleFilled,
} from '@ant-design/icons';
import GT from 'types';
export default function ScheduleForm(props: { id?: any; copyId?: any }) {
  const [form] = useForm();
  const history = useHistory();
  const { moment } = useMoment();
  const [templates, setTemplates] = useState<any[]>([]);
  const { renderSelect } = useDictionary();
  const { data: section } = useRequest(() =>
    api.section.getTree({
      all: false,
    }),
  );
  const onTemplate = (id: number) => {
    const ymd = moment().format('YYYY-MM-DD');
    api.schedule.get(id).then((res) => {
      let morning = 0;
      let night = 0;
      let afternoon = 0;
      const details = res.details.map((item) => {
        if (item.type === 0) {
          switch (item.timeRange) {
            case 0:
              morning++;
              break;
            case 1:
              afternoon++;
              break;
            case 2:
              night++;
              break;
          }
        }
        return {
          ...item,
          startTime: moment(`${ymd} ${item.startTime}:00`),
          endTime: moment(`${ymd} ${item.endTime}:00`),
        };
      });

      form.setFieldsValue({
        ...res,
        details,
        gradeName: id === props.id ? res.gradeName : form.getFieldValue('gradeName'),
        afternoon: afternoon || null,
        night: details.length ? night : null,
        morning: morning || null,
        restRange: res.restRange?.map((item) =>
          item.enrollmentYear !== undefined
            ? `${item.sectionType}-${item.enrollmentYear}`
            : item.sectionType,
        ),
      });
    });
  };
  useEffect(() => {
    const searchParams = qs.parse(history.location.search.substr(1));
    if (searchParams.type) {
      api.schedule.getTemplates(searchParams.type).then((res) => {
        setTemplates(res);
      });
    }
    if (props.id) {
      onTemplate(props.id);
    }
  }, []);
  const unit = <span style={{ lineHeight: '30px', marginLeft: 5 }}>???</span>;
  const select = (
    <Select
      placeholder='?????????'
      getPopupContainer={() => document.querySelector('.app_container') || document.body}>
      <Select.Option value={1}>1</Select.Option>
      <Select.Option value={2}>2</Select.Option>
      <Select.Option value={3}>3</Select.Option>
      <Select.Option value={4}>4</Select.Option>
      <Select.Option value={5}>5</Select.Option>
      <Select.Option value={6}>6</Select.Option>
    </Select>
  );
  const onDataSourceChange = (data: { morning: number; afternoon: number; night: number }) => {
    const { morning, afternoon, night } = data;
    const { details = [] } = form.getFieldsValue();
    const mList: any[] = [],
      aList: any[] = [],
      nList: any[] = [];
    details.forEach((item: any) => {
      switch (item.time) {
        case 1:
          mList.push(item);
          break;
        case 2:
          aList.push(item);
          break;
        case 3:
          nList.push(item);
          break;
        default:
          break;
      }
    });
    const createItem = (arr: any[], length: number, timeRange: number) => {
      const diff = length - arr.length;
      if (diff > 0) {
        return new Array(diff).fill({}).map((item, index) => {
          return {
            type: 0,
            timeRange,
            startTime: null,
            endTime: null,
            sectionName: `???${index + 1}???`,
          };
        });
      }
      return [];
    };

    const arr = [
      ...mList.slice(0, morning).concat(createItem(mList, morning, 0)),
      ...aList.slice(0, afternoon).concat(createItem(aList, afternoon, 1)),
      ...nList.slice(0, night).concat(createItem(nList, night, 2)),
    ];
    form.setFieldsValue({
      ...form.getFieldsValue(),
      details: arr,
    });
  };
  const addSection = (index: number, record: any) => {
    let data = [...form.getFieldValue('details')];
    data.splice(index, 0, {
      timeRange: record.timeRange,
      sectionName: '',
      type: null,
      startTime: null,
      endTime: null,
    });
    form.setFieldsValue({
      details: data,
    });
  };
  const removeSection = (index: number) => {
    let data = [...form.getFieldValue('details')];
    data.splice(index, 1);
    form.setFieldsValue({
      details: data,
    });
  };
  const switchSection = (i: number, j: number) => {
    let data = [...form.getFieldValue('details')];
    const a = data[i];
    data[i] = data[j];
    data[j] = a;
    form.setFieldsValue({
      details: data,
    });
  };
  const getTimePickerProps = (record: any) => {
    return {
      minuteStep: 5,
      showNow: false,
      format: 'HH:mm',
      hideDisabledOptions: true,
      disabledDate: (d: moment.Moment) => {
        const time = moment().format('YYYY-MM-DD');
        const date = moment(d.format('YYYY-MM-DD HH:mm:ss'));

        // ???????????????
        if (record.timeRange === 0) {
          return date < moment(`${time} 05:00:00`) || date > moment(`${time} 13:00:00`);
        } else if (record.timeRange === 1) {
          return date < moment(`${time} 12:00:00`) || date > moment(`${time} 18:00:00`);
        } else {
          return date > moment(`${time} 07:00:00`) && date < moment(`${time} 17:00:00`);
        }
      },
      // ?????????????????????
      disabledHours: (hour?: number) => {
        if (record.timeRange === 0) {
          return [0, 1, 2, 3, 4, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        }
        if (record.timeRange === 1) {
          return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 19, 20, 21, 22, 23];
        } else {
          return [8, 9, 10, 11, 12, 13, 14, 15, 16];
        }
      },
      disabledMinutes: (hour: number) => {
        const flag =
          (record.timeRange === 0 && hour === 13) ||
          (record.timeRange === 1 && hour === 18) ||
          (record.timeRange === 2 && hour === 7);
        if (flag) {
          return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
        }
        return [];
      },
    };
  };
  const validateTime = (
    record: any,
    index: number,
    obj: { startTime: moment.Moment; endTime: moment.Moment },
  ) => {
    let cStart = obj.startTime && moment(obj.startTime);
    let cEnd = obj.endTime && moment(obj.endTime);
    const data = form.getFieldValue('details');
    const dateRanges: [moment.Moment, moment.Moment, number][] = data.map(
      (item: any, j: number) => {
        if (j === index) {
          return [];
        }
        let tEnd = item.endTime && moment(item.endTime);
        let tStart = item.startTime && moment(item.startTime);
        if (item.timeRange === 2 && tStart && tEnd) {
          if (tEnd.hour() <= 7) {
            tEnd = moment(tEnd).add(1, 'd');
          }
          if (tStart.hour() <= 7) {
            tStart = moment(tStart).add(1, 'd');
          }
        }
        return [tStart, tEnd];
      },
    );

    // ??????????????????????????????7????????????+1???
    if (cEnd && record.timeRange === 2 && cStart) {
      if (cEnd.hour() <= 7) {
        cEnd = moment(cEnd).add(1, 'd');
      }
      if (cStart.hour() <= 7) {
        cStart = moment(cStart).add(1, 'd');
      }
    }
    if (cStart && cEnd && cStart.unix() > cEnd.unix()) {
      return Promise.reject('????????????????????????????????????');
    }
    if (cStart && cEnd && cStart.unix() === cEnd.unix()) {
      return Promise.reject('???????????????????????????????????????');
    }
    if (cStart && cEnd) {
      let flag = dateRanges.every(([tStart, tEnd], index) => {
        if (tStart && tEnd) {
          return (
            (cStart.unix() <= tStart.unix() && cEnd.unix() <= tStart.unix()) ||
            (cStart.unix() >= tEnd.unix() && cEnd.unix() >= tEnd.unix())
          );
        }
        return true;
      });
      if (!flag) {
        return Promise.reject('?????????????????????');
      }
    }
    const prev = dateRanges[index - 1];
    const next = dateRanges[index];
    if (cStart && cEnd && prev) {
      const [tStart, tEnd] = prev;
      if (tStart && tEnd && cStart.unix() <= tStart.unix()) {
        return Promise.reject('?????????????????????');
      }
    }
    if (cStart && cEnd && next) {
      const [tStart, tEnd] = next;
      if (tStart && tEnd && tStart.unix() <= cStart.unix()) {
        return Promise.reject('?????????????????????');
      }
    }
    return Promise.resolve();
  };
  const columns: ColumnType<any>[] = [
    {
      title: '??????',
      dataIndex: 'timeRange',
      align: 'center',
      render: (val: 0 | 1 | 2, record, index) => {
        const dataSource: any[] = form.getFieldValue('details');
        const map = {
          0: '??????',
          1: '??????',
          2: '??????',
        };
        return {
          children: map[val],
          props: {
            style: {
              padding: '10px 0',
            },
            rowSpan:
              dataSource[index - 1]?.timeRange === val
                ? 0
                : dataSource.filter((item) => item.timeRange === val).length,
          },
        };
      },
    },
    {
      title: '????????????',
      dataIndex: 'sectionName',
      width: 280,
      align: 'center',
      render: (val, record, index) => {
        const dataSource: any[] = form.getFieldValue('details');
        const isTimeRangeFist = record.timeRange === dataSource[index - 1]?.timeRange;
        const isTimeRangeLast = record.timeRange === dataSource[index + 1]?.timeRange;
        // val = val || (record.type === 0 && `???${index + 1}???`);
        return (
          <Form.Item name={['details', index, 'sectionName']}>
            <Row justify='space-around' align='middle' className='calendar_section'>
              <Row
                justify='space-between'
                align='middle'
                style={{ flexDirection: 'column' }}
                className='calendar_section_button'>
                <PlusCircleFilled
                  style={{ color: '#3CC251', marginBottom: 5 }}
                  onClick={() => addSection(index, record)}
                />
                {record.type !== 0 ? (
                  <MinusCircleFilled
                    style={{ color: '#FE4F54', marginBottom: 5 }}
                    onClick={() => removeSection(index)}
                  />
                ) : null}
                <PlusCircleFilled
                  style={{ color: '#3CC251' }}
                  onClick={() => addSection(index + 1, record)}
                />
              </Row>
              <Form.Item
                name={['details', index, 'sectionName']}
                noStyle
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: '?????????????????????',
                    validateTrigger: ['onChange', 'onBlur'],
                  },
                ]}>
                <AutoComplete
                  options={[{ value: '?????????' }]}
                  style={{ width: 'auto' }}
                  onChange={(val) => {
                    if (val === '?????????') {
                      if (val === '?????????') {
                        let details = [...form.getFieldValue('details')];
                        details[index].type = 1;
                        form.setFieldsValue({ details });
                      }
                    }
                  }}>
                  <Input style={{ width: 'auto' }} defaultValue={val} maxLength={10}></Input>
                </AutoComplete>
              </Form.Item>
              <Row
                justify='space-between'
                align='middle'
                style={{ flexDirection: 'column' }}
                className='calendar_section_button'>
                {isTimeRangeFist ? (
                  <UpCircleFilled
                    style={{ color: '#5781F2', marginBottom: 5 }}
                    onClick={() => switchSection(index - 1, index)}
                  />
                ) : null}
                {isTimeRangeLast ? (
                  <DownCircleFilled
                    style={{ color: '#5781F2' }}
                    onClick={() => switchSection(index + 1, index)}
                  />
                ) : null}
              </Row>
            </Row>
          </Form.Item>
        );
      },
    },
    {
      title: '????????????',
      dataIndex: 'startTime',
      align: 'center',
      render: (val, record, index) => {
        return (
          <Form.Item
            name={['details', index, 'startTime']}
            dependencies={[['details', index, 'endTime']]}
            validateFirst
            rules={[
              {
                required: true,
                message: '???????????????',
              },
              {
                validator: (ruel, val) =>
                  validateTime(record, index, {
                    startTime: val,
                    endTime: form.getFieldValue('details')[index].endTime,
                  }),
              },
            ]}>
            <TimePicker {...getTimePickerProps(record)}></TimePicker>
          </Form.Item>
        );
      },
    },
    {
      title: '????????????',
      dataIndex: 'endTime',
      align: 'center',
      render: (val, record, index) => {
        return (
          <Form.Item
            name={['details', index, 'endTime']}
            validateFirst
            dependencies={[['details', index, 'startTime']]}
            rules={[
              {
                required: true,
                message: '???????????????',
              },
              {
                validator: (rule, val) =>
                  validateTime(record, index, {
                    endTime: val,
                    startTime: form.getFieldValue('details')[index].startTime,
                  }),
              },
            ]}>
            <TimePicker {...getTimePickerProps(record)}></TimePicker>
          </Form.Item>
        );
      },
    },
    {
      title: '????????????',
      dataIndex: 'type',
      align: 'center',
      render: (val, record, index) => {
        return (
          <Form.Item
            name={['details', index, 'type']}
            rules={[{ required: true, message: '?????????????????????' }]}>
            {renderSelect(
              'restSectionType',
              { disabled: record.type === 0 },
              record.type === 0
                ? undefined
                : (data) => {
                    if (record.sectionName === '?????????') {
                      return data.filter(([value]) => value === 1);
                    } else {
                      return data.filter(([value]) => value !== 0);
                    }
                  },
            )}
          </Form.Item>
        );
      },
    },
  ];
  const onSubmit = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      const details = data.details.map((item: any, index: number) => {
        const { startTime, endTime } = item;
        return {
          ...item,
          sectionOrder: index,
          startTime: startTime.format('HH:mm'),
          endTime: endTime.format('HH:mm'),
        };
      });

      const apiFn = props.id ? api.schedule.update : api.schedule.create;
      const forceApiFn = props.id ? api.schedule.forceUpdate : api.schedule.forceCreate;
      apiFn({
        id: props.id,
        ...data,
        details,
      }).then((res) => {
        if (res) {
          // message.error('??????????????????');
          Modal.confirm({
            title:
              '??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
            onOk: () => {
              forceApiFn({
                ...data,
                id: props.id,
                details,
              }).then(() => {
                message.success('????????????');
                history.goBack();
              });
            },
          });
        } else {
          message.success('????????????');
          history.goBack();
        }
      });
    });
  };
  return (
    <div>
      <Form
        form={form}
        onValuesChange={(val, data) => {
          const { morning, afternoon, night } = data;
          if (
            morning &&
            afternoon &&
            night !== undefined &&
            (val.morning || val.afternoon || val.night !== undefined)
          ) {
            onDataSourceChange({
              morning,
              afternoon,
              night,
            });
          }
        }}
        style={{ width: '90%' }}
        preserve={false}
        initialValues={{
          state: 0,
          isEnable: 1,
          details: [],
        }}
        {...constant.form.layout}>
        <Form.Item label='????????????' name='restName' validateFirst>
          <Input placeholder='?????????????????????' maxLength={20} disabled></Input>
        </Form.Item>

        <Form.Item label='????????????' name='gradeName'>
          <Input disabled></Input>
        </Form.Item>
        <Form.Item label='????????????'>
          <Select
            placeholder='?????????'
            onSelect={(val) => onTemplate(Number(val))}
            style={{ width: 300 }}>
            {templates?.map((t) => (
              <Select.Option value={t.id} key={t.id}>
                {t.templateName}
              </Select.Option>
            ))}
          </Select>
          ????????????????????????????????????????????????????????????????????????????????????????????????
        </Form.Item>
        <Form.Item label='????????????' name='remark'>
          <Input.TextArea placeholder='?????????' rows={4} maxLength={500}></Input.TextArea>
        </Form.Item>
        <Form.Item label='????????????' required>
          <Row justify='space-between'>
            <Row>
              <Form.Item
                label='??????'
                name='morning'
                rules={[{ required: true, message: '?????????????????????' }]}>
                {select}
              </Form.Item>
              {unit}
            </Row>
            <Row>
              <Form.Item
                label='??????'
                name='afternoon'
                rules={[{ required: true, message: '?????????????????????' }]}>
                {select}
              </Form.Item>
              {unit}
            </Row>
            <Row>
              <Form.Item
                label='??????'
                name='night'
                rules={[{ required: true, message: '?????????????????????' }]}>
                <Select
                  placeholder='?????????'
                  getPopupContainer={() =>
                    document.querySelector('.app_container') || document.body
                  }>
                  <Select.Option value={0}>0</Select.Option>
                  <Select.Option value={1}>1</Select.Option>
                  <Select.Option value={2}>2</Select.Option>
                  <Select.Option value={3}>3</Select.Option>
                  <Select.Option value={4}>4</Select.Option>
                  <Select.Option value={5}>5</Select.Option>
                  <Select.Option value={6}>6</Select.Option>
                </Select>
              </Form.Item>
              {unit}
            </Row>
          </Row>
        </Form.Item>
        <Form.Item label=' ' colon={false} valuePropName='dataSource' name='details'>
          <Table className='table_no_hover' bordered columns={columns} pagination={false}></Table>
        </Form.Item>
        <Form.Item label=' ' colon={false} valuePropName='dataSource' name='details'>
          <Space>
            <div>
              ?????? <PlusCircleFilled style={{ color: '#3CC251' }} />
              ??????????????????????????????
            </div>
            <div>
              <MinusCircleFilled style={{ color: '#FE4F54' }} />
              ???????????????
            </div>
            <div>
              ?????? <PlusCircleFilled style={{ color: '#3CC251' }} />
              ??????????????????????????????
            </div>
            <div>
              <UpCircleFilled style={{ color: '#5781F2' }} />
              ???????????????
            </div>
            <div>
              <DownCircleFilled style={{ color: '#5781F2' }} />
              ???????????????
            </div>
          </Space>
        </Form.Item>
        <Form.Item label=' ' colon={false}>
          <Space>
            <Button onClick={onSubmit} type='primary'>
              ??????
            </Button>
            <Button
              type='primary'
              ghost
              onClick={() => {
                history.goBack();
              }}>
              ??????
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
