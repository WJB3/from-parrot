package com.simple.bs.controller;

import com.simple.bs.result.Result;
import com.simple.bs.result.ResultFactory;
import com.simple.bs.service.AdminMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Menu controller.
 *
 * @author simple
 * @date 2020.4
 */
@RestController
public class MenuController {
  @Autowired
  AdminMenuService adminMenuService;

  @GetMapping("/api/menu")
  public Result menu() {
    return ResultFactory.buildSuccessResult(adminMenuService.getMenusByCurrentUser());
  }

  @GetMapping("/api/admin/role/menu")
  public Result listAllMenus() {
    return ResultFactory.buildSuccessResult(adminMenuService.getMenusByRoleId(1));
  }
}
