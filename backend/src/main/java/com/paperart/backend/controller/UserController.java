package com.paperart.backend.controller;

import com.paperart.backend.dto.request.UserRequest;
import com.paperart.backend.dto.response.UserResponse;
import com.paperart.backend.service.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  /** 取得全部管理者 */
  @GetMapping
  public List<UserResponse> getAllUsers() {

    return userService.getAllUsers();
  }

  /** 取得單一管理者 */
  @GetMapping("/{id}")
  public UserResponse getUserById(@PathVariable String id) {

    return userService.getUserById(id);
  }

  /** 新增管理者 */
  @PostMapping
  public UserResponse createUser(@RequestBody UserRequest request) {

    return userService.createUser(request);
  }

  /** 修改管理者 */
  @PutMapping("/{id}")
  public UserResponse updateUser(@PathVariable String id, @RequestBody UserRequest request) {

    return userService.updateUser(id, request);
  }

  /** 啟用管理者 */
  @PatchMapping("/{id}/enable")
  public void enableUser(@PathVariable String id) {

    userService.enableUser(id);
  }

  /** 停用管理者 */
  @PatchMapping("/{id}/disable")
  public void disableUser(@PathVariable String id) {

    userService.disableUser(id);
  }

  /** 刪除管理者 */
  @DeleteMapping("/{id}")
  public void deleteUser(@PathVariable String id) {

    userService.deleteUser(id);
  }
}
