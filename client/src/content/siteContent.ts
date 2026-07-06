import type { BlogPost, Service, Testimonial } from '@shared/schema';
import careerGuidanceImg from '@assets/generated_images/Career_guidance_service_illustration_af504192.png';
import workshopImg from '@assets/generated_images/Workshop_service_illustration_4dfcdcbd.png';
import admissionImg from '@assets/generated_images/Admission_guidance_service_illustration_71c3da6d.png';
import studentAvatar from '@assets/generated_images/Student_testimonial_avatar_42054a15.png';
import parentAvatar from '@assets/generated_images/Parent_testimonial_avatar_3f634bcf.png';
import professionalAvatar from '@assets/generated_images/Professional_testimonial_avatar_9f555e1d.png';

export const services: Service[] = [
  {
    id: '1',
    title: 'Career Guidance',
    description: 'Personalized career counseling to help you discover your strengths, explore opportunities, and make informed decisions about your professional path.',
    image: careerGuidanceImg,
    features: ['Psychometric Assessments', 'Career Path Planning', 'Skill Development Guidance', 'One-on-One Mentoring'],
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    title: 'Workshops and Seminars',
    description: 'Interactive sessions for schools, colleges, and corporates focused on career awareness, skill development, and professional growth.',
    image: workshopImg,
    features: ['Student Career Programs', 'Corporate Training', 'Leadership Development', 'Parent Awareness Sessions'],
    createdAt: new Date('2025-01-02'),
  },
  {
    id: '3',
    title: 'Admission Guidance',
    description: 'Expert guidance for higher education choices, college selection, and admission processes both in India and abroad.',
    image: admissionImg,
    features: ['College Selection Support', 'Application Assistance', 'Course Recommendations', 'Study Abroad Guidance'],
    createdAt: new Date('2025-01-03'),
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'Class 12 Student',
    avatar: studentAvatar,
    quote: 'Dr. Gladis helped me gain clarity about my career path. Her guidance was instrumental in choosing the right stream and college. I now feel confident about my future!',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    role: 'Parent',
    avatar: parentAvatar,
    quote: 'As parents, we were confused about guiding our daughter. Dr. Gladis provided us with practical insights and a clear roadmap. Her expertise made all the difference.',
    createdAt: new Date('2025-01-11'),
  },
  {
    id: '3',
    name: 'Anita Desai',
    role: 'Corporate Professional',
    avatar: professionalAvatar,
    quote: 'The career transition guidance I received was exceptional. Dr. Gladis understood my challenges and helped me navigate towards a more fulfilling career path.',
    createdAt: new Date('2025-01-12'),
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Choosing the Right Career Path: A Guide for Students',
    excerpt: 'Discover how to align your interests, skills, and values to make informed career decisions that lead to long-term satisfaction.',
    content: 'Making the right career choice starts with self-assessment, informed exploration, and structured decision-making.',
    date: 'Jan 15, 2025',
    readTime: '5 min read',
    category: 'Career Guidance',
    createdAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    title: 'The Role of Parents in Career Planning',
    excerpt: 'Learn how parents can effectively support their children without imposing their own aspirations or creating unnecessary pressure.',
    content: 'Parents are most effective when they guide with empathy, provide resources, and avoid imposing expectations.',
    date: 'Jan 10, 2025',
    readTime: '4 min read',
    category: 'Parenting',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: '3',
    title: 'Career Transitions: Navigating Change with Confidence',
    excerpt: 'Professional insights on successfully transitioning careers, overcoming challenges, and finding fulfillment in new opportunities.',
    content: 'Career transitions become manageable with planning, transferable-skill mapping, and a strong support system.',
    date: 'Jan 5, 2025',
    readTime: '6 min read',
    category: 'Professional Development',
    createdAt: new Date('2025-01-05'),
  },
];

