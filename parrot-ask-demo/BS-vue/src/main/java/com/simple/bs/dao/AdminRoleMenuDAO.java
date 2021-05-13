package com.simple.bs.dao;

import com.simple.bs.pojo.AdminRoleMenu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author simple
 * @date 2021.4
 */
public interface AdminRoleMenuDAO extends JpaRepository<AdminRoleMenu,Integer> {
  List<AdminRoleMenu> findAllByRid(int rid);
  List<AdminRoleMenu> findAllByRid(List<Integer> rids);
  void deleteAllByRid(int rid);
}
