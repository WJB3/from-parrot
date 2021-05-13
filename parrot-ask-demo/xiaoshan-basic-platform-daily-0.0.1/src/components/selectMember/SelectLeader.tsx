import { message, Modal, Select, Tabs } from 'antd';
import { Store } from 'antd/lib/form/interface';
import React, { useState } from 'react';
import api from 'src/api';
import GT from 'types';
type tabType = 1 | 2 | 3;
export default function SelectLeaderModal(
  props: GT.Modal.Props & {
    tabs: tabType[];
  },
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('选择组长');
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<GT.Model.Teacher[]>();
  const [students, setStudents] = useState<GT.Model.Student[]>();
  const [parents, setParents] = useState<GT.Model.Student[]>();
  const [leader, setLeader] = useState<{
    leaderType: number;
    leaderId: number;
    leaderName: string;
    number?: number;
  }>();
  const onSearch = (value: string) => {
    api.teacher
      .getPage({
        name: value,
        current: -1,
        size: -1,
      })
      .then((res) => {
        setTeachers(res.list);
      });
  };
  const getStudents = (val: string) => {
    api.student
      .getPage({
        name: val,
        current: -1,
        size: -1,
        scope: 1,
      })
      .then((res) => {
        setStudents(res.list);
      });
  };
  const getParents = (val: string) => {
    api.student
      .getPage({
        scope: 2,
        current: -1,
        size: -1,
        name: val,
      })
      .then((res) => {
        setParents(res.list);
      });
    // api.user
    //   .getParentPage({
    //     name: val,
    //     current: -1,
    //     size: -1,
    //   })
    //   .then((res) => {
    //     setParents(res.list);
    //   });
  };
  const tabMaps: Store = {
    1: {
      name: '教师',
      children: (
        <Select
          showSearch
          showArrow
          style={{ width: '100%' }}
          onSearch={onSearch}
          onSelect={(val, option) => {
            setLeader({ leaderId: Number(val), leaderType: 1, leaderName: option.title });
          }}
          onDropdownVisibleChange={(open) => open && onSearch('')}
          placeholder='请输入'
          getPopupContainer={() => document.body}
          filterOption={false}>
          {teachers?.map((t) => (
            <Select.Option value={t.id} title={t.name}>
              <div>
                <div>
                  <span style={{ fontSize: 13 }}>{t.name}</span>
                  <span style={{ fontSize: 12, color: '#909499' }}>({t.phone})</span>
                </div>
                <div style={{ color: '#616266', fontSize: 12 }}>{t.departmentName}</div>
              </div>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    2: {
      name: '学生',
      children: (
        <Select
          showSearch
          showArrow
          onSelect={(val, option) =>
            setLeader({ leaderId: Number(val), leaderType: 2, leaderName: option.title })
          }
          style={{ width: '100%' }}
          onSearch={getStudents}
          getPopupContainer={() => document.body}
          onDropdownVisibleChange={(open) => open && getStudents('')}
          placeholder='请输入'
          filterOption={false}>
          {students?.map((t) => (
            <Select.Option value={t.id} title={t.name}>
              <div>
                <div>
                  <span style={{ fontSize: 13 }}>
                    {t.name}({t.studentNo})
                  </span>
                </div>
                <div style={{ color: '#616266', fontSize: 12 }}>
                  {t.sectionName}
                  {t.className}
                </div>
              </div>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    3: {
      name: '家长',
      children: (
        <Select
          onSelect={(val, option) => {
            const [studentId, number] = val.toString().split(',');
            setLeader({
              leaderId: Number(studentId),
              leaderType: 3,
              leaderName: option.title,
              number: Number(number),
            });
          }}
          showSearch
          showArrow
          style={{ width: '100%' }}
          onSearch={getParents}
          onDropdownVisibleChange={(open) => open && getParents('')}
          getPopupContainer={() => document.body}
          placeholder='请输入'
          filterOption={false}>
          {parents?.map((t) =>
            t.parents?.map((p, index) => (
              <Select.Option value={`${t.id},${p.number}`} title={p.name}>
                <div>
                  <div>
                    <span style={{ fontSize: 13 }}>
                      {p.name}({p.phone})
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#909499' }}>
                      ({t.className} {t.name})家长
                    </span>
                  </div>
                </div>
              </Select.Option>
            )),
          )}
        </Select>
      ),
    },
  };
  props.onRef({
    setVisible,
    setTitle,
  });
  const handleOk = () => {
    if (!leader) {
      message.warning('请选择组长');
    } else {
      props.onOk?.(leader);
      setVisible(false);
    }
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
  };
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <Tabs
        defaultActiveKey={props.tabs[0].toString()}
        className='tabs_no_line'
        style={{ minWidth: 320 }}>
        {props.tabs.map((tab: number) => (
          <Tabs.TabPane key={tab.toString()} tab={tabMaps[tab]?.name} forceRender>
            {tabMaps[tab]?.children}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Modal>
  );
}

SelectLeaderModal.defaultProps = {
  tabs: [1, 2, 3],
};
