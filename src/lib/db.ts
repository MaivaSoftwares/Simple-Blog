
import { toast } from "sonner";

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// In a real app, these would be actual MongoDB operations
// For this demo, we'll simulate with localStorage

const STORAGE_KEY = "aurora_blog_posts";

// Sample data
const samplePosts: Post[] = [
  {
    _id: "1",
    title: "Getting Started with React and TypeScript",
    excerpt: "Learn how to set up a new React project with TypeScript and build your first component.",
    content: `
      <h2>Introduction to React with TypeScript</h2>
      <p>React is a popular JavaScript library for building user interfaces, and TypeScript adds static type checking to your code. Together, they provide a powerful development experience.</p>
      
      <h2>Setting Up Your Project</h2>
      <p>You can create a new React TypeScript project using Create React App with the TypeScript template:</p>
      <pre><code>npx create-react-app my-app --template typescript</code></pre>
      
      <h2>Your First Component</h2>
      <p>Here's a simple React component with TypeScript:</p>
      <pre><code>
interface HelloProps {
  name: string;
}

function Hello({ name }: HelloProps) {
  return <h1>Hello, {name}!</h1>;
}
      </code></pre>
      
      <h2>Conclusion</h2>
      <p>Now you have a basic understanding of how to use React with TypeScript. Keep exploring and building!</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
    author: {
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "2",
    title: "Mastering CSS Grid Layout",
    excerpt: "Discover how CSS Grid Layout can revolutionize your web design approach.",
    content: `
      <h2>What is CSS Grid?</h2>
      <p>CSS Grid Layout is a two-dimensional layout system designed for user interface design. It allows you to organize content in rows and columns.</p>
      
      <h2>Basic Grid Setup</h2>
      <p>To create a grid container, use the <code>display: grid</code> property:</p>
      <pre><code>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}
      </code></pre>
      
      <h2>Placing Items</h2>
      <p>You can precisely place items in your grid:</p>
      <pre><code>
.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
      </code></pre>
      
      <h2>Responsive Grids</h2>
      <p>CSS Grid makes it easy to create responsive layouts without media queries using functions like <code>repeat()</code> and <code>minmax()</code>:</p>
      <pre><code>
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px;
}
      </code></pre>
    `,
    coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
    author: {
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initialize local storage with sample data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts));
  }
};

export const getPosts = async (): Promise<Post[]> => {
  try {
    initializeStorage();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return posts;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    toast.error("Failed to fetch posts");
    return [];
  }
};

export const getPost = async (id: string): Promise<Post | null> => {
  try {
    initializeStorage();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return posts.find((post: Post) => post._id === id) || null;
  } catch (error) {
    console.error(`Failed to fetch post with ID ${id}:`, error);
    toast.error("Failed to fetch the post");
    return null;
  }
};

export const createPost = async (postData: Omit<Post, "_id" | "createdAt" | "updatedAt">): Promise<Post> => {
  try {
    initializeStorage();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    
    const newPost: Post = {
      ...postData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedPosts = [newPost, ...posts];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    
    toast.success("Post created successfully");
    return newPost;
  } catch (error) {
    console.error("Failed to create post:", error);
    toast.error("Failed to create the post");
    throw error;
  }
};

export const updatePost = async (id: string, postData: Partial<Post>): Promise<Post> => {
  try {
    initializeStorage();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    
    const postIndex = posts.findIndex((post: Post) => post._id === id);
    
    if (postIndex === -1) {
      throw new Error(`Post with ID ${id} not found`);
    }
    
    const updatedPost = {
      ...posts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString(),
    };
    
    posts[postIndex] = updatedPost;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    
    toast.success("Post updated successfully");
    return updatedPost;
  } catch (error) {
    console.error(`Failed to update post with ID ${id}:`, error);
    toast.error("Failed to update the post");
    throw error;
  }
};

export const deletePost = async (id: string): Promise<boolean> => {
  try {
    initializeStorage();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    
    const filteredPosts = posts.filter((post: Post) => post._id !== id);
    
    if (filteredPosts.length === posts.length) {
      throw new Error(`Post with ID ${id} not found`);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPosts));
    
    toast.success("Post deleted successfully");
    return true;
  } catch (error) {
    console.error(`Failed to delete post with ID ${id}:`, error);
    toast.error("Failed to delete the post");
    return false;
  }
};
