
![](https://github.com/buyinzadiana-bot/PHASE-2-CAPSTONE/blob/ea588c840949eedc02b3e1fcb26d14b6551b8902/Screenshot%202025-11-24%20at%2009.00.29.png)
![](https://github.com/buyinzadiana-bot/PHASE-2-CAPSTONE/blob/a093e42a81563aa8b8ee2a2de0f58bd80c38a5f5/Screenshot%202025-11-24%20at%2009.00.38.png)
TECHINSIGHT

TechInsights is a modern blogging platform built with Next.js and Supabase. It allows users to create, manage, and read posts focused on technology, AI, data infrastructure, startups, and more. The platform includes a rich post editor, authentication, tagging, and responsive UI components for a seamless user experience.


TABLE OF CONTENT


Project Overview

Features

Technologies Used

Project Structure

Installation

Running the Project

Usage

Future Improvements

License

Project Overview

TechInsights provides a clean, user-friendly platform for sharing technical content. Users can:

Write and publish posts

Save drafts

Add tags to categorize posts

View posts with cover images, excerpts, and author information

Navigate through posts via tags or homepage



The platform is built with a mobile-first, responsive design using Tailwind CSS and follows modern web standards.

Features

Authentication: Users can sign up, log in, and log out.

Editor:

Title, slug, excerpt, content, and tags input

Save posts as drafts or publish directly

Auto-generate slug based on the title

Dynamic UI with clear feedback for errors and loading states

Post Management:

View posts in a clean, card-based layout

Detailed post pages with author info, published date, reading time, and tags

Responsive Design: Optimized for mobile, tablet, and desktop

UI/UX Enhancements:

Fixed header for easy navigation

Hover effects and smooth transitions on buttons and cards

Clean, modern color scheme with white backgrounds and deep blue accents

Technologies Used

Framework: Next.js 13 (App Router)

Styling: Tailwind CSS

Database & Auth: Supabase

Deployment: Vercel (recommended)

Language: TypeScript

Version Control: Git

Project Structure
/app
  /editor            - Editor page for creating posts
  /posts
    /[slug]          - Dynamic post pages
  /tags
    /[tag]           - Dynamic tag pages
/components
  Header.tsx         - Navigation header
  PostCard.tsx       - Post preview card
  PostDetail.tsx     - Detailed post view
/lib
  posts.ts           - Functions for fetching posts and post details
  supabase/client.ts - Supabase client initialization
/public
  placeholder.svg    - Default image placeholder

Installation

Clone the repository

git clone https://github.com/your-username/techinsights.git
cd techinsights


Install dependencies

npm install


Set up environment variables

Create a .env.local file at the root of your project:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


Set up Supabase database

Create tables: posts, tags, post_tags, users

Ensure your tables have the following essential fields:

Posts Table Example:

id (uuid, primary key)

author_id (uuid, foreign key)

title (text)

slug (text)

excerpt (text)

content (text)

status (text: draft/published)

published_at (timestamp)

Tags Table Example:

id (uuid, primary key)

name (text)

Post_Tags Table Example:

id (uuid, primary key)

post_id (uuid, foreign key)

tag_id (uuid, foreign key)

Running the Project

Development Mode

npm run dev



You can now navigate the homepage, editor, and individual post pages.

Production Build

npm run build
npm start

Usage

Homepage

View recent posts, popular tags, and navigate to editor pages.

Creating a Post

Click “Write” in the header (requires login).

Fill in the title, excerpt, content, and tags.

Click “Publish” or “Save as Draft”.

Viewing Posts

Click any post card to see full content, author info, published date, and tags.

Filtering by Tags

Click a tag to view all posts associated with that tag.
