import React from 'react';
import { Composition, Series } from 'remotion';
import { SlideScene } from './SlideScene';
import type { Slide } from '../types';

interface CompositionProps {
  slides: Slide[];
  /** Thời lượng mỗi slide tính bằng số frames (fps=30) */
  slideDurationsFrames: number[];
}

/**
 * SlideComposition — wrap từng slide thành Series.Sequence, mỗi slide
 * có thời lượng riêng (tính từ TTS durationMs, quy đổi ra frames).
 */
const SlideComposition = ({
  slides,
  slideDurationsFrames,
}: CompositionProps) => {
  return (
    <Series>
      {slides.map((slide, i) => (
        <Series.Sequence key={i} durationInFrames={slideDurationsFrames[i] ?? 90}>
          <SlideScene slide={slide} isActive={true} />
        </Series.Sequence>
      ))}
    </Series>
  );
};

/** Default props dùng cho Remotion Studio preview */
const defaultSlides: Slide[] = [
  {
    title: 'Giới thiệu về AI trong Giáo dục',
    bulletPoints: [
      'AI giúp cá nhân hóa lộ trình học tập',
      'Tự động sinh bài giảng từ tài liệu',
      'Phân tích dữ liệu học tập theo thời gian thực',
    ],
    narrationText:
      'Trí tuệ nhân tạo đang thay đổi cách chúng ta giảng dạy và học tập. Từ việc cá nhân hóa lộ trình cho từng học sinh, đến tự động tạo bài giảng từ tài liệu thô, AI mở ra một kỷ nguyên giáo dục mới.',
  },
  {
    title: 'Quy trình tạo bài giảng',
    bulletPoints: [
      'Teacher upload PDF hoặc DOCX',
      'AI trích xuất và phân tích nội dung',
      'Remotion render video bài giảng',
    ],
    narrationText:
      'Quy trình bắt đầu khi giáo viên tải lên tài liệu. Hệ thống AI sẽ phân tích nội dung và tự động tạo ra một video bài giảng hoàn chỉnh với hình ảnh và giọng đọc.',
  },
];

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  const defaultDurationsFrames = defaultSlides.map((slide) =>
    Math.round((Math.max(3000, slide.narrationText.length * 60) / 1000) * fps),
  );
  const totalFrames = defaultDurationsFrames.reduce((a, b) => a + b, 0);

  return (
    <Composition
      id="SlideComposition"
      // Cast cần thiết để thỏa mãn kiểu LooseComponentType<Record<string, unknown>> của Remotion.
      // An toàn vì inputProps và defaultProps luôn truyền đúng kiểu CompositionProps.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component={SlideComposition as React.ComponentType<any>}
      durationInFrames={totalFrames || 180}
      fps={fps}
      width={1280}
      height={720}
      defaultProps={{
        slides: defaultSlides,
        slideDurationsFrames: defaultDurationsFrames,
      }}
    />
  );
};
