import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { blogPosts as fallbackBlogPosts } from '@/content/siteContent';
import { getBlogPosts } from '@/lib/sanity';
import type { BlogPost } from '@shared/schema';

export default function BlogSection() {
  const { data } = useQuery({
    queryKey: ['sanity', 'blogPosts'],
    queryFn: getBlogPosts,
  });

  const blogPosts = data && data.length > 0 ? data : fallbackBlogPosts;
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

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
            <Card key={post.id} className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 hover:shadow-lg flex flex-col" data-testid={`card-blog-${index}`}>
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">{post.category}</span>
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
                <Button variant="ghost" size="sm" className="w-full justify-between" onClick={() => setSelectedPost(post as BlogPost)} data-testid={`button-read-more-${index}`}>
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
              <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">{selectedPost?.category}</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{selectedPost?.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{selectedPost?.readTime}</span>
              </div>
            </div>
            <div className="prose prose-lg max-w-none whitespace-pre-line text-foreground/90 leading-relaxed">{selectedPost?.content}</div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
