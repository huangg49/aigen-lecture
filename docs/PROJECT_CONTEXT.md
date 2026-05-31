# PROJECT CONTEXT: Interactive AI-Generated Lecture System

> **Dự án:** CP-2026-02 | **Nhóm:** G-06 | **GVHD:** Lâm Hữu Khánh Phương
> **Sinh viên:** Nguyễn Huy Hoàng, Phùng Tuấn Minh, Nguyễn Hoàng Đại, Trương Trần Gia Bảo, Huỳnh Gia Huy

---

## 1. Tổng quan hệ thống

**Vấn đề đang giải quyết:**
- Giáo viên mất nhiều thời gian soạn bài giảng tương tác thủ công
- Học sinh nhàm chán với bài giảng tĩnh, thiếu phản hồi tức thời
- Khó theo dõi và phân tích mức độ hiểu bài để cải tiến nội dung

**Giải pháp đề xuất:**
1. Giáo viên upload tài liệu (PDF/DOCX) → hệ thống trích xuất text
2. Gọi LLM API (OpenAI / Gemini) → sinh ra bài giảng + câu hỏi trắc nghiệm có cấu trúc
3. Học sinh tương tác với bài giảng → hệ thống ghi log
4. AI phân tích log → đề xuất cải tiến nội dung cho giáo viên

**Các bên liên quan:** Teachers, Students, School Admin, EdTech Developers

---

## 2. Giả định & Ràng buộc

### Assumptions (Giả định)

| ID | Nội dung | Ảnh hưởng |
|----|----------|-----------|
| A-01 | Tài liệu PDF/DOCX upload là văn bản chuẩn, không phải ảnh scan chất lượng thấp | Tiên quyết để parse chính xác trước khi đưa vào AI |
| A-02 | LLM API (OpenAI/Gemini) hoạt động ổn định, độ trễ chấp nhận được | Cần error handling + timeout ở tầng service |
| A-03 | Người dùng có kết nối internet ổn định | Cần cho RESTful API real-time và sync log tức thì |

### Constraints (Ràng buộc)

| ID | Nội dung | Ảnh hưởng |
|----|----------|-----------|
| C-01 | Thời gian phát triển giới hạn **7 tuần** | Scope chỉ gồm: AI lecture generation, interaction, basic reporting (v1.0) |
| C-02 | Phân quyền nghiêm ngặt: Admin / Teacher / Student hoàn toàn tách biệt | Bắt buộc RBAC, chặn API trái phép |
| C-03 | Tính toàn vẹn dữ liệu interaction log tuyệt đối (không mất log) | Phải dùng database transaction (`@Transactional` Spring Boot) |
| C-04 | Ngân sách hạn chế, không có phần mềm enterprise trả phí | Stack: Java, Spring Boot, MySQL/PostgreSQL (open-source) |

---

## 3. Business Rules

| Rule ID | Tên quy tắc | Mô tả | Hành vi hệ thống |
|---------|-------------|-------|-----------------|
| BR-01 | File Upload Constraint | File upload phải là .pdf hoặc .docx, ≤ 20MB | Reject + HTTP 400 nếu sai format hoặc vượt kích thước; nội dung dài sẽ được xử lý tự động bởi BR-10 (không hard-reject) |
| BR-02 | AI Output Limitation | Mỗi lần generate: tối thiểu 5, tối đa 20 câu hỏi | Nếu tài liệu quá ngắn < 5 câu hỏi → prompt giáo viên thêm nội dung |
| BR-03 | Content Ownership | Teacher chỉ được xem/sửa/xóa lecture của **chính mình** | Truy cập lecture của người khác → HTTP 403 |
| BR-04 | Interaction Data Integrity | Điểm và log lưu trong cùng 1 transaction | Nếu lưu log thất bại giữa chừng → rollback toàn bộ |
| BR-05 | AI Service Timeout | LLM API call timeout tối đa **15 giây** | Quá 15s → trả về thông báo "AI server is busy, please try again." |
| BR-06 | Student Exam Retry | Học sinh được làm lại nhiều lần, **Analytics chỉ tính lần đầu** | Lần sau lưu với flag `isFirstAttempt = false`, loại khỏi Analytics |
| BR-07 | Password Complexity | Mật khẩu ≥ 8 ký tự, gồm cả chữ và số | UI + API reject nếu không đạt |
| BR-08 | Prevent Data Deletion | **Cấm** hard-delete tài khoản/lecture đã có interaction log | Chỉ soft-delete (đổi status → INACTIVE) |
| BR-09 | Analytics Access Control | Chỉ Teacher sở hữu lecture mới xem được Analytics của lecture đó | Unauthorized → HTTP 403 |
| BR-10 | AI Context Window Limit | Nếu văn bản trích xuất > **4,000 tokens** thì **tự động** áp dụng Text Chunking trước khi đẩy vào LLM — tối đa **10 chunks**, merge kết quả theo thứ tự chunk | Đảm bảo không văn lỗi `context_length_exceeded`; nếu vượt 10 chunks thì hiển thị cảnh báo "Tài liệu quá dài, chỉ phân tích 10 phần đầu" thay vì hard-reject |

