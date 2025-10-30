import { useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { BlogPost } from '@shared/schema';

export default function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  //todo: remove mock functionality - fallback mock data
  const mockBlogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Choosing the Right Career Path: A Guide for Students',
      excerpt: 'Discover how to align your interests, skills, and values to make informed career decisions that lead to long-term satisfaction.',
      content: `Making the right career choice is one of the most important decisions in a student's life. It's not just about choosing a profession—it's about finding a path that aligns with your passions, strengths, and long-term goals.

**Understanding Your Strengths**

The first step is self-assessment. Understanding your unique talents, interests, and values is crucial. Psychometric assessments can provide valuable insights into your personality type and natural inclinations.

**Exploring Options**

Don't limit yourself to traditional career paths. The modern job market offers countless opportunities across diverse fields. Research thoroughly, talk to professionals, and consider internships to gain real-world experience.

**Making Informed Decisions**

Consider factors like job market trends, growth potential, work-life balance, and personal fulfillment. Seek guidance from experienced counselors who can provide objective perspectives.

Remember, your career is a journey, not a destination. Stay open to learning and evolving as you progress.`,
      date: 'Jan 15, 2025',
      readTime: '5 min read',
      category: 'Career Guidance',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'The Role of Parents in Career Planning',
      excerpt: 'Learn how parents can effectively support their children without imposing their own aspirations or creating unnecessary pressure.',
      content: `Parents play a crucial role in their children's career decisions, but finding the right balance between guidance and autonomy is essential.

**Being a Supportive Guide**

Instead of dictating career choices, focus on being a supportive sounding board. Listen to your child's interests and aspirations without judgment.

**Providing Resources**

Help your child access resources like career counselors, industry professionals, and educational opportunities. Your network and experience can be invaluable.

**Avoiding Common Pitfalls**

Don't project your unfulfilled dreams onto your children. Each generation faces different opportunities and challenges. What worked for you may not be the best path for them.

**Encouraging Exploration**

Support your child in exploring different fields through internships, workshops, and informational interviews. Real-world exposure helps in making informed decisions.

Trust in the process and remember that your role is to empower, not to control.`,
      date: 'Jan 10, 2025',
      readTime: '4 min read',
      category: 'Parenting',
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Career Transitions: Navigating Change with Confidence',
      excerpt: 'Professional insights on successfully transitioning careers, overcoming challenges, and finding fulfillment in new opportunities.',
      content: `Career transitions can be daunting, but they also offer incredible opportunities for growth and fulfillment.

**Recognizing the Need for Change**

Sometimes, despite success, you may feel unfulfilled. Recognizing this need for change is the first step toward a more satisfying career.

**Assessing Transferable Skills**

You have more skills than you realize. Identifying and articulating your transferable skills is crucial for successful transitions. Think beyond job titles to the core competencies you've developed.

**Strategic Planning**

Don't make impulsive decisions. Create a strategic plan that includes financial preparation, skill development, and networking in your target field.

**Building a Support System**

Surround yourself with people who support your transition. Work with career counselors, join professional networks, and seek mentorship.

**Embracing the Journey**

Change is challenging, but it's also an opportunity for reinvention. Stay patient with yourself and celebrate small wins along the way.

Your past experiences are not wasted—they're the foundation for your next chapter.`,
      date: 'Jan 5, 2025',
      readTime: '6 min read',
      category: 'Professional Development',
      createdAt: new Date(),
    },
  ];

  const { data: blogPostsData } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  const blogPosts = blogPostsData && blogPostsData.length > 0 ? blogPostsData : mockBlogPosts;

  return (
    <section id="blog" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Resources & Insights</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practical guidance and expert insights on career development and personal growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 hover:shadow-lg flex flex-col"
              data-testid={`card-blog-${index}`}
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => setSelectedPost(post)}
                  data-testid={`button-read-more-${index}`}
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bold pr-8">{selectedPost?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {selectedPost?.category}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{selectedPost?.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{selectedPost?.readTime}</span>
              </div>
            </div>
            <div className="prose prose-lg max-w-none whitespace-pre-line text-foreground/90 leading-relaxed">
              {selectedPost?.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
