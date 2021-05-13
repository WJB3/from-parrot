package com.simple.bs.dao;

import com.simple.bs.pojo.AdminRolePermission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author Evan
 * @date 2019/11
 */
public interface AdminRolePermissionDAO extends JpaRepository<AdminRolePermission, Integer> {
  List<AdminRolePermission> findAllByRid(int rid);
  List<AdminRolePermission> findAllByRid(List<Integer> rids);
  void deleteAllByRid(int rid);
}
