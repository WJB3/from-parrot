import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  message,
  Row,
  Spin,
  Select,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import api from "src/api";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { useGlobalState, ActionType } from "src/store";

export default function CreateTask(props: {id?: number}) {
  const history = useHistory();
  const { RangePicker } = DatePicker;

  const yearFormat = "YYYY";
  const timeFormat = "YYYY-MM-DD HH:mm";

  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true);

  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: props.id ? "编辑任务" : "发布新任务" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);

  useEffect(() => {
    if (props.id != null) {
      api.assessment.getTaskDetail(props.id).then((value) => {
        setLoadingFlag(false);
        form.setFieldsValue({
          id: value.id,
          name: value.name,
          year: moment(value.year, yearFormat),
          time: [
            moment(value.startTime, timeFormat),
            moment(value.endTime, timeFormat),
          ],
          templateId: value.templateId,
          remark: value.taskRemark,
        });
      });
    } else {
      setLoadingFlag(false);
    }
  }, []);

  //保存任务
  const save = () => {
    form.validateFields().then(() => {
      setLoading(true);
      const params = {
        name: form.getFieldValue("name"),
        year: form.getFieldValue("year").format("yyyy"),
        startTime: form.getFieldValue("time")[0].format("YYYY-MM-DD HH:mm"),
        endTime: form.getFieldValue("time")[1].format("YYYY-MM-DD HH:mm"),
        templateId: form.getFieldValue("templateId"),
        remark: form.getFieldValue("remark"),
        id: form.getFieldValue("id"),
      };
      if (props.id == null) {
        api.assessment
          .create(params)
          .then(() => {
            message.success("新增成功");
            history.goBack();
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        api.assessment
          .update(params)
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
      <Form
        name="publish"
        layout="horizontal"
        colon={false}
        form={form}
        initialValues={{templateId: 1}}
      >
        <Form.Item name="id" hidden>
          <Input></Input>
        </Form.Item>
        <Form.Item label="任务名称" name="name" rules={[{ required: true, whitespace: true }]}>
          <Input
            maxLength={50}
            allowClear={true}
            placeholder="请输入"
            style={{ width: 400 }}
          ></Input>
        </Form.Item>

        <Form.Item
          label="考评年份"
          name="year"
          rules={[{ required: true, message: "请选择年份" }]}
        >
          <DatePicker picker="year" style={{ width: 400 }} placeholder="请选择年份" />
        </Form.Item>

        <Form.Item
          label="提交时间"
          name="time"
          rules={[{ required: true, message: "请选择时间范围" }]}
        >
          <RangePicker
            style={{ width: 400 }}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [moment(), moment()],
            }}
            defaultPickerValue={[moment(), moment()]}
            format="YYYY-MM-DD HH:mm"
            onChange={(start, end) => {
              if (end[0] === end[1]) {
                message.info("起始时间不可相等");
                form.setFieldsValue({time: ""});
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label="考评模板"
          name="templateId"
          rules={[{ required: true, message: "请选择考评模板"}]}
        >
          <Select placeholder="请选择" allowClear style={{ width: 400 }} disabled>
            {[[1, "2020年考评模板"],].map(([value, label]) => (
              <Select.Option value={value} key={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
       <Form.Item label="备注说明" name="remark" style={{marginLeft: 10,}}>
          <Input.TextArea  
          placeholder="请输入备注说明"
          style={{width: 400 }}
          autoSize={{ minRows: 3, maxRows: 10 }}
          maxLength={500}></Input.TextArea>
       </Form.Item>
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

    </div>
  );
}
