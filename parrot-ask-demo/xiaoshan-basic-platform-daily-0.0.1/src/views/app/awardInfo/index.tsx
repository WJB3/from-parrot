import React from "react";
import { Switch, RouteComponentProps } from "react-router-dom";
import PrivateRoute from "src/components/PrivateRoute";
import StudentAwardListPage from "./student";
import AwardPointListPage from "./student/AwardPointList";
import AwardRecordListPage from "./student/AwardRecordList";
import AwardEditDetail from "./student/AwardEditDetail";
import TeacherAwardListPage from "./teacher";
import PublishNewTask from "./teacher/PublishNewTask";
import RecordListPage from "./teacher/RecordList";
import TeacherReportDetail from "./teacher/TeacherReportDetail";
import CollectionHighExamPhotoListPage from "./photoCollection";
import PreviewPage from "./photoCollection/PreviewPage";
import qs from "qs";
import WorkFlowPage from "./Workflow";
import PublishCollection from "./photoCollection/PublishCollection";
import CollectionRecord from "./photoCollection/CollectionRecord";

// 信息采集
export default function AwardInfoApp(props: RouteComponentProps) {
  return (
    <Switch>
      <PrivateRoute
        id={312}
        path={"/app/311/312"}
        exact
        component={StudentAwardListPage}
      ></PrivateRoute>
      <PrivateRoute
        id={313}
        path={"/app/311/313"}
        exact
        component={TeacherAwardListPage}
      ></PrivateRoute>
      <PrivateRoute
        id={468}
        path={"/app/311/468"}
        exact
        component={CollectionHighExamPhotoListPage}
      ></PrivateRoute>
      <PrivateRoute
        id={469}
        path={"/app/311/468/publishCollection"}
        exact
        render={(props) => (
          <PublishCollection
            id={qs.parse(props.location.search.substr(1)).id}
            isEdit={qs.parse(props.location.search.substr(1)).isEdit}
          ></PublishCollection>
        )}
      ></PrivateRoute>
      <PrivateRoute
        id={470}
        path="/app/311/468/collectionRecord/:id/:name/:enrollYear"
        exact
        component={CollectionRecord}
      ></PrivateRoute>
      <PrivateRoute
        id={129}
        path={"/app/311/312/workflow/:id"}
        exact
        component={WorkFlowPage}
      ></PrivateRoute>
      <PrivateRoute
        id={129}
        path={"/app/311/313/workflow/:id"}
        exact
        component={WorkFlowPage}
      ></PrivateRoute>
      <PrivateRoute
        id={312}
        path={"/app/311/312/publishnewtask"}
        exact
        render={(props) => (
          <PublishNewTask
            type={qs.parse(props.location.search.substr(1)).type}
            id={qs.parse(props.location.search.substr(1)).id}
            isEdit={qs.parse(props.location.search.substr(1)).isEdit}
          ></PublishNewTask>
        )}
      ></PrivateRoute>
      <PrivateRoute
        id={313}
        path={"/app/311/313/publishnewtask"}
        exact
        render={(props) => (
          <PublishNewTask
            type={qs.parse(props.location.search.substr(1)).type}
            id={qs.parse(props.location.search.substr(1)).id}
            isEdit={qs.parse(props.location.search.substr(1)).isEdit}
          ></PublishNewTask>
        )}
      ></PrivateRoute>
      {/* 教师汇总记录 */}
      <PrivateRoute
        id={313}
        path={"/app/311/313/teacherrecord/:id/:name"}
        exact
        component={RecordListPage}
      ></PrivateRoute>
      {/* 获奖得分列表 */}
      <PrivateRoute
        id={350}
        path="/app/311/312/awardPoint/:id/:name"
        exact
        component={AwardPointListPage}
      ></PrivateRoute>
      {/* 获奖汇总列表 */}
      <PrivateRoute
        id={368}
        path="/app/311/312/awardrecord/:id/:name"
        exact
        component={AwardRecordListPage}
      ></PrivateRoute>
      {/* 填报详情页面 */}
      <PrivateRoute
        id={369}
        path="/app/311/312/CheckDetail/:id"
        exact
        render={(props) => (
          <AwardEditDetail
            onRef={(ref) => console.log(ref)}
            recordId={props.match.params.id}
            onlyShow={
              qs.parse(props.location.search.substr(1)).onlyShow ? "1" : "0"
            }
          />
        )}
      ></PrivateRoute>

      <PrivateRoute
        id={401}
        path={"/app/311/313/teacherReport"}
        exact
        render={(props) => (
          <TeacherReportDetail
            {...props}
            recordId={qs.parse(props.location.search.substr(1)).recordId}
            taskId={qs.parse(props.location.search.substr(1)).taskId}
            //roleType 1:教师角色 2:审批人角色
            roleType={qs.parse(props.location.search.substr(1)).roleType}
          />
        )}
      ></PrivateRoute>
      <PrivateRoute
        id={476}
        path={"/app/311/468/previewAll"}
        exact
        render={(props) => (
          <PreviewPage
            {...props}
            taskId={qs.parse(props.location.search.substr(1)).taskId}
            name={qs.parse(props.location.search.substr(1)).name}
          />
        )}
      ></PrivateRoute>
    </Switch>
  );
}
