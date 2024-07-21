package com.example.todoapp.controller;

import com.example.todoapp.model.Todo;
import com.example.todoapp.service.TodoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    // コンストラクタでTodoServiceを注入
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    // 全てのTodoを取得する
    @GetMapping
    public List<Todo> listTodos() {
        return todoService.findAll();
    }

    // 新しいTodoを追加する
    @PostMapping
    public Todo addTodo(@RequestBody Todo todo) {
        return todoService.save(todo);
    }

    // Todoを更新する
    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        todo.setId(id);
        return todoService.save(todo);
    }

    // 指定されたIDのTodoを削除する
    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteById(id);
    }
}
