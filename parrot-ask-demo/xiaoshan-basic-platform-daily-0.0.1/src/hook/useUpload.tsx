import { token } from 'src/utils';
export default function useUpload() {
  return {
    getHeaders: () => ({
      Authorization: token.get() || '',
    }),
    // beforeUpload:(reg)=>
  };
}
