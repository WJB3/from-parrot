import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import React from 'react';
import api from 'src/api';
import UserTeacherList from './component/UserTeacherList';
import UserTeacherStatistic from './component/UserTeacherStatistic';
export default function UserTeacherPage() {
  const { data: statistic, loading: statisticLoading, refresh } = useRequest(
    api.user.getTeacherStatistic,
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
      <UserTeacherList></UserTeacherList>
    </div>
  );
}
