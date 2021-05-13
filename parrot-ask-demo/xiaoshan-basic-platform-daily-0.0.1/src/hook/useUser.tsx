import { useGlobalState } from 'src/store';

export default function useUser() {
  const [state] = useGlobalState();
  return {
    isSysAdmin: state.user?.roles.includes('ROLE_system_admin'),
  };
}
