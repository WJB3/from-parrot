package com.simple.bs.dao;

import com.simple.bs.pojo.AdminRole;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Evan
 * @date 2019/11
 */
public interface AdminRoleDAO extends JpaRepository<AdminRole, Integer> {
  AdminRole findById(int id);
}
