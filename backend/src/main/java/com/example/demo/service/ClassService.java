package com.example.demo.service;

import com.example.demo.dto.ClassCreateRequest;
import com.example.demo.dto.ClassResponse;
import com.example.demo.dto.ClassUpdateRequest;
import com.example.demo.entity.ClassEntity;
import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;
import com.example.demo.entity.UserStatus;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ClassRepository;
import com.example.demo.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class ClassService {
    private final ClassRepository classRepository;
    private final UserRepository userRepository;

    public ClassService(ClassRepository classRepository, UserRepository userRepository) {
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ClassResponse> findAll() {
        return classRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ClassResponse findById(Integer classId) {
        return toResponse(getClass(classId));
    }

    @Transactional
    public ClassResponse create(ClassCreateRequest request) {
        User teacher = getTeacher(request.teacherId());
        String className = requireText(request.className(), "className");
        String classCode = requireText(request.classCode(), "classCode");

        if (classRepository.existsByClassCode(classCode)) {
            throw new BadRequestException("Class code already exists");
        }
        if (classRepository.existsByTeacher_UserIdAndClassName(teacher.getUserId(), className)) {
            throw new BadRequestException("Teacher already has a class with this name");
        }

        ClassEntity classEntity = new ClassEntity();
        classEntity.setTeacher(teacher);
        classEntity.setClassName(className);
        classEntity.setClassCode(classCode);
        classEntity.setDescription(trimNullable(request.description()));
        classEntity.setStatus(UserStatus.ACTIVE);

        return toResponse(classRepository.save(classEntity));
    }

    @Transactional
    public ClassResponse update(Integer classId, ClassUpdateRequest request) {
        ClassEntity classEntity = getClass(classId);
        User teacher = request.teacherId() == null ? classEntity.getTeacher() : getTeacher(request.teacherId());
        String className = request.className() == null
                ? classEntity.getClassName()
                : requireText(request.className(), "className");
        String classCode = request.classCode() == null
                ? classEntity.getClassCode()
                : requireText(request.classCode(), "classCode");

        if (!classCode.equals(classEntity.getClassCode())
                && classRepository.existsByClassCodeAndClassIdNot(classCode, classId)) {
            throw new BadRequestException("Class code already exists");
        }
        if ((!teacher.getUserId().equals(classEntity.getTeacher().getUserId())
                || !className.equals(classEntity.getClassName()))
                && classRepository.existsByTeacher_UserIdAndClassNameAndClassIdNot(
                teacher.getUserId(),
                className,
                classId
        )) {
            throw new BadRequestException("Teacher already has a class with this name");
        }

        classEntity.setTeacher(teacher);
        classEntity.setClassName(className);
        classEntity.setClassCode(classCode);
        if (request.description() != null) {
            classEntity.setDescription(trimNullable(request.description()));
        }
        if (request.status() != null) {
            classEntity.setStatus(request.status());
        }

        return toResponse(classEntity);
    }

    @Transactional
    public void deactivate(Integer classId) {
        ClassEntity classEntity = getClass(classId);
        classEntity.setStatus(UserStatus.INACTIVE);
    }

    ClassEntity getClass(Integer classId) {
        return classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + classId));
    }

    private User getTeacher(Integer teacherId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + teacherId));
        if (teacher.getRole() != UserRole.TEACHER) {
            throw new BadRequestException("User is not a teacher: " + teacherId);
        }
        return teacher;
    }

    private ClassResponse toResponse(ClassEntity classEntity) {
        User teacher = classEntity.getTeacher();
        return new ClassResponse(
                classEntity.getClassId(),
                teacher.getUserId(),
                teacher.getName(),
                classEntity.getClassName(),
                classEntity.getClassCode(),
                classEntity.getDescription(),
                classEntity.getStatus(),
                classEntity.getCreatedAt()
        );
    }

    private String requireText(String value, String fieldName) {
        if (!StringUtils.hasText(value)) {
            throw new BadRequestException(fieldName + " must not be blank");
        }
        return value.trim();
    }

    private String trimNullable(String value) {
        return value == null ? null : value.trim();
    }
}
