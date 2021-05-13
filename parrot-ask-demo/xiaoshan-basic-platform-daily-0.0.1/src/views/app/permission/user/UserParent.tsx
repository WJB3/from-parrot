import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import React from 'react';
import api from 'src/api';
import UserParentList from './component/UserParentList';
import UserParentStatistic from './component/UserParentStatistic';
export default function UserParentPage() {
  const { data: statistic, loading: statisticLoading, refresh } = useRequest(
    api.user.getParentStatistic,
  );
  return (
    <div>
      <p>
        <Spin spinning={statisticLoading}>
          <UserParentStatistic
            parentCount={statistic?.parentCount || 0}
            activeCount={statistic?.activeCount || 0}
            todayLoginCount={statistic?.todayLoginCount || 0}
            studentCount={statistic?.studentCount || 0}></UserParentStatistic>
        </Spin>
      </p>
      <UserParentList></UserParentList>
    </div>
  );
}
