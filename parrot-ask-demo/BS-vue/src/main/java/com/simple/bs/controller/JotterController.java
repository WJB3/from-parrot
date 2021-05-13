package com.simple.bs.controller;

import com.simple.bs.pojo.JotterArticle;
import com.simple.bs.result.Result;
import com.simple.bs.result.ResultFactory;
import com.simple.bs.service.JotterArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * Jotter controller.
 *
 * @author simple
 * @date 2021.4
 */
@RestController
public class JotterController {
  @Autowired
  JotterArticleService jotterArticleService;

  @PostMapping("api/admin/content/article")
  public Result saveArticle(@RequestBody @Valid JotterArticle article) {
    jotterArticleService.addOrUpdate(article);
    return ResultFactory.buildSuccessResult("保存成功");
  }

  @GetMapping("/api/article/{size}/{page}")
  public Result listArticles(@PathVariable("size") int size, @PathVariable("page") int page) {
    return ResultFactory.buildSuccessResult(jotterArticleService.list(page - 1, size));
  }

  @GetMapping("/api/article/{id}")
  public Result getOneArticle(@PathVariable("id") int id) {
    return ResultFactory.buildSuccessResult(jotterArticleService.findById(id));
  }

  @DeleteMapping("/api/admin/content/article/{id}")
  public Result deleteArticle(@PathVariable("id") int id) {
    jotterArticleService.delete(id);
    return ResultFactory.buildSuccessResult("删除成功");
  }
}
