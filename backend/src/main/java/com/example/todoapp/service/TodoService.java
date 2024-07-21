package com.example.todoapp.service;

import com.example.todoapp.model.Todo;

import java.util.List;

public interface TodoService {

    List<Todo> findAll();
    Todo save(Todo todo);
    void deleteById(Long id);
}
