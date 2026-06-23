package com.example.demo.repository;

import com.example.demo.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassRepository extends JpaRepository<ClassEntity, Integer> {
    boolean existsByClassCode(String classCode);

    boolean existsByClassCodeAndClassIdNot(String classCode, Integer classId);

    boolean existsByTeacher_UserIdAndClassName(Integer teacherId, String className);

    boolean existsByTeacher_UserIdAndClassNameAndClassIdNot(Integer teacherId, String className, Integer classId);
}
