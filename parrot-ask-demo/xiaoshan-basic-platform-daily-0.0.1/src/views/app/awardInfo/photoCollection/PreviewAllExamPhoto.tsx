import React, { useState, useEffect, useRef } from "react";
import { Button, Row, Col, Space, Image, Pagination, message } from "antd";
import GT from "types";
import api from "src/api";
import IconFont from "src/components/IconFont";
import VerifyPhotoModal from "./component/VerifyPhotoModal";
import { type } from "os";
import { debug } from "console";

// 下载学考照片
export default function PreviewAllExamPhoto(props: {
  taskId: number;
  pageTab: number;
  refreshId: number;
  name: string;
}) {
  const defaultPage = 1;
  const defaultPageSize = Number(props.pageTab) === 1 ? 54 : 50;
  // 分页的size
  const [preSize, setPresize] = useState(Number(props.pageTab) === 1 ? 54 : 50);
  // 页码
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  // 是否有选中的照片
  const [hasSelectedPhoto, setHasSelectedPhoto] = useState(false);
  // 1是学考照 2是毕业照
  const refusedModal = useRef<GT.Modal.Ref>();

  const [dataLists, setDataLists] = useState([] as any[]);

  const refreshData = () => {
    // 主动刷新页面数据
    if (current == 1 && preSize == (Number(props.pageTab) === 1 ? 54 : 50)) {
      // 当前依赖没有变化 主动刷新
      api.collection
        .getPreviewPhotoPage({
          current: current,
          size: preSize,
          taskId: props.taskId,
          type: props.pageTab,
        })
        .then((result) => {
          // 获取到数据
          // console.log(result);
          setTotal(result.total);
          setDataLists([...result.list]);
        });
    } else {
      // 设置成默认的第一页
      setCurrent(1);
      setPresize(Number(props.pageTab) === 1 ? 54 : 50);
    }
  };

  useEffect(() => {
    // 当dataLists发生了变化
    let isAll = dataLists.length == 0 ? false : true;
    let hasSelected = false;
    dataLists.forEach((element) => {
      if (!element.isSelected) {
        // 没有选中
        isAll = false;
      }
      if (element.isSelected) {
        hasSelected = true;
      }
    });
    setIsSelectedAll(isAll);
    setHasSelectedPhoto(hasSelected);
  }, [dataLists]);

  useEffect(() => {
    // 获取数据
    console.log("更新页面数据", props);
    api.collection
      .getPreviewPhotoPage({
        current: current,
        size: preSize,
        taskId: props.taskId,
        type: props.pageTab,
      })
      .then((result) => {
        // 获取到数据
        console.log(result);
        setTotal(result.total);
        setDataLists([...result.list]);
      });
  }, [current, preSize]);

  useEffect(() => {
    console.log("刷新页码");
    refreshData();
  }, [props.refreshId]);

  const handleResult = () => {
    // 完成批量拒绝的任务回调

    refreshData();
  };

  const passPhotosApproval = () => {
    // 批量通过审核
    if (!hasSelectedPhoto) {
      // 没有选中的数据
      message.info(`请选择至少一项数据`);
      return;
    }

    let selectedPhotoIds = [];
    selectedPhotoIds = dataLists.reduce((arr, cur) => {
      if (cur.isSelected) {
        arr.push(cur.id);
      }
      return arr;
    }, [] as any[]);

    // 有选中的数据
    api.collection
      .approvalPhotos({
        recordIds: selectedPhotoIds,
        approval: true,
        type: Number(props.pageTab),
      })
      .then(() => {
        // 刷新页面  重置
        message.success("批量通过成功");
        refreshData();
      });
  };

  // hook或者函数去创建for循环
  const renderImageView = () => {
    // 是否有选中的数据\
    if (dataLists) {
      let imageNodes = [];
      for (const index in dataLists) {
        imageNodes.push(
          <div
            style={{
              width: Number(props.pageTab) === 1 ? "150px" : "300px",
              height: Number(props.pageTab) === 1 ? "210px" : "420px",
              background: "#E4E7F099",
              position: "relative",
              display: "block",
              marginBottom: "32px",
              marginRight: "32px",
            }}
          >
            {dataLists[index].isSelected ? (
              <IconFont
                type="iconxuanzhong"
                style={{
                  fontSize: Number(props.pageTab) === 1 ? "210px" : "420px",
                  position: "absolute",
                  top: "0px",
                  right: Number(props.pageTab) === 1 ? "-30px" : "-60px",
                  zIndex: 3,
                  pointerEvents: "none",
                }}
              ></IconFont>
            ) : null}
            <Button
              style={{
                display: "contents",
              }}
              icon={
                <Image
                  width="100%"
                  height="100%"
                  className="preview_Image_collection"
                  src={dataLists[index].photoUrl}
                  preview={false}
                  onClick={() => {}}
                />
              }
              onClick={() => {
                //重新赋值数组
                dataLists[index].isSelected = !dataLists[index].isSelected;
                // debugger;
                setDataLists([...dataLists]);
              }}
            />
          </div>
        );
      }
      return imageNodes;
    }
  };

  return (
    <div>
      <div>
        <div style={{ fontSize: 18, fontWeight: "bold" }}>
          {props.name}-预览审核
        </div>
        <Space style={{ marginBottom: "30px", marginTop: "20px" }}>
          <Button
            type="primary"
            size="middle"
            ghost
            onClick={() => {
              // 全选和反选逻辑
              dataLists.forEach((element) => {
                element.isSelected = !isSelectedAll;
              });
              setDataLists([...dataLists]);
            }}
          >
            {isSelectedAll ? "取消全选" : "全选"}
          </Button>
          <Button
            type="primary"
            size="middle"
            onClick={() => passPhotosApproval()}
          >
            批量通过
          </Button>
          <Button
            type="primary"
            size="middle"
            danger
            onClick={() => {
              if (!hasSelectedPhoto) {
                message.info(`请选择至少一项数据`);
                return;
              }
              refusedModal.current?.setVisible(true);
              refusedModal.current?.setType(props.pageTab);
              refusedModal.current?.fillRecordIds(
                // 传入选中的
                dataLists
                  .filter((element) => element.isSelected)
                  .map((item) => item.id)
              );
            }}
          >
            批量拒绝
          </Button>
        </Space>
      </div>

      {dataLists.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "150px" }}>
          <IconFont type="iconquesheng" style={{ fontSize: 250 }}></IconFont>
          <div style={{ textAlign: "center" }}>暂无数据</div>
        </div>
      ) : (
        <div style={{ position: "absolute" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              alignContent: "space-around",
              width: "1668px",
              overflow: "auto",
            }}
          >
            {renderImageView()}
          </div>
          <div style={{ width: "1610px", minHeight: "60px", textAlign: "end" }}>
            <Pagination
              defaultCurrent={defaultPage}
              current={current}
              defaultPageSize={defaultPageSize}
              total={total}
              onChange={(page, pageSize) => {
                // 页码变化
                // console.log(page, pageSize);
                setCurrent(page);
              }}
              showSizeChanger={false}
              onShowSizeChange={(current, size) => {
                // 修改了pageSize
                // console.log(current, size);
                setCurrent(current);
                setPresize(size);
                //
              }}
            />
          </div>
        </div>
      )}
      <VerifyPhotoModal
        onRef={(ref) => (refusedModal.current = ref)}
        onOk={handleResult}
      />
    </div>
  );
}