---

## 4. User Stories

| Story ID | Actor | Muốn làm gì | Mục đích | Priority | Req. liên quan |
|----------|-------|-------------|----------|----------|----------------|
| US-01 | Teacher | Upload tài liệu thô (PDF, DOCX) | Dùng làm context cho AI | High | FR-01 |
| US-02 | Teacher | Yêu cầu AI tạo bài giảng + câu hỏi | Không phải soạn thủ công | High | FR-02 |
| US-03 | Teacher | Chỉnh sửa nội dung AI sinh ra | Kiểm soát chất lượng và độ chính xác | High | FR-03 |
| US-04 | Student | Xem bài giảng + trả lời câu hỏi tương tác | Học hiệu quả hơn | High | FR-05 |
| US-05 | System | Lưu toàn bộ lịch sử trả lời và thời gian tương tác | Có dữ liệu để phân tích | High | FR-06 |
| US-06 | Teacher | Xem Analytics: completion rate, điểm TB, error rate theo câu | Biết câu nào đang làm khó học sinh | Medium | FR-07 |
| US-07 | Teacher | Nhận gợi ý cải tiến từ AI dựa trên dữ liệu học tập | Cập nhật bài giảng cho khoá sau | Medium | FR-04 |
| US-08 | Teacher/Student | Đăng nhập bằng email + mật khẩu | Truy cập đúng tính năng theo vai trò | High | FR-05 |
| US-09 | Admin | Xem danh sách tài khoản, thay đổi vai trò | Quản lý quyền truy cập | Medium | FR-06 |

### Acceptance Criteria (tóm tắt các story chính)

**US-01:** Upload PDF/DOCX ≤ 20MB → extract và hiển thị raw text trong vòng 10 giây

**US-02:** Có tài liệu → click "Generate" → nhận structured lecture (slides + quiz) dạng JSON trong 15 giây

**US-04:** Student trả lời quiz → hệ thống ghi nhận, đánh đúng/sai, hiển thị feedback ngay lập tức

**US-07:** Lecture có Interaction_Log → AI trả ≥ 1 gợi ý cải tiến nếu có câu nào error rate > 50%

---

## 5. Functional Requirements

| Req ID | Mô tả | Category | Priority | Acceptance Criteria |
|--------|-------|----------|----------|---------------------|
| FR-01 | Trích xuất văn bản từ PDF/Word | Content Gen | High | Upload thành công, text bóc tách chính xác; hỗ trợ file ≤ 20MB |
| FR-02 | Tích hợp LLM API tạo Slide + Quiz từ Prompt + Context | AI Core | High | Sinh ra JSON hợp lệ theo schema; dùng streaming response để cải thiện UX |
| FR-03 | Hiển thị bài giảng, ghi nhận kết quả tương tác real-time | Tracking | High | Lưu đúng: StudentID, QuestionID, đáp án đã chọn, thời gian |
| FR-04 | AI Analysis đọc interaction data → sinh text gợi ý cải tiến | Analytics | Medium | Trả ≥ 1 gợi ý nếu error rate > 50% tại một câu hỏi bất kỳ |
| FR-05 | Đăng nhập email/password + phân quyền Teacher/Student/Admin | Auth | High | Đăng nhập đúng → redirect đến dashboard đúng role |
| FR-06 | Admin xem danh sách tài khoản, cập nhật Role | Auth | Medium | Thay đổi Role → áp dụng từ lần login tiếp theo |

## Non-Functional Requirements

| Req ID | Mô tả | Category | Priority | Acceptance Criteria |
|--------|-------|----------|----------|---------------------|
| NFR-01 | Thời gian AI generate lecture < 15 giây | Performance | High | Chấp nhận dùng streaming response để cải thiện UX |
| NFR-02 | UI responsive tốt trên Web và Mobile | Usability | High | Không vỡ layout trên màn hình điện thoại |
| NFR-03 | Password lưu dạng bcrypt hash, API yêu cầu JWT hợp lệ | Security | High | Không có plaintext password trong DB; request không có token hợp lệ → 401 |
| NFR-04 | Xử lý ≥ 50 concurrent users mà không gián đoạn | Scalability | Medium | Load test 50 users: không có request timeout > 20 giây |

---

## 6. Domain Entities & Data Model

