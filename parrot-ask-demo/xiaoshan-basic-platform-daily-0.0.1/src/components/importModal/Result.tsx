import useAntdTable, { PaginatedParams } from "ahooks/lib/useAntdTable";
import { Alert, Button, Form, Modal, Row, Space, Table } from "antd";
import { ColumnType } from "antd/lib/table";
import React, { useState } from "react";
import appStyle from "src/App.style";
import constant from "src/constant";
import useDownload from "src/hook/useDownload";
import GT from "types";
export default function ImportResultModal(
  props: GT.Modal.Props & {
    type:
      | "teacher"
      | "student"
      | "prestudent"
      | "building"
      | "parent"
      | "service"
      | "assessment";
  }
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("导入结果");
  const [data, setData] = useState<GT.Model.ImportExcelRes<any>>();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  const { download } = useDownload();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0]) => {
    return Promise.resolve({
      list: data?.failDTOS.slice((current - 1) * size, current * size),
      total: data?.failDTOS.length,
    });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    refreshDeps: [data],
  });
  props.onRef({
    setVisible,
    setTitle,
    setData,
  });
  const handleOk = () => {
    props.onOk?.();
    setVisible(false);
  };
  const handleCancel = () => {
    setData(undefined)
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const renderText = (field: any, val: any, index: any) => {
    const { current, pageSize } = tableProps.pagination;
    const pre = current && pageSize ? (current - 1) * pageSize : 0;
    const failInfo = data?.fieldExportDTOS[pre + index];

    let color;
    if (failInfo && failInfo[field] === 1) {
      color = "#FE4F54";
    }
    if (failInfo && failInfo[field] === 0) {
      color = "#FF8948";
    }
    return <span style={{ color }}>{val}</span>;
  };

  const getColumns: () => ColumnType<any>[] = () => {
    if (props.type === "teacher") {
      return [
        {
          title: "职工号",
          dataIndex: "employeeNo",
          align: "center",
          render: (val, record, index) => renderText("employeeNo", val, index),
        },
        {
          title: "IC卡号",
          dataIndex: "icCardNo",
          align: "center",
          render: (val, record, index) => renderText("icCardNo", val, index),
        },
        {
          title: "姓名",
          dataIndex: "name",
          align: "center",
          render: (val, record, index) => renderText("name", val, index),
        },
        {
          title: "性别",
          dataIndex: "gender",
          align: "center",
          render: (val, record, index) => renderText("gender", val, index),
        },
        {
          title: "手机号",
          dataIndex: "phone",
          align: "center",
          render: (val, record, index) => renderText("phone", val, index),
        },
        {
          title: "证件类型",
          dataIndex: "idType",
          align: "center",
          render: (val, record, index) => renderText("idType", val, index),
        },
        {
          title: "证件号码",
          dataIndex: "idNo",
          align: "center",
          render: (val, record, index) => renderText("idNo", val, index),
        },
        {
          title: "编制",
          dataIndex: "budgetedPost",
          align: "center",
          render: (val, record, index) =>
            renderText("budgetedPost", val, index),
        },
        {
          title: "部门",
          dataIndex: "department",
          align: "center",
          render: (val, record, index) => renderText("department", val, index),
        },
      ];
    }
    if (props.type === "student") {
      return [
        {
          title: "学段",
          align: "center",
          dataIndex: "sectionName",
          render: (val, record, index) => renderText("sectionName", val, index),
        },
        {
          title: "年级",
          align: "center",
          dataIndex: "gradeName",
          render: (val, record, index) => renderText("gradeName", val, index),
        },
        {
          title: "班级",
          align: "center",
          dataIndex: "className",
          render: (val, record, index) => renderText("className", val, index),
        },
        {
          title: "姓名",
          align: "center",
          dataIndex: "name",
          render: (val, record, index) => renderText("name", val, index),
        },
        {
          title: "性别",
          align: "center",
          dataIndex: "gender",
          render: (val, record, index) => renderText("gender", val, index),
        },
        {
          title: "学号",
          align: "center",
          dataIndex: "studentNo",
          render: (val, record, index) => renderText("studentNo", val, index),
        },
        {
          title: "IC卡号",
          align: "center",
          dataIndex: "icCardNo",
          render: (val, record, index) => renderText("icCardNo", val, index),
        },
        {
          title: "证件类型",
          align: "center",
          dataIndex: "idType",
          render: (val, record, index) => renderText("idType", val, index),
        },
        {
          title: "证件号码",
          align: "center",
          dataIndex: "idNo",
          render: (val, record, index) => renderText("idNo", val, index),
        },
        {
          title: "学生类型",
          align: "center",
          dataIndex: "studentType",
          render: (val, record, index) => renderText("studentType", val, index),
        },
        // {
        //   title: '住校情况',
        //   align: 'center',
        //   dataIndex: 'livingCondition',
        //   render: (val, record, index) => renderText('livingCondition', val, index),
        // },
      ];
    }
    if (props.type === "prestudent") {
      return [
        {
          title: "预备班",
          align: "center",
          dataIndex: "className",
          render: (val, record, index) => renderText("className", val, index),
        },
        {
          title: "姓名",
          align: "center",
          dataIndex: "name",
          render: (val, record, index) => renderText("name", val, index),
        },
        {
          title: "性别",
          align: "center",
          dataIndex: "gender",
          render: (val, record, index) => renderText("gender", val, index),
        },
        {
          title: "IC卡号",
          align: "center",
          dataIndex: "icCardNo",
          render: (val, record, index) => renderText("icCardNo", val, index),
        },
        {
          title: "证件类型",
          align: "center",
          dataIndex: "idType",
          render: (val, record, index) => renderText("idType", val, index),
        },
        {
          title: "证件号码",
          align: "center",
          dataIndex: "idNo",
          render: (val, record, index) => renderText("idNo", val, index),
        },
      ];
    }
    if (props.type === "building") {
      return [
        {
          title: "楼层",
          align: "center",
          dataIndex: "name",
          render: (val, record, index) => renderText("name", val, index),
        },
        {
          title: "房间名称",
          align: "center",
          dataIndex: "roomName",
          render: (val, record, index) => renderText("roomName", val, index),
        },
        {
          title: "房间类型",
          align: "center",
          dataIndex: "roomType",
          render: (val, record, index) => renderText("roomType", val, index),
        },
        {
          title: "房间面积(㎡)",
          align: "center",
          dataIndex: "area",
          render: (val, record, index) => renderText("area", val, index),
        },
        {
          title: "房间朝向",
          align: "center",
          dataIndex: "towards",
          render: (val, record, index) => renderText("towards", val, index),
        },
        {
          title: "房间层高(m)",
          align: "center",
          dataIndex: "height",
          render: (val, record, index) => renderText("height", val, index),
        },
      ];
    }
    if (props.type === "parent") {
      return [
        {
          title: "学段",
          align: "center",
          dataIndex: "sectionName",
          render: (val, record, index) => renderText("sectionName", val, index),
        },
        {
          title: "年级",
          align: "center",
          dataIndex: "gradeName",
          render: (val, record, index) => renderText("gradeName", val, index),
        },
        {
          title: "班级",
          align: "center",
          dataIndex: "className",
          render: (val, record, index) => renderText("className", val, index),
        },
        {
          title: "学号",
          align: "center",
          dataIndex: "studentNo",
          render: (val, record, index) => renderText("studentNo", val, index),
        },
        {
          title: "IC卡号",
          align: "center",
          dataIndex: "icCardNo",
          render: (val, record, index) => renderText("icCardNo", val, index),
        },
        {
          title: "姓名",
          align: "center",
          dataIndex: "name",
          render: (val, record, index) => renderText("name", val, index),
        },
        {
          title: "家长1",
          align: "center",
          render: (val, record, index) => (
            <div>
              <p>{renderText("parentName", record.parentName, index)}</p>
              <p>{renderText("relation", record.relation, index)}</p>
              <p>{renderText("phone", record.phone, index)}</p>
              <p>{renderText("unit", record.unit, index)}</p>
            </div>
          ),
        },
        {
          title: "家长2",
          align: "center",
          render: (val, record, index) => (
            <div>
              <p>{renderText("parentName2", record.parentName2, index)}</p>
              <p>{renderText("relation2", record.relation2, index)}</p>
              <p>{renderText("phone2", record.phone2, index)}</p>
              <p>{renderText("unit2", record.unit2, index)}</p>
            </div>
          ),
        },
      ];
    }
    if (props.type === "service") {
      return [
        {
          title: "IC卡号",
          align: "center",
          dataIndex: "icCardNo",
          render: (val, record, index) => renderText("icCardNo", val, index),
        },
        {
          title: "姓名",
          align: "center",
          dataIndex: "name",
          render: (val, record, index) => renderText("name", val, index),
        },
        {
          title: "证件类型",
          align: "center",
          dataIndex: "idType",
          render: (val, record, index) => renderText("idType", val, index),
        },
        {
          title: "证件号码",
          align: "center",
          dataIndex: "idNo",
          render: (val, record, index) => renderText("idNo", val, index),
        },
        {
          title: "性别",
          align: "center",
          dataIndex: "gender",
          render: (val, record, index) => renderText("gender", val, index),
        },
        {
          title: "手机号",
          align: "center",
          dataIndex: "phone",
          render: (val, record, index) => renderText("idNo", val, index),
        },
        {
          title: "服务部门",
          align: "center",
          dataIndex: "department",
          render: (val, record, index) => renderText("department", val, index),
        },
        {
          title: "所属公司",
          align: "center",
          dataIndex: "companyName",
          render: (val, record, index) => renderText("companyName", val, index),
        },
      ];
    }

    if (props.type === "assessment") {
      const c: ColumnType<any>[] = [
        {
          title: "序号",
          align: "center",
          dataIndex: "order",
          render: (val, record, index) => {
            let color;
            if (record.orderType && record.orderType === 1) {
              color = "#FE4F54";
            }
            if (record.orderType && record.orderType === 0) {
              color = "#FF8948";
            }
            return <div style={{ color }}>{record.order}</div>;
          },
        },
        {
          title: "教师姓名",
          align: "center",
          dataIndex: "teacherName",
          render: (val, record, index) => {
            let color;
            if (record.teacherNameType && record.teacherNameType === 1) {
              color = "#FE4F54";
            }
            if (record.teacherNameType && record.teacherNameType === 0) {
              color = "#FF8948";
            }
            return <div style={{ color }}>{record.teacherName}</div>;
          },
        },
        {
          title: "手机号",
          align: "center",
          dataIndex: "phone",
          render: (val, record, index) => {
            let color;
            if (record.phoneType && record.phoneType === 1) {
              color = "#FE4F54";
            }
            if (record.phoneType && record.phoneType === 0) {
              color = "#FF8948";
            }
            return <div style={{ color }}>{record.phone}</div>;
          },
        },
      ];
      const a = {
        title: data?.importHeader.itemName,
        children: data?.importHeader.semesterOrder.map(
          (item1: any, index1: number) => {
            return {
              title: item1.name,
              children: item1.subItemNames.map((item2: any, index2: number) => {
                return {
                  title: item2,
                  align: "center",
                  render: (val: any, record: any, index3: number) => {
                    const beforeIndex = (i: number): any => {
                      if (i === -1) {
                        return 0;
                      } else {
                        return (
                          data?.importHeader.semesterOrder[i].subItemNames.length + beforeIndex(i - 1)
                        );
                      }
                    };
                    const finalIndex = beforeIndex(index1 - 1) + index2;
                    let color;
                    if (record.subItems[finalIndex].type && record.subItems[finalIndex].type === 1) {
                      color = "#FE4F54";
                    }
                    if (record.subItems[finalIndex].type && record.subItems[finalIndex].type === 0) {
                      color = "#FF8948";
                    }
                    return <div style={{ color }}>{record.subItems[finalIndex].excelScore}</div>;
                  },
                };
              }),
            };
          }
        ),
      };
      c.push(a as any);

      return c as any;
    }
    return [];
  };
  return (
    <Modal
      title={title}
      visible={visible}
      width={"80%"}
      onCancel={handleCancel}
      footer={
        <Row justify="center">
          <Space>
            <Button ghost type="primary" onClick={handleOk}>
              继续上传
            </Button>
            <Button type="primary" onClick={handleCancel}>
              确定
            </Button>
          </Space>
        </Row>
      }
      afterClose={handleCancel}
      confirmLoading={loading}
    >
      <div>
        <p style={{ fontSize: 13, color: "#616266" }}>
          已成功新增数据
          <b style={{ fontSize: 24, color: "#5781F2" }}>
            {" "}
            {data?.correctData}{" "}
          </b>
          条，以下为错误数据和重复数据，共
          <b style={{ fontSize: 24, color: "#FE4F54" }}> {data?.wrongData} </b>
          条
          {data?.exportDTO?.url && (
            <Button
              size="small"
              type="link"
              onClick={() => download(data.exportDTO)}
            >
              下载导入失败名单
            </Button>
          )}
        </p>
        <p>
          <Row>
            <Alert
              type="error"
              showIcon={false}
              message={
                <span style={{ color: "#FE4F54" }}>
                  标红的为错误数据，请仔细检查修改后重新导入！
                </span>
              }
              style={{ marginRight: 10, borderRadius: 3 }}
              banner
            />
            {!["student", "parent","assessment"].includes(props.type) && (
              <Alert
                showIcon={false}
                message={
                  <span style={{ color: "#FF8948" }}>
                    标黄的为系统中已存在数据，请仔细检查避免重复引入！
                  </span>
                }
                banner
                style={{ borderRadius: 3 }}
              />
            )}
          </Row>
        </p>
        <div>
          <Table
            style={appStyle.table}
            bordered={props.type === "assessment"}
            columns={getColumns()}
            rowKey="id"
            {...tableProps}
            size="small"
            scroll={{ scrollToFirstRowOnChange: true, x: true }}
          ></Table>
        </div>
      </div>
    </Modal>
  );
}
