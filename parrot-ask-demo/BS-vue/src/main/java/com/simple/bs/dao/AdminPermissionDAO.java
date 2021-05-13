package com.simple.bs.dao;

import com.simple.bs.pojo.AdminPermission;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author simple
 * @date 2021.4
 */
public interface AdminPermissionDAO extends JpaRepository<AdminPermission, Integer> {
  AdminPermission findById(int id);
}