export const standardPlans = [
  {
    id: 'pkg-1',
    label: 'Discover',
    subgroup: '8-9 Students',
    amountLabel: 'Rs. 5,500',
    paymentButtonId: 'pl_RwDuOx96VYrsyN',
    features: ['Psychometric assessment', '1 career counselling session', 'Lifetime Knowledge Gateway access', 'Live webinar invites'],
  },
  {
    id: 'pkg-2',
    label: 'Discover Plus+',
    subgroup: '8-9 Students',
    amountLabel: 'Rs. 15,000',
    paymentButtonId: 'pl_RwDq8XpK76OhB3',
    features: ['Psychometric assessments', '8 career counselling sessions (1/year)', 'Custom reports and study abroad guidance', 'CV building'],
  },
  {
    id: 'pkg-3',
    label: 'Achieve Online',
    subgroup: '10-12 Students',
    amountLabel: 'Rs. 5,999',
    paymentButtonId: 'pl_RwDxvLPQP7j4rG',
    features: ['Psychometric assessment', '1 career counselling session', 'Lifetime Knowledge Gateway access', 'Pre-recorded webinars'],
  },
  {
    id: 'pkg-4',
    label: 'Achieve Plus+',
    subgroup: '10-12 Students',
    amountLabel: 'Rs. 10,599',
    paymentButtonId: 'pl_RwDzfVkQYEdAIf',
    features: ['Psychometric assessment', '4 career counselling sessions', 'Custom reports and study abroad guidance', 'CV reviews'],
  },
  {
    id: 'pkg-5',
    label: 'Ascend Online',
    subgroup: 'Graduates',
    amountLabel: 'Rs. 6,499',
    paymentButtonId: 'pl_RwE1evNHrHWJDW',
    features: ['Psychometric assessment', '1 career counselling session', 'Lifetime Knowledge Gateway access', 'Pre-recorded webinars'],
  },
  {
    id: 'pkg-6',
    label: 'Ascend Plus+',
    subgroup: 'Graduates',
    amountLabel: 'Rs. 10,599',
    paymentButtonId: 'pl_RwE3WEILWB9WeJ',
    features: ['Psychometric assessment', '3 career counselling sessions', 'Certificate and online course info', 'CV reviews for jobs'],
  },
  {
    id: 'mp-3',
    label: 'Ascend Online',
    subgroup: 'Working Professionals',
    amountLabel: 'Rs. 6,499',
    paymentButtonId: 'pl_RwE1evNHrHWJDW',
    features: ['Psychometric assessment', '1 career counselling session', 'Lifetime Knowledge Gateway access', 'Pre-recorded webinars'],
  },
  {
    id: 'mp-2',
    label: 'Ascend Plus+',
    subgroup: 'Working Professionals',
    amountLabel: 'Rs. 10,599',
    paymentButtonId: 'pl_RwE3WEILWB9WeJ',
    features: ['Psychometric assessment', '3 career counselling sessions', 'Certificate and online course info', 'CV reviews for jobs'],
  },
] as const;

export const customPlans = [
  {
    id: 'career-report',
    label: 'Career Report',
    amountLabel: 'Rs. 1,500',
    description:
      'Get a detailed report of your psychometric assessment for scientific analysis of your interests and potential future paths.',
  },
  {
    id: 'career-report-counselling',
    label: 'Career Report + Career Counselling',
    amountLabel: 'Rs. 3,000',
    description:
      'Connect with career coaches to analyse your psychometric report and shortlist three career paths you are likely to enjoy and excel at.',
  },
  {
    id: 'knowledge-gateway',
    label: 'Knowledge Gateway + Career Helpline Access',
    amountLabel: 'Rs. 100',
    description:
      'Unlock career path information and direct access to experts via a dedicated career helpline until you land a job you love.',
  },
  {
    id: 'one-to-one-session',
    label: 'One-to-One Session with a Career Expert',
    amountLabel: 'Rs. 3,500',
    description:
      'Resolve your career queries and get future-world insights through a one-to-one session with an expert from your chosen field.',
  },
  {
    id: 'college-admission-planning',
    label: 'College Admission Planning',
    amountLabel: 'Rs. 3,000',
    description:
      'Get unbiased recommendations and details on future college options in India and abroad in one resourceful planner.',
  },
  {
    id: 'exam-stress-management',
    label: 'Exam Stress Management',
    amountLabel: 'Rs. 1,000',
    description:
      'Get expert guidance on handling exam stress, planning study schedules, revision tips, and more from top educators.',
  },
  {
    id: 'cap-100',
    label: 'College Admissions Planner - 100 (CAP-100)',
    amountLabel: 'Rs. 199',
    description:
      'Get a ranked list of top 100 colleges in your course, arranged into Indian Ivy League, Target, Smart Backup, and Safe Bet tiers.',
  },
] as const;
