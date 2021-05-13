import $axios from '@/utils/axios'
import qs from 'qs'

export default { 
  reset(param){
    return $axios.put(`/auth/reset-pwd`,param)
  } 
}
