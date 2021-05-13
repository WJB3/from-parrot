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
import moment from "moment";
import { useGlobalState, ActionType } from "src/store";
import { useForm } from "antd/lib/form/Form";
import { useHistory } from "react-router-dom";
import api from "src/api";
import { CollectionTaskDetail } from "types/model";

export default function PublishCollection(props: any) {
  const history = useHistory();
  const [form] = useForm();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState<CollectionTaskDetail>();
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true);

  const yearFormat = "YYYY";
  const timeFormat = "YYYY-MM-DD HH:mm";

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
    api.collection.getCurrentSemester().then((value) => {
      form.setFieldsValue({
        receiver: `高一（当前高中${value + 3}届）`,
        enrollmentYear: value,
      });
    });
    if (props.id != null) {
      api.collection.getTaskDetail(props.id).then((value) => {
        setLoadingFlag(false);
        setDataDetail(value);
        form.setFieldsValue({
          name: value.name,
          year: moment(value.year, yearFormat),
          time: [
            moment(value.startTime, timeFormat),
            moment(value.endTime, timeFormat),
          ],
        });
      });
    } else {
      setLoadingFlag(false);
    }
  }, []);

  const save = () => {
    form.validateFields().then(() => {
      setLoading(true);
      const params = {
        id: dataDetail?.id,
        name: form.getFieldValue("name"),
        year: form.getFieldValue("year").format("yyyy"),
        startTime: form.getFieldValue("time")[0].format("YYYY-MM-DD HH:mm"),
        endTime: form.getFieldValue("time")[1].format("YYYY-MM-DD HH:mm"),
        enrollmentYear: form.getFieldValue("enrollmentYear"),
        type: 3,
      };
      if (props.id == null) {
        api.collection
          .createCollectionTask(params)
          .then(() => {
            message.success("新增成功");
            history.goBack();
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        api.collection
          .updateCollectionTask(params)
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
      <Form name="publish" layout="horizontal" colon={false} form={form}>
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
          <Input maxLength={50} style={{ width: 400 }} disabled></Input>
        </Form.Item>
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
      </Form>
    </div>
  );
}
