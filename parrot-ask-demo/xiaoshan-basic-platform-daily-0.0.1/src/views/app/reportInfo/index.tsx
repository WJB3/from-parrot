import React, { useEffect } from "react";
import { Switch, RouteComponentProps } from "react-router-dom";
import PrivateRoute from "src/components/PrivateRoute";
import ReportAwardListPage from "./ReportAwardList";
import TeacherReportCenter from "./teacherReport";
import qs from "qs";
import ReportTabPage from "./studentReport/index";
import ReportStudentDetail from "./studentReport/ReportStudentDetail";
import AwardAuditDetail from "src/views/app/awardInfo/student/AwardAuditDetail";

// 信息采集
export default function ReportInfoApp(props: RouteComponentProps) {

  return (
    <Switch>
      <PrivateRoute
        id={345}
        path={"/app/345"}
        exact
        component={ReportAwardListPage}
      ></PrivateRoute>
      <PrivateRoute
        id={402}
        path={"/app/345/editDetail/:id"}
        exact
        render={(props) => (
          <ReportStudentDetail
            taskName={qs.parse(props.location.search.substr(1)).taskName?.toString()}
            recordId={props.match.params.id}/>
        )}
      ></PrivateRoute>
      <PrivateRoute
        id={402}
        path={"/app/345/reportDetail/:id"}
        exact
        render={(props) => (
          <ReportTabPage
            taskId={props.match.params.id}
            taskName={qs.parse(props.location.search.substr(1)).taskName}
            tabId={qs.parse(props.location.search.substr(1)).pageTab}
          />
        )}
      ></PrivateRoute>
      <PrivateRoute
        id={403}
        path={"/app/345/teacherReport"}
        exact
        render={(props) => (
          <TeacherReportCenter
            {...props}
            recordId={qs.parse(props.location.search.substr(1)).recordId}
            taskId={qs.parse(props.location.search.substr(1)).taskId}
            //roleType 1:教师角色 2:审批人角色
            roleType={qs.parse(props.location.search.substr(1)).roleType}
            taskName={qs.parse(props.location.search.substr(1)).taskName}
          />
        )}
      ></PrivateRoute>
      <PrivateRoute
        id={404}
        path="/app/345/approvalDetail/:id"
        exact
        render={(props) => (
          <AwardAuditDetail
            onRef={(ref) => console.log(ref)}
            recordId={props.match.params.id}
            onlyShow={
              qs.parse(props.location.search.substr(1)).onlyShow ? "1" : "0"
            }
          />
        )}
      ></PrivateRoute>
    </Switch>
  );
}
