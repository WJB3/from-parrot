import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  message,
  Row,
  Spin,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import GT from "types";
import SelectMemberModal from "src/components/selectMember";
import { useMap } from "ahooks";
import api from "src/api";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { CreateTaskParams } from "types/dto";
import GuideTeacherModal from "../../reportInfo/studentReport/component/GuideTeachers";
import { useGlobalState, ActionType } from "src/store";
import IconFont from "src/components/IconFont";

export default function PublishNewTask(props: any) {
  const history = useHistory();
  const { RangePicker } = DatePicker;
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  const yearFormat = "YYYY";
  const timeFormat = "YYYY-MM-DD HH:mm";

  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const [show, setShow] = useState(false);
  const [map, { set, get, setAll, reset }] = useMap(new Map());
  const [disableFlag, setDisableFlag] = useState(false);
  const [dataDetail, setDataDetail] = useState<CreateTaskParams>();
  const [teachers, setTeachers] = useState<GT.Model.Teacher[]>();
  const modal = useRef<GT.Modal.Ref>();

  const [loadingFlag, setLoadingFlag] = useState<boolean>(true);

  // 教师单独modal
  const singleTeacherModal = useRef<GT.Modal.Ref>();
  // 是否可以修改
  const [canEdit, setCanEdit] = useState(true);

  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: props.isEdit ? "编辑任务" : "发布新任务" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);

  useEffect(() => {
    if (props.id != null) {
      api.award.getTaskDetail(props.id).then((value) => {
        setLoadingFlag(false);
        console.log(value);
        setDataDetail(value);
        setShow(!value.allTeacher);

        if (value.status === 2) {
          setDisableFlag(true);
        }
        if (!value.allTeacher) {
          setTeachers(value.teacherVOS);
          modal.current?.setTeachers(value.teacherVOS);
          form.setFieldsValue({
            name: value.name,
            year: moment(value.year, yearFormat),
            time: [
              moment(value.startTime, timeFormat),
              moment(value.endTime, timeFormat),
            ],
            receiver: !value.allTeacher,
            teachers: getTeacherNames(value.teacherVOS!!).toString(),
          });
        } else {
          form.setFieldsValue({
            name: value.name,
            year: moment(value.year, yearFormat),
            time: [
              moment(value.startTime, timeFormat),
              moment(value.endTime, timeFormat),
            ],
            receiver: !value.allTeacher,
          });
        }
      });
    } else {
      setLoadingFlag(false);
    }
  }, []);

  const renderSuffix = () => {
    let lists = teachers;
    if (lists && lists?.length > 1) {
      return (
        <div style={{ color: "#5781F2" }} onClick={onClickSelectTeachers}>
          {"共" + lists.length + "人"}
        </div>
      );
    } else if (lists && lists?.length === 1) {
      return (
        <div>
          <IconFont
            type="iconcaiji-delete-gray"
            onClick={() => {
              setTeachers([]);
              console.log(form);
              form.setFieldsValue({ teachers: "" });
            }}
          ></IconFont>
        </div>
      );
    } else {
      return null;
    }
  };

  // 获取教师 modal回调
  const chooseEmptyTeachers = (data: Map<string, any>) => {
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
    let currentLists = teachers ? teachers : [];
    const isNeedReplace = teachers && teachers.length === 1;
    for (let index = 0; index < currentLists.length; index++) {
      const element = currentLists[index];
      // 新增的老师中过滤掉相同的数据 兼容Id
      const elementId = element.memberId ? element.memberId : element.id;
      addTeachers = addTeachers.filter(
        (item) => (item.memberId ? item.memberId : item.id) !== elementId
      );
    }
    currentLists = currentLists.concat(addTeachers);
    let teachersName = getTeacherNames(currentLists).toString();
    form.setFieldsValue({ teachers: teachersName });
  };

  //保存任务
  const save = () => {
    form.validateFields().then(() => {
      setLoading(true);
      const params = {
        allTeacher: !show,
        name: form.getFieldValue("name"),
        year: form.getFieldValue("year").format("yyyy"),
        startTime: form.getFieldValue("time")[0].format("YYYY-MM-DD HH:mm"),
        endTime: form.getFieldValue("time")[1].format("YYYY-MM-DD HH:mm"),
        teacherIds: getTeacherIds(),
        type: props.type,
        id: dataDetail?.id,
      };
      if (props.id == null) {
        api.award
          .createTask(params)
          .then(() => {
            message.success("新增成功");
            history.goBack();
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        api.award
          .updateTask(params)
          .then(() => {
            message.success("编辑成功");
            history.goBack();
          })
          .catch(() => {
            setLoading(false);
          });
      }
    });
  };

  const getTeacherIds = () => {
    // 返回一个string类的数组
    let lists: string[] = [];
    if (teachers !== undefined) {
      teachers.forEach((element) => {
        lists.push(
          (element.memberId ? element.memberId : element.id).toString()
        );
      });
    }
    return lists;
  };

  // 选择多老师判断
  const onClickSelectTeachers = () => {
    //
    if (teachers && teachers.length > 1) {
      modal.current?.setTitle("接收对象详情");
      modal.current?.setVisible(true);
      modal.current?.setCanOperate(canEdit);
      modal.current?.setTeachers(teachers);
    } else {
      // 少于一个教练 直接展示
      if (canEdit) {
        singleTeacherModal.current?.setVisible(true);
        singleTeacherModal.current?.setMembers(new Map());
      }
    }
  };

  // 通过回调获取教师名称
  const getTeacherNames = (data: GT.Model.Teacher[]) => {
    setTeachers(data);
    let lists: string[] = [];
    if (data.length === 1) {
      //
      data.forEach((element) =>
        lists.push(element.name + "(" + element.phone + ")")
      );
    } else {
      data.forEach((element) => lists.push(element.name));
    }
    return lists;
  };

  return loadingFlag ? (
    <Row justify="center">
      <Spin
        style={{ marginTop: "30vh" }}
        spinning={loadingFlag}
        size="large"
      ></Spin>
    </Row>
  ) : (
    <div>
      <Form
        name="publish"
        layout="horizontal"
        colon={false}
        form={form}
        initialValues={{ receiver: show }}
      >
        <Form.Item label="任务名称" name="name" rules={[{ required: true }]}>
          <Input
            maxLength={50}
            allowClear={true}
            placeholder="请输入"
            style={{ width: 400 }}
          ></Input>
        </Form.Item>

        <Form.Item
          label="填报年份"
          name="year"
          rules={[{ required: true, message: "请选择填报年份" }]}
        >
          <DatePicker picker="year" style={{ width: 400 }} />
        </Form.Item>

        <Form.Item
          label="填报时间"
          name="time"
          rules={[{ required: true, message: "请选择填报年份" }]}
        >
          <RangePicker
            style={{ width: 400 }}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [moment(), moment()],
            }}
            defaultPickerValue={[moment(), moment()]}
            format="YYYY-MM-DD HH:mm"
          />
        </Form.Item>
        <Form.Item
          label="接收对象"
          name="receiver"
          rules={[{ required: true }]}
        >
          <Radio.Group value={show} disabled={disableFlag}>
            <Radio
              onChange={() => setShow(false)}
              style={radioStyle}
              value={false}
            >
              全部老师
            </Radio>
            <Radio
              onChange={() => setShow(true)}
              style={radioStyle}
              value={true}
            >
              部分老师
            </Radio>
          </Radio.Group>
        </Form.Item>
        {show ? (
          <Form.Item
            label={
              <div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
            }
            required={false}
            name="teachers"
            rules={[{ required: show, message: "请选择接收对象" }]}
          >
            <Input
              disabled={disableFlag}
              placeholder="请选择"
              readOnly={true}
              onClick={onClickSelectTeachers}
              suffix={renderSuffix()}
              allowClear={true}
              style={{ width: 400 }}
            ></Input>
          </Form.Item>
        ) : null}
      </Form>
      <Button type="primary" onClick={save} loading={loading}>
        保存
      </Button>
      <Button
        style={{ marginLeft: 10 }}
        onClick={() => {
          history.goBack();
        }}
      >
        取消
      </Button>
      <GuideTeacherModal
        taskId={props.taskId}
        onRef={(ref) => (modal.current = ref)}
        onOk={(data) => {
          if (data !== undefined) {
            let names = getTeacherNames(data).toString();
            form.setFieldsValue({ teachers: names });
          } else {
            form.setFieldsValue({ teachers: "" });
          }
        }}
      />
      <SelectMemberModal
        tabs={["organization", "group"]}
        customQuery={{ propertyType: 0 }}
        onRef={(ref) => (singleTeacherModal.current = ref)}
        onOk={chooseEmptyTeachers}
      ></SelectMemberModal>
    </div>
  );
}
