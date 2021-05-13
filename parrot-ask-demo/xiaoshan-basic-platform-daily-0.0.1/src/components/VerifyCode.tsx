import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import api from 'src/api';

export default function VerifyCode(props: { onRefresh?: () => void }) {
  const [code, setCode] = useState<any>();
  const { data, loading, refresh } = useRequest(
    () => api.base.getVerifyImage({}, { responseType: 'blob' }),
    {
      onSuccess() {
        props.onRefresh?.();
      },
    },
  );

  function blobToDataURL(blob: Blob) {
    let a = new FileReader();
    a.onload = function (e) {
      setCode(e.target?.result);
    };
    a.readAsDataURL(blob);
  }
  data && blobToDataURL(data);
  return (
    <div>
      <img style={{ cursor: 'pointer' }} src={code} alt='' onClick={refresh} />
    </div>
  );
}
