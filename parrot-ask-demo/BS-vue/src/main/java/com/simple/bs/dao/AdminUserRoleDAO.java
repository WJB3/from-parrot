package com.simple.bs.dao;

import com.simple.bs.pojo.AdminUserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author Evan
 * @date 2019/11
 */
public interface AdminUserRoleDAO extends JpaRepository<AdminUserRole,Integer> {
  List<AdminUserRole> findAllByUid(int uid);
  void deleteAllByUid(int uid);
}
