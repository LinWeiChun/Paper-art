package com.paperart.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {
    	System.out.println(System.getProperty("java.version"));
        return "Hello Backend";
    }
}