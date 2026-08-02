import { contentService } from './contentService';
import type { ContentItem, UserProfile } from '../types';
import { normalizeGrade } from '../utils/gradeUtils';

export const uploadService = {
  createUpload: (
    data: {
      title: string;
      description: string;
      subject: string;
      targetGrades: string[];
      contentType: 'video' | 'document' | 'book' | 'batch' | 'test_series' | 'test';
      status?: 'published' | 'draft';
      thumbnail?: string;
      videoUrl?: string;
      embedCode?: string;
      duration?: string;
      fileType?: string;
      fileSize?: string;
      pages?: number;
      schedule?: string;
      instructor?: string;
      difficulty?: string;
      durationMinutes?: number;
      questionsCount?: number;
      totalMarks?: number;
      appleReward?: number;
      tags?: string[];
      attachments?: { name: string; url: string; type: string }[];
    },
    userObj: UserProfile
  ): ContentItem => {
    const newItem: ContentItem = {
      id: `${data.contentType.charAt(0)}-${Date.now()}`,
      title: data.title,
      description: data.description,
      subject: data.subject,
      targetGrades: data.targetGrades.map((g) => normalizeGrade(g)),
      contentType: data.contentType,
      authorName: userObj.name || userObj.firstName || 'Creator Educator',
      authorRole: userObj.isAdmin ? 'Admin Owner 👑' : 'Teacher Educator 🎓',
      authorAvatar: userObj.photoUrl || 'gradient:solar',
      createdAt: new Date().toISOString(),
      thumbnail:
        data.thumbnail ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      videoUrl: data.videoUrl,
      embedCode: data.embedCode,
      duration: data.duration || (data.durationMinutes ? `${data.durationMinutes} mins` : '30 mins'),
      fileType: data.fileType || 'PDF',
      fileSize: data.fileSize || '2.5 MB',
      format: data.fileType || 'PDF',
      pages: data.pages || 150,
      readingProgress: 0,
      schedule: data.schedule || 'Flexible Schedule',
      instructor: data.instructor || userObj.name,
      studentsEnrolled: 0,
      seatCount: 100,
      enrolled: false,
      difficulty: data.difficulty || 'Medium',
      durationMinutes: data.durationMinutes || 60,
      questionsCount: data.questionsCount || 30,
      totalMarks: data.totalMarks || 100,
      appleReward: data.appleReward || 20,
      attemptsCount: 0,
      views: 0,
      tags: data.tags && data.tags.length > 0 ? data.tags : [data.subject, data.contentType],
      status: data.status || 'published',
      attachments: data.attachments || [],
      comments: [],
    };

    // Store in mock content localStorage via contentService
    contentService.addContentItem(newItem);
    return newItem;
  },
};
