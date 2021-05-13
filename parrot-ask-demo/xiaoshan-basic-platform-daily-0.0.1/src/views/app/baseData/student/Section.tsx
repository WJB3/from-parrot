import React from 'react';
import PrivateComponent from 'src/components/PrivateComponent';
import SectionSidebar from 'src/components/SectionSidebar';
import ClassLeader from './component/ClassLeader';
import ClassList from './component/ClassList';
import ClassStudentList from './component/ClassStudentList';
import GradeLeader from './component/GradeLeader';
import PreClassList from './component/PreClassList';
import PreClassStudentList from './component/PreClassStudentList';
import SectionDetail from './component/SectionDetail';
import SectionList from './component/SectionList';
export default function SectionPage() {
  return (
    <SectionSidebar>
      {({ tree, refresh, node, selectNode }) => (
        <div>
          {/* 首页 */}

          {!node && (
            <PrivateComponent id={100}>
              <SectionList onRefresh={refresh}></SectionList>
            </PrivateComponent>
          )}
          {/* 年段详情页 */}
          {node?.sectionId && node.sectionType !== 3 && (
            <PrivateComponent id={101}>
              <p>
                <SectionDetail node={node}></SectionDetail>
              </p>
            </PrivateComponent>
          )}
          {node?.sectionId && node.sectionType !== 3 && (
            <PrivateComponent id={101}>
              <ClassList
                onRefresh={refresh}
                sectionId={node.sectionId}
                sections={[node]}
                grades={node.nodes}></ClassList>
            </PrivateComponent>
          )}
          {/* 预备学生年段详情 */}
          {node?.sectionType === 3 && (
            <PrivateComponent id={253}>
              <p>
                <GradeLeader
                  sectionId={node.sectionId}
                  enrollmentYear={node.enrollmentYear}></GradeLeader>
              </p>
            </PrivateComponent>
          )}
          {node?.sectionType === 3 && (
            <PrivateComponent id={253}>
              <PreClassList
                onCheck={selectNode}
                onRefresh={refresh}
                enrollmentYear={node.enrollmentYear}
                sectionId={node.sectionId}
                node={node}></PreClassList>
            </PrivateComponent>
          )}
          {/* 年级详情页 */}
          {node?.enrollmentYear && !node?.sectionId && (
            <PrivateComponent id={102}>
              <p>
                <GradeLeader
                  sectionId={node.parent?.sectionId}
                  enrollmentYear={node.enrollmentYear}></GradeLeader>
              </p>
            </PrivateComponent>
          )}
          {node?.enrollmentYear && !node?.sectionId && (
            <PrivateComponent id={102}>
              <ClassList
                onCheck={selectNode}
                onRefresh={refresh}
                enrollmentYear={node.enrollmentYear}
                sections={[node.parent]}
                grades={[node]}
                sectionId={node.parent?.sectionId}></ClassList>
            </PrivateComponent>
          )}
          {/* 预备生班级详情 */}
          {node?.classId && node?.parent?.sectionType === 3 && (
            <PrivateComponent id={254}>
              <p>
                <ClassLeader
                  classId={node.classId}
                  enrollmentYear={node.parent.enrollmentYear}
                  sectionId={node.parent.sectionId}></ClassLeader>
              </p>
            </PrivateComponent>
          )}
          {node?.classId && node?.parent?.sectionType === 3 && (
            <PrivateComponent id={254}>
              <PreClassStudentList
                classId={node.classId}
                enrollmentYear={node.parent.enrollmentYear}
                sectionId={node.parent.sectionId}></PreClassStudentList>
            </PrivateComponent>
          )}
          {/* 班级详情页 */}
          {node?.classId && node?.parent?.sectionType !== 3 && (
            <PrivateComponent id={103}>
              <p>
                <ClassLeader
                  classId={node.classId}
                  enrollmentYear={node.parent.enrollmentYear}
                  sectionId={node.parent.parent.sectionId}></ClassLeader>
              </p>
            </PrivateComponent>
          )}
          {node?.classId && node?.parent?.sectionType !== 3 && (
            <PrivateComponent id={103}>
              <ClassStudentList
                classId={node.classId}
                enrollmentYear={node.parent.enrollmentYear}
                sectionId={node.parent.parent.sectionId}></ClassStudentList>
            </PrivateComponent>
          )}
        </div>
      )}
    </SectionSidebar>
  );
}
