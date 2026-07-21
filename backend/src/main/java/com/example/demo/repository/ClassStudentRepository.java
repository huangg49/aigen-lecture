package com.example.demo.repository;

import com.example.demo.entity.ClassStudent;
import com.example.demo.entity.ClassStudentId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassStudentRepository extends JpaRepository<ClassStudent, ClassStudentId> {
    List<ClassStudent> findByClassEntity_ClassId(Integer classId);

    List<ClassStudent> findByStudent_UserId(Integer studentId);
}
