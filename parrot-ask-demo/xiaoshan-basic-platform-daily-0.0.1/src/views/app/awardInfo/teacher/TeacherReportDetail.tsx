import React, { useEffect } from "react";
import GT from "types";
import TeacherReportCenter from "../../reportInfo/teacherReport";

/**
 *
 * @param props roleType参数 1为填报人 2为审批人
 */
export default function TeacherReportAll(props: GT.Modal.Props & any) {

  return (
    <TeacherReportCenter
      {...props}
      recordId={props.recordId}
      taskId={props.taskId}
      //roleType 1:教师角色 2:审批人角色
      roleType={props.roleType}
    />
  );
}
