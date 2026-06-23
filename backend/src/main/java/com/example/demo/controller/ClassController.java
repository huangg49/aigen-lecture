package com.example.demo.controller;

import com.example.demo.dto.ClassCreateRequest;
import com.example.demo.dto.ClassResponse;
import com.example.demo.dto.ClassUpdateRequest;
import com.example.demo.service.ClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/classes")
@Tag(name = "Classes")
public class ClassController {
    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    @GetMapping
    @Operation(summary = "List classes")
    public List<ClassResponse> findAll() {
        return classService.findAll();
    }

    @GetMapping("/{classId}")
    @Operation(summary = "Get class by id")
    public ClassResponse findById(@PathVariable Integer classId) {
        return classService.findById(classId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create class")
    public ClassResponse create(@Valid @RequestBody ClassCreateRequest request) {
        return classService.create(request);
    }

    @PatchMapping("/{classId}")
    @Operation(summary = "Update class")
    public ClassResponse update(@PathVariable Integer classId, @Valid @RequestBody ClassUpdateRequest request) {
        return classService.update(classId, request);
    }

    @DeleteMapping("/{classId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Deactivate class")
    public void deactivate(@PathVariable Integer classId) {
        classService.deactivate(classId);
    }
}
