import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import React from 'react';
import api from 'src/api';
import UserServiceList from './component/UserServiceList';
import UserTeacherStatistic from './component/UserTeacherStatistic';
export default function UserServicePage() {
  const { data: statistic, loading: statisticLoading, refresh } = useRequest(
    api.user.getOtherStatistic,
  );

  return (
    <div>
      <p>
        <Spin spinning={statisticLoading}>
          <UserTeacherStatistic
            totalCount={statistic?.totalCount || 0}
            activeCount={statistic?.activeCount || 0}
            todayLoginCount={statistic?.todayLoginCount || 0}></UserTeacherStatistic>
        </Spin>
      </p>
      <UserServiceList onRef={()=>{}} onOk={refresh}></UserServiceList>
    </div>
  );
}
