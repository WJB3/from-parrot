import { Badge, Layout, Radio, Row } from "antd";
import useUrlState from "@ahooksjs/use-url-state";
import React, { useMemo, useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import GT from "types";
import api from "src/api";
import useSocket from "src/hook/useSocket";
import PrivateComponent from "src/components/PrivateComponent";
import PageTab from "src/components/PageTab";
import PreviewAllExamPhoto from "./PreviewAllExamPhoto";
import { useGlobalState, ActionType } from "src/store";

const { Content } = Layout;

export default function PreviewPage(props: GT.Modal.Props & any) {
  const titleLists = [
    { id: 1, name: "学考照片" },
    { id: 2, name: "毕业证照片" },
  ];
  const [state, setState] = useUrlState({
    pageTab: props.tabId ? Number(props.tabId) : 1,
  });

  const [tag, setTag] = useState(1);

  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: "预览审核" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);

  useEffect(() => {
    console.log("tag变了");
  }, [tag]);

  const examPhotoDetailStyle = () => {
    if (Number(state.pageTab) === 1) {
      return { display: "block" };
    } else {
      return { display: "none" };
    }
  };

  const graducationStyle = () => {
    if (Number(state.pageTab) === 2) {
      return { display: "block" };
    } else {
      return { display: "none" };
    }
  };

  const content = () => {
    return (
      <div>
        <div>
          <PreviewAllExamPhoto
            taskId={props.taskId}
            pageTab={state.pageTab}
            name={props.name}
            refreshId={tag}
          ></PreviewAllExamPhoto>
        </div>
      </div>
    );
  };

  return (
    <Layout style={{ overflowX: "hidden", background: "#fff", height: "100%" }}>
      <p>
        <Radio.Group
          value={Number(state.pageTab)}
          className="page_tab"
          buttonStyle="solid"
          onChange={(e) => {
            setState({ pageTab: e.target.value });
            let index = tag + 1;
            setTag(index);
          }}
        >
          {titleLists.map((model) => (
            <Radio.Button value={model.id}>{model.name}</Radio.Button>
          ))}
        </Radio.Group>
      </p>
      <Content>{content()}</Content>
    </Layout>
  );
}
