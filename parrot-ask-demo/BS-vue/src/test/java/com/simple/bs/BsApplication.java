package com.simple.bs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class BsApplication {

  public static void main(String[] args) {
    SpringApplication.run(BsApplication.class, args);
  }
}