| Entity | Attributes chính | Quan hệ |
|--------|-----------------|---------|
| **User** | UserID (PK), Role (Teacher/Student/Admin), Name, Email, PasswordHash | 1-N Lecture, 1-N Interaction_Log, 1-N API_Usage_Log |
| **Lecture** | LectureID (PK), TeacherID (FK→User), Title, OriginalSource, CreatedDate | N-1 User, 1-N AI_Element, 1-N SourceDocument, 1-N AI_Analysis |
| **AI_Element** | ElementID (PK), LectureID (FK→Lecture), Type (Text/Quiz/Flashcard), Content, CorrectAnswer | N-1 Lecture, 1-N Interaction_Log |
| **Interaction_Log** | LogID (PK), StudentID (FK→User), ElementID (FK→AI_Element), SubmittedAnswer, IsCorrect, TimeSpent, **isFirstAttempt (Boolean)** | N-1 User, N-1 AI_Element |
| **AI_Analysis** | AnalysisID (PK), LectureID (FK→Lecture), WeakPointsSummary, ImprovementSuggestions, GeneratedDate, **isLatest (Boolean)** | **N-1 Lecture** (1 lecture có nhiều bản analysis qua các mốc thời gian để so sánh tiến độ; `isLatest = true` đánh dấu bản mới nhất hiển thị cho Teacher) |
| **SourceDocument** | DocumentID (PK), LectureID (FK→Lecture), FileName, FileType (PDF/DOCX), StoragePath, UploadedAt | N-1 Lecture |
| **API_Usage_Log** ⭐ | UsageID (PK), TeacherID (FK→User), Endpoint (OpenAI/Gemini), TokensUsed, Cost, CreatedAt | N-1 User |

> **Ghi chú thay đổi so với Excel gốc:**
> - `Interaction_Log`: bổ sung field `isFirstAttempt (Boolean)` theo BR-06
> - `AI_Analysis`: đổi quan hệ từ `1-1` thành `1-N` với Lecture; thêm field `isLatest (Boolean)` để Teacher luôn thấy đúng bản analysis mới nhất
> - `API_Usage_Log`: entity mới ⭐ — theo dõi chi phí token OpenAI/Gemini theo từng Teacher (chỉ Teacher mới trigger LLM, student không gọi trực tiếp)

---

## 7. Tech Stack (Đã xác nhận)

### Backend — Java Spring Boot

| Thư viện / Module | Mục đích |
|-------------------|----------|
| `spring-boot-starter-web` | REST API |
| `spring-boot-starter-security` + `jjwt` | JWT Auth + RBAC |
| `spring-boot-starter-data-jpa` | ORM, `@Transactional`, Pageable |
| `springdoc-openapi` | Swagger UI (yêu cầu Review 1 task 6) |
| `spring-boot-starter-data-redis` | Redis cache / session |
| `spring-boot-starter-scheduling` hoặc Quartz | Background Job (AI analysis, log aggregation) |
| Apache PDFBox | Parse PDF (thay thế PyMuPDF — Java native) |
| Apache POI | Parse DOCX (thay thế python-docx — Java native) |
| Firebase Admin SDK (Java) | Tích hợp Firebase Storage |
| bcrypt (Spring Security built-in) | Password hashing |

### Frontend — React + TypeScript (Web)

| Thư viện / Tool | Mục đích |
|-----------------|----------|
| React + TypeScript | UI framework |
| Vite | Build tool |
| React Router | Client-side routing (đã có thư mục `router/`) |
| Zustand hoặc Redux | State management (đã có thư mục `store/`) |
| Vercel hoặc Heroku | Deploy (yêu cầu Review 1 task 9) |

### Mobile — Flutter

| Thư viện / Tool | Mục đích |
|-----------------|----------|
| Flutter | Cross-platform mobile framework (**thầy yêu cầu cụ thể**) |
| Figma | Mockup trắng đen trước khi code (yêu cầu Review 1 task 11) |
| Firebase Cloud Messaging (FCM) | Push Notification (yêu cầu Review 2 task 24) |
| HTTP / Dio | Gọi 20-30 API endpoints từ mobile |

### Infrastructure

| Dịch vụ | Mục đích |
|---------|----------|
| MySQL hoặc PostgreSQL | Primary database |
| Redis | Caching + có thể dùng cho session/queue |
| Firebase Storage | Lưu file PDF/DOCX upload (thay vì local storage) |
| OpenAI API hoặc Google Gemini API | LLM cho generate lecture + AI analysis |
| Git Repository | Source code (BE + FE + MO tách repo riêng) |

> **Lưu ý file parsing:** FR-01 gốc ghi `PyMuPDF` + `python-docx` (Python) nhưng backend là Java. Đã quyết định dùng **Apache PDFBox + Apache POI** — Java native, không cần microservice Python riêng.

---

## 8. Deliverable Checklist theo Timeline thầy

### Review 1

