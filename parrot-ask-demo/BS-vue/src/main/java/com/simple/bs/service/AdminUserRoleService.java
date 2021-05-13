package com.simple.bs.service;

import com.simple.bs.dao.AdminUserRoleDAO;
import com.simple.bs.pojo.AdminRole;
import com.simple.bs.pojo.AdminUserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Evan
 * @date 2019/11
 */
@Service
public class AdminUserRoleService {
  @Autowired
  AdminUserRoleDAO adminUserRoleDAO;

  public List<AdminUserRole> listAllByUid(int uid) {
    return adminUserRoleDAO.findAllByUid(uid);
  }

  //    @Modifying
  @Transactional
  public void saveRoleChanges(int uid, List<AdminRole> roles) {
    adminUserRoleDAO.deleteAllByUid(uid);
    List<AdminUserRole> urs = new ArrayList<>();
    roles.forEach(r -> {
      AdminUserRole ur = new AdminUserRole();
      ur.setUid(uid);
      ur.setRid(r.getId());
      urs.add(ur);
    });
    adminUserRoleDAO.saveAll(urs);
  }
}
