package com.simple.bs.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.simple.bs.pojo.Category;

public interface CategoryDAO extends JpaRepository<Category, Integer> {

}
