package com.simple.bs.dao;

import com.simple.bs.pojo.Book;
import com.simple.bs.pojo.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookDAO extends JpaRepository<Book,Integer> {
  List<Book> findAllByCategory(Category category);
  List<Book> findAllByTitleLikeOrAuthorLike(String keyword1, String keyword2);
}
