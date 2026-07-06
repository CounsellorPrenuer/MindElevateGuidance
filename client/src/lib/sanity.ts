import { createClient } from '@sanity/client';

export type CmsService = {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
};

export type CmsTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
};

export type CmsBlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
};

export type CmsPaymentPlan = {
  id: string;
  label: string;
  subgroup: string;
  amountLabel: string;
  paymentButtonId: string;
  features: string[];
};

export type CmsCustomPlan = {
  id: string;
  label: string;
  amountLabel: string;
  description: string;
  image: string;
};

const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'd8qf2ndh',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
  perspective: 'published',
});

async function fetchOrEmpty<T>(query: string): Promise<T[]> {
  try {
    return await sanityClient.fetch<T[]>(query);
  } catch {
    return [];
  }
}

export async function getServices(): Promise<CmsService[]> {
  return fetchOrEmpty<CmsService>(
    `*[_type == "service"] | order(order asc, _createdAt asc) {
      "id": coalesce(slug.current, _id),
      title,
      description,
      "image": coalesce(image.asset->url, imageUrl, ""),
      "features": coalesce(features, [])
    }`,
  );
}

export async function getTestimonials(): Promise<CmsTestimonial[]> {
  return fetchOrEmpty<CmsTestimonial>(
    `*[_type == "testimonial"] | order(order asc, _createdAt asc) {
      "id": coalesce(slug.current, _id),
      name,
      role,
      quote,
      "avatar": coalesce(avatar.asset->url, avatarUrl, "")
    }`,
  );
}

export async function getBlogPosts(): Promise<CmsBlogPost[]> {
  return fetchOrEmpty<CmsBlogPost>(
    `*[_type == "blogPost"] | order(order asc, publishedAt desc, _createdAt desc) {
      "id": coalesce(slug.current, _id),
      title,
      excerpt,
      content,
      category,
      date,
      readTime
    }`,
  );
}

export async function getStandardPlans(): Promise<CmsPaymentPlan[]> {
  return fetchOrEmpty<CmsPaymentPlan>(
    `*[_type == "paymentPlan"] | order(order asc, _createdAt asc) {
      "id": _id,
      label,
      subgroup,
      amountLabel,
      paymentButtonId,
      "features": coalesce(features, [])
    }`,
  );
}

export async function getCustomPlans(): Promise<CmsCustomPlan[]> {
  return fetchOrEmpty<CmsCustomPlan>(
    `*[_type == "customPlan"] | order(order asc, _createdAt asc) {
      "id": _id,
      label,
      amountLabel,
      description,
      "image": coalesce(image.asset->url, imageUrl, "")
    }`,
  );
}
