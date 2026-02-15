package com.cetword;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CetWordApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(CetWordApiApplication.class, args);
    }
}