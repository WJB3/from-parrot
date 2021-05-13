package com.simple.bs.dao;

import com.simple.bs.pojo.JotterArticle;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author simple
 * @date 2021.4
 */
public interface JotterArticleDAO  extends JpaRepository<JotterArticle,Integer> {
  JotterArticle findById(int id);
}