| # | Hạng mục | Loại | Ghi chú |
|---|----------|------|---------|
| 1 | Context, Problem, Proposed Solutions, Main Actors, Features, FR, NFR, Business Rules | Doc | ✅ Đã có trong Excel |
| 2 | System Architecture Overview Diagram (Runtime view) | Doc | ⚠️ Phải vẽ: API, DB, WebAdmin, **Mobile**, **Firebase Storage**, **Background Job**, **Redis** |
| 3 | ERD Conceptual + Logical + Physical Diagram | Doc | ⚠️ Chưa có |
| 4 | Physical DB in Server with Data | BE | ⚠️ DB phải lên server thật, có data mẫu |
| 5 | Source code BE in Git Repository | BE | ⚠️ Cần tạo repo |
| 6 | Deploy API with Swagger page | BE | ⚠️ Chỉ cần deploy được + có ít nhất 1 method |
| 7 | Choose template for admin page + Navbar Menu | FE | ⚠️ Chọn UI template |
| 8 | Source code FE in Git Repository | FE | ⚠️ Cần tạo repo (đã setup Vite) |
| 9 | Deploy FE lên Heroku/Vercel | FE | ⚠️ Cần deploy |
| 10 | Screen List + Screen Map (Mobile) | MO | ⚠️ Liệt kê toàn bộ màn hình Flutter |
| 11 | Figma Mockup (trắng đen, tập trung UX) | MO | ⚠️ Không dùng màu |
| 12 | Create mobile project với Footer Menu | MO | ⚠️ **Dùng Flutter** (thầy ghi rõ) |
| 13 | Source code Mobile in Git Repository | MO | ⚠️ Cần tạo repo Flutter |

### Review 2

| # | Hạng mục | Loại | Ghi chú |
|---|----------|------|---------|
| 14 | Usecase Diagram | Doc | |
| 15 | Sequence Diagram (các flow chính) | Doc | |
| 16 | Activity Diagram | Doc | |
| 17 | State Diagram (Main Object) | Doc | |
| 18 | Apply Template cho toàn bộ pages | FE | |
| 19 | CRUD 5 resources, gọi 20-30 API endpoints | FE | |
| 20 | File Upload từ FE → API qua HTTP POST / Firebase Storage | FE | |
| 21 | Authentication với JWT + Authorization | BE | |
| 22 | Develop > 30 endpoints | BE | |
| 23 | REST API Naming chuẩn (GetList: Search/Sort/Paging/Filtering) | BE | |
| 24 | Push Notification | MO | Dùng FCM |
| 25 | Gọi 5 resources API (20-30 endpoints) từ mobile | MO | |
| 26 | Apply template cho toàn bộ màn hình mobile | MO | |

---

## 9. Các vấn đề cần làm rõ

**1. US-07 thiếu Related Req:**
User Story US-07 (AI gợi ý cải tiến) không có cột "Related Req." được điền. Nên map rõ về `FR-04`.

**2. `isFirstAttempt` thiếu trong Entity:**
BR-06 yêu cầu flag `isFirstAttempt` trong Interaction_Log nhưng E-04 không liệt kê field này. Cần bổ sung khi viết DB schema.

**3. Sheet 4 bị thiếu:**
File Excel nhảy từ Sheet 3 (User Stories) sang Sheet 5 (Requirements). Cần bổ sung nếu Sheet 4 là Use Case hay Activity Diagram.

**4. Firebase Auth vs JWT:**
REF-05 tham chiếu Firebase Authentication, nhưng NFR-03 yêu cầu JWT custom + bcrypt. Kiến trúc hiện tại chọn **JWT custom** — Firebase chỉ dùng cho **Storage**, không dùng cho Auth.

### Điểm tốt cần giữ

- Business Rules có HTTP status code cụ thể (400/403/401) — implement thẳng vào Spring Security filter
- Acceptance Criteria theo chuẩn Given/When/Then
- Soft-delete (BR-08) → implement bằng `@SQLDelete` + `@Where` trong JPA
- Streaming response (FR-02, NFR-01) → dùng `SseEmitter` hoặc `StreamingResponseBody` trong Spring

---

## 10. References

| Ref ID | Loại | Tài liệu | Link |
|--------|------|----------|------|
| REF-01 | Research Paper | AI for Vocabulary Learning in Kids – Elsevier | https://doi.org/10.1016/j.chb.2024.107054 |
| REF-02 | Standard | IEEE 830 – Software Requirements Specification | https://ieeexplore.ieee.org/document/727204 |
| REF-03 | Book | Software Engineering – Roger S. Pressman (9th Ed.) | — |
| REF-04 | Article | Gamification in E-Learning – EdTech Magazine | — |
| REF-05 | Documentation | Firebase Authentication Guide – Google Developers | https://firebase.google.com/docs/auth |
