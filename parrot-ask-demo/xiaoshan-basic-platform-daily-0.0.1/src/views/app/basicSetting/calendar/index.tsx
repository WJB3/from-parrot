import {
  Button,
  Calendar,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popover,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { GetComponentProps } from 'rc-table/lib/interface';
import React, { useEffect, useMemo, useState } from 'react';
import ColorBlock from 'src/components/ColorBlock';
import useMoment from 'src/hook/useMoment';
import html2canvas from 'html2canvas';
import { useRequest } from 'ahooks';
import api from 'src/api';
import GT from 'types';
import { useForm } from 'antd/lib/form/Form';
import useDownload from 'src/hook/useDownload';
import CalendarBottomTips from './component/Tips';
import useCalendar from 'src/hook/useCalendar';
import PrivateComponent from 'src/components/PrivateComponent';
import {
  UploadOutlined,
  PrinterOutlined,
  QuestionCircleFilled,
  EditFilled,
  DeleteFilled,
  CaretDownOutlined,
} from '@ant-design/icons';
import constant from 'src/constant';
import IconFont from 'src/components/IconFont';

interface CalendarCell {
  date: moment.Moment;
  events: GT.Model.CalendarEvent[];
}
interface CalendarRow {
  month: number;
  year: number;
  [key: number]: CalendarCell;
}
export default function SchoolCalendarPage(props: { id?: number }) {
  const format = useMoment();
  const { downloadBase64 } = useDownload();
  const { moment } = format;
  const [mouse, setMouse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [form] = useForm();
  const { createDateMap, createTableData, createPdf } = useCalendar();
  const [isAdjust, setIsAdjust] = useState(false);
  // -1 未选中，0:周次设置 1:大小礼拜 2:周末 3:节假日 4:考试 5:日程 6:调休
  const [type, setType] = useState<-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6>(-1);
  // 当前选择 或者 创建的事项
  const [selectedEvent, setSelectedEvent] = useState<GT.Model.CalendarEvent | null>(null);
  useEffect(() => {
    if (!selectedEvent) {
      form.resetFields();
    }
  }, [selectedEvent]);
  useEffect(() => {
    if (type === -1) {
      refreshCalendarWeek();
    }
  }, [type]);
  // 获取当前学期 // 或者目标学期
  const { data: semester } = useRequest(
    () => (props.id ? api.semester.getById(props.id) : api.semester.getCurrent()),
    {
      onSuccess: (res) => {},
    },
  );
  // 获取日期配置
  const { data: calendarDay, refresh: refreshCalendarDay } = useRequest(
    () => {
      if (semester) {
        return api.calendar.getDayConfig(semester.id);
      } else {
        return Promise.resolve([]);
      }
    },
    {
      refreshDeps: [semester],
    },
  );
  // 获取周配置
  const { data: calendarWeek, refresh: refreshCalendarWeek } = useRequest(
    () => {
      if (semester) {
        return api.calendar.getWeekConfig(semester.id);
      } else {
        return Promise.resolve([]);
      }
    },
    {
      refreshDeps: [semester],
    },
  );
  const startDate = moment(semester?.startDate);
  const endDate = moment(semester?.endDate);
  useEffect(() => {
    // 生成了date map
    const dateMap = createDateMap(moment(startDate), moment(endDate));

    // 6.按周生成日历数据
    const rows: CalendarRow[] = createTableData([...dateMap.values()]);
    setDataSource(
      rows.map(({ month, year, ...days }, index) => {
        return {
          days,
          month,
          year: year,
          weekSize: calendarWeek?.[index]?.weekSize || (index % 2) + 1,
          week: calendarWeek?.[index]?.number || index + 1,
          weekId: calendarWeek?.[index]?.id,
        };
      }),
    );
  }, [semester, calendarWeek]);
  const adjustments = new Map();
  const events: Map<number, GT.Model.CalendarEvent> | undefined = calendarDay?.reduce(
    (map, day) => {
      day.items?.forEach((item) => {
        if (item) {
          if (map.has(item.id)) {
            map.set(item.id, {
              ...map.get(item.id),
              endDate: moment(day.detailDate),
            });
          } else {
            map.set(item.id, {
              ...item,
              endDate: moment(day.detailDate),
              startDate: moment(day.detailDate),
            });
          }
        }

        if (item?.type === 6) {
          // adjustments.set(day.detailDate, day.adjustment.dayOfWeek);
        }
      });

      if (day.adjustment) {
        adjustments.set(day.detailDate, day.adjustment.dayOfWeek);
      }

      // day.adjustment?.forEach((item) => {});
      return map;
    },
    new Map(),
  );
  const eventsConfig = new Map([
    [
      5,
      {
        name: '日程设置',
        color: '#5781F2',
      },
    ],
    [
      3,
      {
        name: '节假日设置',
        color: '#EDEDFC',
      },
    ],
    [
      4,
      {
        name: '考试设置',
        color: '#FFF6EB',
      },
    ],
    [
      6,
      {
        name: '调休设置',
        color: '#5781F2',
      },
    ],
  ]);
  // 月列表渲染函数
  const renderMonth = (val: any, record: any, index: number) => {
    return {
      children: `${constant.number.month.get(val)}月`,
      props: {
        style: {
          padding: '10px 0',
        },
        rowSpan:
          dataSource[index - 1]?.month === val
            ? 0
            : dataSource.filter((item) => item.month === val && item.year === record.year).length,
      },
    };
  };
  // 大小礼拜
  const renderWeekSize = (val: any, record: any, index: number) => {
    const onEdit = () => {
      let current = val === 1 ? 2 : 1;
      const weekData = dataSource.map((item, j) => {
        if (j >= index) {
          item.weekSize =
            j === index ? (item.weekSize % 2) + 1 : (dataSource[j - 1].weekSize % 2) + 1;
        }
        return {
          ...item,
        };
      });
      setDataSource(weekData);

      const data = weekData.map((item) => {
        const keys = Object.keys(item.days);
        const dates = keys.map((key) => item.days[key]?.date?.valueOf());
        const min = Math.min.apply(null, dates);
        const max = Math.max.apply(null, dates);

        return {
          number: item.week,
          id: item.weekId,
          weekSize: item.weekSize,
          endDay: moment(new Date(max)).format('YYYY-MM-DD'),
          startDay: moment(new Date(min)).format('YYYY-MM-DD'),
        };
      });
      console.log(weekData, data, 1);
      if (semester) {
        api.calendar.updateWeekConfig(semester?.id, data).then((res) => {
          message.success('大小礼拜设置成功');
        });
      }
    };
    return (
      <div>
        <div>{val === 1 ? '大礼拜' : '小礼拜'}</div>
        {type === 1 ? <CaretDownOutlined style={{ cursor: 'pointer' }} onClick={onEdit} /> : null}
      </div>
    );
  };
  // 周列表渲染函数
  const renderWeek = (val: any, record: any, index: number) => {
    const onEditWeek = (e: any) => {
      console.log(e, 'week');
      const weekIndex = Number(e.currentTarget.value);
      if (!weekIndex) {
        return message.warning('周次不能为空');
      }
      if (weekIndex > 30) {
        return message.warning('周次不能超过30');
      }
      const weekData = dataSource.map((item, j) => {
        if (j >= index) {
          item.week = j - index + weekIndex;
        }
        return {
          ...item,
        };
      });
      setDataSource(weekData);
      let checkRepeat: any = {};
      let sum = 0;
      const data = weekData.map((item) => {
        const keys = Object.keys(item.days);
        const dates = keys.map((key) => item.days[key]?.date?.valueOf());
        const min = Math.min.apply(null, dates);
        const max = Math.max.apply(null, dates);
        if (item.week) {
          checkRepeat[item.week] = checkRepeat[item.week] ? checkRepeat[item.week] + 1 : 1;
          sum++;
        }
        return {
          number: item.week,
          id: item.weekId,
          weekSize: item.weekSize,
          endDay: moment(new Date(max)).format('YYYY-MM-DD'),
          startDay: moment(new Date(min)).format('YYYY-MM-DD'),
        };
      });
      if (sum !== dataSource.length) {
        return message.warning('周次不能为空');
      }
      // if (Object.keys(checkRepeat).some((key) => checkRepeat[key] > 1)) {
      //   return message.warning('周次不能重复');
      // }
      if (semester) {
        api.calendar.updateWeekConfig(semester?.id, data).then((res) => {
          message.success('周次设置成功');
          setType(-1);
        });
      }
    };
    let content =
      type === 0 ? (
        <InputNumber
          type='number'
          onBlur={(e) => onEditWeek(e)}
          onPressEnter={(e) => onEditWeek(e)}
          defaultValue={val}
          step={1}
          min={1}
          precision={0}></InputNumber>
      ) : (
        <span
          style={{
            display: 'inline-block',
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '1px solid #111',
            lineHeight: '24px',
            textAlign: 'center',
          }}>
          {val}
        </span>
      );
    return {
      children: content,
      props: {
        style: {
          padding: '10px 0',
        },
      },
    };
  };
  // 弹窗提交form
  const onSubmit = () => {
    form.validateFields().then(() => {
      let data = form.getFieldsValue();
      // 学期存在，当前选中事项或新增事项存在，类型为 1，2，3，4，5
      if (semester && selectedEvent) {
        setLoading(true);
        if (data.id) {
          api.calendar
            .updateEvent(semester.id, {
              id: data.id,
              startDate: selectedEvent.startDate,
              endDate: selectedEvent.endDate,
              notes: data.notes,
              adjustments: data.adjustments?.map((item: any) => ({
                ...item,
                detailDate: item.detailDate.format('YYYY-MM-DD'),
              })),
              type: selectedEvent.type,
            })
            .then(() => {
              refreshCalendarDay();
              message.success('设置成功');
              setSelectedEvent(null);
              setLoading(false);
              form.resetFields();
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          api.calendar
            .createEvent(semester.id, {
              startDate: selectedEvent.startDate,
              endDate: selectedEvent.endDate,
              notes: data.notes,
              type: selectedEvent.type,
              adjustments: data.adjustments?.map((item: any) => ({
                ...item,
                detailDate: item.detailDate.format('YYYY-MM-DD'),
              })),
            })
            .then(() => {
              refreshCalendarDay();
              message.success('设置成功');
              setSelectedEvent(null);
              setLoading(false);
              form.resetFields();
            })
            .catch(() => {
              setLoading(false);
            });
        }
      }
    });
  };
  // 删除
  const onDelete = (id?: number) => {
    let deleteId: number;
    if (id) {
      deleteId = id;
    } else {
      deleteId = selectedEvent?.id || -1;
    }
    if (deleteId && deleteId !== -1) {
      Modal.confirm({
        title: `确认删除当前事项吗？`,
        zIndex: 1111,
        onOk: () => {
          api.calendar.deleteEvent(deleteId).then(() => {
            message.success('删除成功');
            refreshCalendarDay();
            setSelectedEvent(null);
          });
        },
      });
    } else {
      setSelectedEvent(null);
    }
  };
  // 日期渲染函数
  const renderDate = (val: CalendarCell, record: any, index: number) => {
    const days = record.days;
    let backgroundColor = '#fff';
    let eventType = 0;
    let weekday = adjustments.get(val?.date.format('YYYY-MM-DD')) || val?.date?.days();
    if (
      selectedEvent &&
      val?.date <= moment(selectedEvent.endDate) &&
      val?.date >= moment(selectedEvent.startDate)
    ) {
      backgroundColor = eventsConfig.get(selectedEvent.type)?.color || '#fff';
    } else {
      const dayEvents = calendarDay?.filter(
        (item) => item.detailDate === val?.date.format('YYYY-MM-DD'),
      )[0];
      const keys = dayEvents?.items?.map((item) => item?.type);
      if (keys?.includes(4)) {
        backgroundColor = eventsConfig.get(4)?.color || '#fff';
        weekday = undefined;
      } else if (keys?.includes(3)) {
        backgroundColor = eventsConfig.get(3)?.color || '#fff';
        weekday = undefined;
      } else {
        backgroundColor = [6, 0].includes(weekday) ? '#E8FAF1' : '';
      }
    }

    // 3 考试 4节假日 5
    [...(events?.values() || [])].forEach((event) => {
      if (
        moment(event.startDate).format('YYYY-MM-DD') === val?.date.format('YYYY-MM-DD') &&
        eventType !== 4 &&
        eventType !== 3
      ) {
        eventType = event.type;
      }
    });
    return {
      children: (
        <Row
          align='middle'
          justify='center'
          style={{ flexDirection: 'column' }}
          data-day={val?.date?.days()}>
          {selectedEvent &&
          val?.date.valueOf() === moment(selectedEvent.startDate).valueOf() &&
          !mouse ? (
            <Popover
              visible
              placement='right'
              title={eventsConfig.get(selectedEvent.type)?.name}
              content={
                <div>
                  <Form
                    form={form}
                    initialValues={{ notes: '', isAdjust: false, adjustments: [] }}
                    style={{ width: 450 }}>
                    <Form.Item name='id' hidden></Form.Item>
                    {selectedEvent.type === 6 ? (
                      <div>
                        <Form.Item label='调休日期'>
                          {moment(selectedEvent.startDate).format('YYYY-MM-DD')}
                        </Form.Item>
                        <Form.Item
                          label='调休说明'
                          name='notes'
                          rules={[{ required: true, whitespace: true }]}>
                          <Input maxLength={50} placeholder='请输入'></Input>
                        </Form.Item>
                        <Form.List name='adjustments'>
                          {(fields, { add, remove }) => (
                            <div>
                              {fields.map((field, index) => (
                                <Form.Item
                                  rules={[{ required: true, message: '请选择调休班次' }]}
                                  label='调休班次'
                                  name={[field.name, 'dayOfWeek']}
                                  fieldKey={[field.fieldKey, 'dayOfWeek']}>
                                  <Select
                                    placeholder='请选择'
                                    options={[
                                      {
                                        label: '星期一',
                                        value: 1,
                                      },
                                      {
                                        label: '星期二',
                                        value: 2,
                                      },
                                      {
                                        label: '星期三',
                                        value: 3,
                                      },
                                      {
                                        label: '星期四',
                                        value: 4,
                                      },
                                      {
                                        label: '星期五',
                                        value: 5,
                                      },
                                    ]}></Select>
                                </Form.Item>
                              ))}
                            </div>
                          )}
                        </Form.List>
                      </div>
                    ) : null}
                    {selectedEvent.type === 5 ? (
                      <Form.Item
                        name='notes'
                        rules={[{ required: true, message: '请输入', whitespace: true }]}
                        label={`${moment(selectedEvent.startDate).format('MM/DD')} - ${moment(
                          selectedEvent.endDate,
                        ).format('MM/DD')}`}>
                        <Input.TextArea
                          maxLength={200}
                          rows={4}
                          placeholder='请输入'></Input.TextArea>
                      </Form.Item>
                    ) : null}
                    {selectedEvent.type === 4 ? (
                      <div>
                        <Form.Item label='考试日期'>
                          {moment(selectedEvent.startDate).format('YYYY-MM-DD')}~
                          {moment(selectedEvent.endDate).format('YYYY-MM-DD')}
                        </Form.Item>
                        <Form.Item label='考试说明' name='notes' rules={[{ required: true }]}>
                          <Input maxLength={50} placeholder='请输入'></Input>
                        </Form.Item>
                      </div>
                    ) : null}
                    {selectedEvent.type === 3 ? (
                      <div>
                        <Form.Item label='节假日期'>
                          {moment(selectedEvent.startDate).format('YYYY-MM-DD')}~
                          {moment(selectedEvent.endDate).format('YYYY-MM-DD')}
                        </Form.Item>
                        <Form.Item
                          label='假期说明'
                          name='notes'
                          rules={[{ required: true, whitespace: true }]}>
                          <Input maxLength={50} placeholder='请输入'></Input>
                        </Form.Item>
                        <Form.Item label='是否调休' name='isAdjust' rules={[{ required: true }]}>
                          <Radio.Group
                            onChange={(e) => {
                              setIsAdjust(e.target.value);
                              if (e.target.value) {
                                form.setFieldsValue({
                                  adjustments: [
                                    {
                                      dayOfWeek: null,
                                      detailDate: null,
                                    },
                                  ],
                                });
                              }
                            }}>
                            <Radio value={false}>否</Radio>
                            <Radio value={true}>是</Radio>
                          </Radio.Group>
                        </Form.Item>
                        {isAdjust ? (
                          <Form.List name='adjustments'>
                            {(fields, { add, remove }) => (
                              <div>
                                {fields.map((field, index) => (
                                  <Row>
                                    <Col span='11'>
                                      <Form.Item
                                        validateFirst
                                        rules={[
                                          { required: true, message: '请选择调休日期' },
                                          {
                                            validator: (rule, val) => {
                                              let length = form
                                                .getFieldValue('adjustments')
                                                .filter(
                                                  (item: any) =>
                                                    item.detailDate &&
                                                    val &&
                                                    item.detailDate.format('YYYY-MM-DD') ===
                                                      val.format('YYYY-MM-DD'),
                                                ).length;
                                              if (length > 1) {
                                                return Promise.reject('调休日期不能重复');
                                              }
                                              return Promise.resolve();
                                            },
                                          },
                                        ]}
                                        label='调休日期'
                                        name={[field.name, 'detailDate']}
                                        dependencies={fields.map((field, index) => {
                                          return ['adjustments', index, 'detailDate'];
                                        })}
                                        fieldKey={[field.fieldKey, 'detailDate']}>
                                        <DatePicker
                                          defaultPickerValue={
                                            form.getFieldValue('adjustments')?.[index].detailDate ||
                                            startDate
                                          }
                                          disabledDate={(date) => {
                                            let d = [...events?.values()];
                                            const es = [...events?.values(), selectedEvent].filter(
                                              (item) => {
                                                if (item?.startDate && item?.endDate) {
                                                  return (
                                                    [3, 4].includes(item.type) &&
                                                    !(
                                                      moment(item.endDate).unix() < date.unix() ||
                                                      moment(item.startDate).unix() > date.unix()
                                                    )
                                                  );
                                                }
                                                return false;
                                              },
                                            );
                                            return (
                                              !!es.length ||
                                              adjustments.has(date.format('YYYY-MM-DD')) ||
                                              date.unix() < startDate.unix() ||
                                              date.unix() >= endDate.unix() + 24 * 60 * 60
                                            );
                                          }}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span='11'>
                                      <Form.Item
                                        rules={[{ required: true, message: '请选择调休班次' }]}
                                        label='调休班次'
                                        name={[field.name, 'dayOfWeek']}
                                        fieldKey={[field.fieldKey, 'dayOfWeek']}>
                                        <Select
                                          placeholder='请选择'
                                          options={[
                                            {
                                              label: '星期一',
                                              value: 1,
                                            },
                                            {
                                              label: '星期二',
                                              value: 2,
                                            },
                                            {
                                              label: '星期三',
                                              value: 3,
                                            },
                                            {
                                              label: '星期四',
                                              value: 4,
                                            },
                                            {
                                              label: '星期五',
                                              value: 5,
                                            },
                                          ]}></Select>
                                      </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                      {index > 0 ? (
                                        <Button type='text' danger onClick={() => remove(index)}>
                                          删除
                                        </Button>
                                      ) : null}
                                    </Col>
                                  </Row>
                                ))}
                                <p>
                                  <Row justify='center'>
                                    <Button type='primary' onClick={add} style={{ width: 200 }}>
                                      添加
                                    </Button>
                                  </Row>
                                </p>
                              </div>
                            )}
                          </Form.List>
                        ) : null}
                      </div>
                    ) : null}
                  </Form>
                  <Row justify='space-between'>
                    <Button danger type='link' onClick={() => onDelete()}>
                      删除
                    </Button>
                    <Space>
                      <Button
                        onClick={() => {
                          setSelectedEvent(null);
                        }}>
                        返回
                      </Button>
                      <Button type='primary' onClick={onSubmit} loading={loading}>
                        确定
                      </Button>
                    </Space>
                  </Row>
                </div>
              }
              getPopupContainer={() =>
                document.querySelector('.app_container') || document.body
              }></Popover>
          ) : null}
          <div data-day={val?.date?.days()}>{val?.date?.format('D')}</div>
          {[, , , '节假日', '考试'][eventType] ? (
            <div data-day={val?.date?.days()}>{[, , , '节假日', '考试'][eventType]}</div>
          ) : (
            <div data-day={val?.date?.days()}>{[, 'A', 'B', 'C', 'D', 'E'][weekday]}</div>
          )}
        </Row>
      ),
      props: {
        style: {
          padding: '10px 0',
          'user-select': 'none',
          position: 'relative',
          minHeight: 100,
          height: 70,
          backgroundColor: backgroundColor,
        },
        'data-day': val?.date?.days(),
      },
    };
  };
  // 监听每个日期鼠标事件，用于创建事件
  const onCell: GetComponentProps<any> = (record: any, index: any) => {
    return {
      // 鼠标移动进入某个日期时，开始更新最近一个事件的结束时间
      onMouseEnter: (event) => {
        if (mouse && type !== -1 && type !== 0 && type !== 1) {
          const day = (event.target as Element).getAttribute('data-day');
          if (day) {
            const endDate = record.days[day].date;
            const startDate = selectedEvent?.startDate && moment(selectedEvent?.startDate);
            if (startDate && endDate > startDate) {
              setSelectedEvent({
                ...selectedEvent,
                startDate: startDate.format('YYYY-MM-DD'),
                notes: '新建事件',
                endDate: endDate.format('YYYY-MM-DD'),
                type,
                dayId: -1,
                id: -1,
              });
            } else {
              setSelectedEvent(null);
            }
          }
        }
      },
      // 按下左键时，插入数据，开始监听结束日期
      onMouseDown: (event) => {
        const day = (event.target as Element).getAttribute('data-day');

        // 没有设置状态下，点击存在考试或者节假日时是编辑
        if (type !== -1 && day) {
          const date = record.days[day].date.format('YYYY-MM-DD');
          const dayEvents = calendarDay?.filter((item) => item.detailDate === date)[0];
          const keys = dayEvents?.items?.map((item) => item?.type) || [];
          let examIndex = keys?.indexOf(4);
          if (examIndex > -1 && type === 4) {
            dayEvents?.items?.[examIndex].id &&
              onEdit(dayEvents?.items[examIndex].id, dayEvents?.items[examIndex]);
            return;
          }
          let holidayIndex = keys?.indexOf(3);
          if (holidayIndex > -1 && type === 3) {
            dayEvents?.items?.[holidayIndex].id &&
              onEdit(dayEvents?.items[holidayIndex].id, dayEvents?.items[holidayIndex]);
            return;
          }
          let adjustmentIndex = keys?.indexOf(6);

          if (adjustmentIndex > -1 && type === 6) {
            dayEvents?.items?.[adjustmentIndex].id &&
              onEdit(dayEvents?.items[adjustmentIndex].id, dayEvents?.items[adjustmentIndex]);
            return;
          }
          console.log(day, 1, date, dayEvents);
        }

        if (![3, 4, 5, 6].includes(type)) return;
        if (type === 6 && day && ['0', '6'].indexOf(day) === -1) return;

        if (day && type !== -1 && type !== 0 && type !== 1) {
          if (type !== 6) {
            setMouse(true);
          } else {
            form.setFieldsValue({
              id: null,
              notes: '',
              adjustments: [
                {
                  dayOfWeek: null,
                  detailDate: record.days[day].date,
                },
              ],
            });
            const dayEvents = calendarDay?.filter(
              (item) => moment(item.detailDate).unix() === record.days[day].date.unix(),
            )[0];
            if (dayEvents?.adjustment) {
              return message.warn(`选中日期已有调休设置`);
            }
            const es = [...events?.values()].filter(
              (item) =>
                (item.type === 3 || item.type === 4) &&
                record.days[day].date.unix() >= moment(item.startDate).unix() &&
                record.days[day].date.unix() <= moment(item.endDate).unix(),
            );
            if (es.length) {
              console.log(es, 2);
              return message.warn(`选中日期已有${eventsConfig.get(es[0].type)?.name}`);
            }
          }

          setSelectedEvent({
            id: -1,
            dayId: -1,
            type,
            notes: '新建事件',
            startDate: record.days[day].date.format('YYYY-MM-DD'),
            endDate: record.days[day].date.format('YYYY-MM-DD'),
          });
        }
      },
      // 鼠标抬起时，更新事件，按开始事件排序，结束创建事件的流程
      onMouseUp: (event) => {
        if (mouse) {
          setMouse(false);
          // 节假日 考试日期是否存在重复
          const es = [...events?.values()].filter((item) => {
            if (selectedEvent?.startDate && selectedEvent?.endDate) {
              return (
                [3, 4, 6].includes(item.type) &&
                !(
                  (moment(item.endDate).unix() < moment(selectedEvent?.startDate).unix() &&
                    moment(item.endDate).unix() < moment(selectedEvent?.endDate).unix()) ||
                  (moment(item.startDate).unix() > moment(selectedEvent?.startDate).unix() &&
                    moment(item.startDate).unix() > moment(selectedEvent?.endDate).unix())
                )
              );
            }
            return false;
          });
          // const enable = es.every((item) => {
          //   if (selectedEvent?.startDate && selectedEvent?.endDate) {
          //     return;
          //   }
          //   return false;
          // });
          if (es.length && type !== 5) {
            setSelectedEvent(null);
            message.warn(`选中日期已有${eventsConfig.get(es[0].type)?.name}`);
          }
          // console.log(selectedEvent, 1, es);
        }
      },
    };
  };
  const onEdit = (id: number, item?: GT.Model.CalendarEvent) => {
    if (item?.type !== type) return;
    api.calendar.getEvent(id).then((event) => {
      setSelectedEvent(event);
      setIsAdjust(!!event.adjustments?.length);
      form.setFieldsValue({
        ...event,
        isAdjust: !!event.adjustments?.length,
        adjustments: event.adjustments?.map((item) => {
          return {
            ...item,
            detailDate: moment(item.detailDate),
          };
        }),
      });
    });
  };
  const renderItems = (val: any, record: any, index: number) => {
    const keys = Object.keys(record.days).map((item) => Number(item));
    const dates = keys.map((item) => record.days[item]?.date?.valueOf());
    const min = Math.min.apply(null, dates);
    const max = Math.max.apply(null, dates);
    const renderEvents = [...(events?.values() || [])].filter((event) => {
      return moment(event.startDate).valueOf() <= max && moment(event.startDate).valueOf() >= min;
    });

    return (
      <div style={{ color: '#616266', fontSize: 13, width: 300 }}>
        {renderEvents.map((item) => {
          let startTime;
          let endTime;
          if (
            moment(item.startDate).year() !== moment(item.endDate).year() &&
            moment(item.startDate).month() !== moment(item.endDate).month()
          ) {
            startTime = moment(item.startDate).format('MM/DD');
            endTime = moment(item.endDate).format('MM/DD');
          } else if (moment(item.startDate).month() !== moment(item.endDate).month()) {
            startTime = moment(item.startDate).format('MM/DD');
            endTime = moment(item.endDate).format('MM/DD');
          } else if (moment(item.startDate).day() !== moment(item.endDate).day()) {
            startTime = moment(item.startDate).format('DD');
            endTime = moment(item.endDate).format('DD');
          } else {
            startTime = moment(item.startDate).format('DD');
          }
          return (
            <p onClick={() => onEdit(item.id, item)} className='calendar-event'>
              {startTime}
              {endTime && `-${endTime}`}：{item.notes}
              {item.type === type && !props.id ? (
                <Space className='calendar-event-button'>
                  <IconFont
                    type='iconbianji'
                    style={{ color: '#5781F2' }}
                    onClick={() => {
                      onEdit(item.id, { type } as GT.Model.CalendarEvent);
                    }}
                  />
                  <IconFont
                    type='icondelete1'
                    style={{ color: '#f81d22' }}
                    onClick={() => {
                      onDelete(item.id);
                    }}
                  />
                </Space>
              ) : null}
            </p>
          );
        })}
      </div>
    );
  };
  const downLoadPdf = () => {
    const dom = document.querySelector('#pdf') as HTMLElement;
    if (dom) {
      html2canvas(dom).then((canvas) => {
        let dataURL = canvas.toDataURL('image/jpeg', 1.0);
        downloadBase64({
          dataURL,
          fileName: `萧山中学${semester?.startYear}学年第${semester?.orderNo}学期校历`,
        });
      });
    }
  };
  const onPreview = () => {
    createPdf('#pdf', false);
  };
  return (
    <div>
      <div
        style={{
          position: 'fixed',
          display: type === -1 ? 'none' : 'block',
          background: 'rgba(0, 0, 0, 0.45)',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}></div>
      <div
        style={{
          width: 1000,
          padding: 10,
          margin: '0 auto',
          position: 'relative',
          zIndex: 111,
          background: '#fff',
        }}>
        <p>
          {![0, 1, 2, 3, 4, 5, 6].includes(type) ? (
            <Row justify='space-between'>
              {!props.id ? (
                <Space>
                  <PrivateComponent id={284}>
                    <Button type='primary' onClick={() => setType(0)}>
                      周次设置
                    </Button>
                  </PrivateComponent>
                  <PrivateComponent id={284}>
                    <Button type='primary' onClick={() => setType(1)}>
                      大小礼拜设置
                    </Button>
                  </PrivateComponent>
                  <PrivateComponent id={285}>
                    <Button type='primary' onClick={() => setType(5)}>
                      日程设置
                    </Button>
                  </PrivateComponent>
                  <PrivateComponent id={286}>
                    <Button type='primary' onClick={() => setType(3)}>
                      节假日设置
                    </Button>
                  </PrivateComponent>
                  <PrivateComponent id={286}>
                    <Button type='primary' onClick={() => setType(6)}>
                      调休设置
                    </Button>
                  </PrivateComponent>
                  <PrivateComponent id={287}>
                    <Button type='primary' onClick={() => setType(4)}>
                      考试设置
                    </Button>
                  </PrivateComponent>
                </Space>
              ) : null}

              <Space>
                <PrivateComponent id={288}>
                  <Button type='primary' ghost onClick={downLoadPdf} icon={<UploadOutlined />}>
                    下载
                  </Button>
                </PrivateComponent>
                <PrivateComponent id={289}>
                  <Button type='primary' ghost onClick={onPreview} icon={<PrinterOutlined />}>
                    打印
                  </Button>
                </PrivateComponent>
              </Space>
            </Row>
          ) : (
            <Row justify='start'>
              <Button
                type='primary'
                ghost
                onClick={() => {
                  setType(-1);
                  setSelectedEvent(null);
                }}>
                返回
              </Button>
            </Row>
          )}
        </p>
        <div id='pdf'>
          <p style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center' }}>
            萧山中学{semester?.startYear}-{semester?.endYear}学年第{semester?.orderNo}学期校历
          </p>
          <p>
            <Row justify='space-between'>
              <Space>
                <Row align='middle'>
                  <ColorBlock color={'#fff'}></ColorBlock>
                  日常教学/工作日
                </Row>
                <Row align='middle'>
                  <ColorBlock color={'#E8FAF1'}></ColorBlock>
                  周末
                </Row>
                <Row align='middle'>
                  <ColorBlock color={'#EDEDFC'}></ColorBlock>
                  节假日
                </Row>
                <Row align='middle'>
                  <ColorBlock color={'#FFF6EB'}></ColorBlock>
                  考试
                </Row>
                <Row align='middle'>
                  <ColorBlock color={'#fff'}></ColorBlock>
                  调休
                </Row>
              </Space>
              {type !== -1 ? (
                <Tooltip title={<CalendarBottomTips type={type}></CalendarBottomTips>}>
                  <Button type='link' style={{ color: '#FF8948' }}>
                    操作说明 <QuestionCircleFilled />
                  </Button>
                </Tooltip>
              ) : null}
            </Row>
          </p>
          <Table
            bordered
            dataSource={dataSource}
            pagination={false}
            className='table_no_hover print_table'>
            <Table.Column
              title='月份'
              dataIndex='month'
              align='center'
              width='80px'
              render={renderMonth}></Table.Column>
            <Table.Column
              title='周次'
              align='center'
              dataIndex='week'
              width='80px'
              render={renderWeek}></Table.Column>
            <Table.Column
              title='大小礼拜'
              align='center'
              dataIndex='weekSize'
              width='80px'
              render={renderWeekSize}></Table.Column>
            <Table.ColumnGroup title='星期' align='center'>
              <Table.Column
                title='一'
                align='center'
                onCell={onCell}
                dataIndex={['days', 1]}
                render={renderDate}></Table.Column>
              <Table.Column
                title='二'
                align='center'
                onCell={onCell}
                dataIndex={['days', 2]}
                render={renderDate}></Table.Column>
              <Table.Column
                title='三'
                align='center'
                onCell={onCell}
                dataIndex={['days', 3]}
                render={renderDate}></Table.Column>
              <Table.Column
                title='四'
                align='center'
                onCell={onCell}
                dataIndex={['days', 4]}
                render={renderDate}></Table.Column>
              <Table.Column
                title='五'
                align='center'
                onCell={onCell}
                dataIndex={['days', 5]}
                render={renderDate}></Table.Column>
              <Table.Column
                title='六'
                align='center'
                onCell={onCell}
                dataIndex={['days', 6]}
                render={renderDate}></Table.Column>
              <Table.Column
                title='日'
                align='center'
                dataIndex={['days', 0]}
                onCell={onCell}
                render={renderDate}></Table.Column>
            </Table.ColumnGroup>
            <Table.Column
              title={<div style={{ textAlign: 'center' }}>事项</div>}
              width={300}
              render={renderItems}></Table.Column>
          </Table>
          <div style={{ marginTop: 20 }}>
            <CalendarBottomTips type={type}></CalendarBottomTips>
          </div>
        </div>
      </div>
    </div>
  );
}
