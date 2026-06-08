package com.example.demo.service;

import com.example.demo.dto.EnrollmentRequest;
import com.example.demo.dto.EnrollmentResponse;
import com.example.demo.dto.EnrollmentStatusRequest;
import com.example.demo.entity.ClassEntity;
import com.example.demo.entity.ClassStudent;
import com.example.demo.entity.ClassStudentId;
import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;
import com.example.demo.entity.UserStatus;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ClassRepository;
import com.example.demo.repository.ClassStudentRepository;
import com.example.demo.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EnrollmentService {
    private final ClassStudentRepository classStudentRepository;
    private final ClassRepository classRepository;
    private final UserRepository userRepository;

    public EnrollmentService(
            ClassStudentRepository classStudentRepository,
            ClassRepository classRepository,
            UserRepository userRepository
    ) {
        this.classStudentRepository = classStudentRepository;
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> findAll() {
        return classStudentRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> findByClass(Integer classId) {
        if (!classRepository.existsById(classId)) {
            throw new ResourceNotFoundException("Class not found: " + classId);
        }
        return classStudentRepository.findByClassEntity_ClassId(classId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> findByStudent(Integer studentId) {
        if (!userRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found: " + studentId);
        }
        return classStudentRepository.findByStudent_UserId(studentId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public EnrollmentResponse enroll(Integer classId, EnrollmentRequest request) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + classId));
        User student = getStudent(request.studentId());
        ClassStudentId enrollmentId = new ClassStudentId(classId, student.getUserId());

        ClassStudent enrollment = classStudentRepository.findById(enrollmentId).orElse(null);
        if (enrollment != null) {
            if (enrollment.getStatus() == UserStatus.ACTIVE) {
                throw new BadRequestException("Student is already active in this class");
            }
            enrollment.setStatus(UserStatus.ACTIVE);
            enrollment.setEnrolledAt(LocalDateTime.now());
            return toResponse(enrollment);
        }

        ClassStudent newEnrollment = new ClassStudent();
        newEnrollment.setId(enrollmentId);
        newEnrollment.setClassEntity(classEntity);
        newEnrollment.setStudent(student);
        newEnrollment.setStatus(UserStatus.ACTIVE);
        newEnrollment.setEnrolledAt(LocalDateTime.now());

        return toResponse(classStudentRepository.save(newEnrollment));
    }

    @Transactional
    public EnrollmentResponse updateStatus(Integer classId, Integer studentId, EnrollmentStatusRequest request) {
        ClassStudent enrollment = getEnrollment(classId, studentId);
        enrollment.setStatus(request.status());
        return toResponse(enrollment);
    }

    @Transactional
    public void deactivate(Integer classId, Integer studentId) {
        ClassStudent enrollment = getEnrollment(classId, studentId);
        enrollment.setStatus(UserStatus.INACTIVE);
    }

    private User getStudent(Integer studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        if (student.getRole() != UserRole.STUDENT) {
            throw new BadRequestException("User is not a student: " + studentId);
        }
        return student;
    }

    private ClassStudent getEnrollment(Integer classId, Integer studentId) {
        return classStudentRepository.findById(new ClassStudentId(classId, studentId))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Enrollment not found for class " + classId + " and student " + studentId
                ));
    }

    private EnrollmentResponse toResponse(ClassStudent enrollment) {
        return new EnrollmentResponse(
                enrollment.getClassEntity().getClassId(),
                enrollment.getStudent().getUserId(),
                enrollment.getStudent().getName(),
                enrollment.getEnrolledAt(),
                enrollment.getStatus()
        );
    }
}
