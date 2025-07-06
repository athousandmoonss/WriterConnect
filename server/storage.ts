import { 
  users, posts, portfolioWorks, follows, likes, comments,
  type User, type InsertUser, type Post, type InsertPost,
  type PortfolioWork, type InsertPortfolioWork, type Follow, type InsertFollow,
  type Like, type InsertLike, type Comment, type InsertComment,
  type PostWithUser, type CommentWithUser
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  searchUsers(query: string): Promise<User[]>;

  // Post operations
  getPost(id: number): Promise<Post | undefined>;
  getPostsByUser(userId: number): Promise<Post[]>;
  getFeedPosts(userId: number, limit?: number): Promise<PostWithUser[]>;
  getAllPosts(limit?: number): Promise<PostWithUser[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  searchPosts(query: string): Promise<PostWithUser[]>;

  // Portfolio operations
  getPortfolioWork(id: number): Promise<PortfolioWork | undefined>;
  getPortfolioWorksByUser(userId: number): Promise<PortfolioWork[]>;
  createPortfolioWork(work: InsertPortfolioWork): Promise<PortfolioWork>;
  updatePortfolioWork(id: number, work: Partial<PortfolioWork>): Promise<PortfolioWork | undefined>;
  deletePortfolioWork(id: number): Promise<boolean>;

  // Follow operations
  getFollowers(userId: number): Promise<User[]>;
  getFollowing(userId: number): Promise<User[]>;
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
  followUser(follow: InsertFollow): Promise<Follow>;
  unfollowUser(followerId: number, followingId: number): Promise<boolean>;

  // Like operations
  getLikesByPost(postId: number): Promise<Like[]>;
  getUserLikes(userId: number): Promise<Like[]>;
  isPostLiked(userId: number, postId: number): Promise<boolean>;
  likePost(like: InsertLike): Promise<Like>;
  unlikePost(userId: number, postId: number): Promise<boolean>;

  // Comment operations
  getCommentsByPost(postId: number): Promise<CommentWithUser[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private posts: Map<number, Post> = new Map();
  private portfolioWorks: Map<number, PortfolioWork> = new Map();
  private follows: Map<number, Follow> = new Map();
  private likes: Map<number, Like> = new Map();
  private comments: Map<number, Comment> = new Map();
  
  private currentUserId = 1;
  private currentPostId = 1;
  private currentPortfolioWorkId = 1;
  private currentFollowId = 1;
  private currentLikeId = 1;
  private currentCommentId = 1;

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      ...insertUser,
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
      likeCount: 0,
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async searchUsers(query: string): Promise<User[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.users.values()).filter(user => 
      user.username.toLowerCase().includes(searchTerm) ||
      user.fullName.toLowerCase().includes(searchTerm) ||
      user.bio?.toLowerCase().includes(searchTerm)
    );
  }

  // Post operations
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostsByUser(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getFeedPosts(userId: number, limit = 20): Promise<PostWithUser[]> {
    const following = await this.getFollowing(userId);
    const followingIds = following.map(user => user.id);
    followingIds.push(userId); // Include user's own posts

    const posts = Array.from(this.posts.values())
      .filter(post => followingIds.includes(post.userId))
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);

    return Promise.all(posts.map(async post => {
      const user = await this.getUser(post.userId);
      const isLiked = await this.isPostLiked(userId, post.id);
      return {
        ...post,
        user: user!,
        isLiked,
      };
    }));
  }

  async getAllPosts(limit = 20): Promise<PostWithUser[]> {
    const posts = Array.from(this.posts.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);

    return Promise.all(posts.map(async post => {
      const user = await this.getUser(post.userId);
      return {
        ...post,
        user: user!,
      };
    }));
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const now = new Date();
    const post: Post = {
      id: this.currentPostId++,
      ...insertPost,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.posts.set(post.id, post);
    
    // Update user post count
    const user = await this.getUser(post.userId);
    if (user) {
      await this.updateUser(user.id, { postCount: user.postCount + 1 });
    }
    
    return post;
  }

  async updatePost(id: number, updateData: Partial<Post>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updateData, updatedAt: new Date() };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    const post = this.posts.get(id);
    if (!post) return false;
    
    this.posts.delete(id);
    
    // Update user post count
    const user = await this.getUser(post.userId);
    if (user) {
      await this.updateUser(user.id, { postCount: Math.max(0, user.postCount - 1) });
    }
    
    return true;
  }

  async searchPosts(query: string): Promise<PostWithUser[]> {
    const searchTerm = query.toLowerCase();
    const posts = Array.from(this.posts.values()).filter(post => 
      post.title?.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    return Promise.all(posts.map(async post => {
      const user = await this.getUser(post.userId);
      return {
        ...post,
        user: user!,
      };
    }));
  }

  // Portfolio operations
  async getPortfolioWork(id: number): Promise<PortfolioWork | undefined> {
    return this.portfolioWorks.get(id);
  }

  async getPortfolioWorksByUser(userId: number): Promise<PortfolioWork[]> {
    return Array.from(this.portfolioWorks.values())
      .filter(work => work.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createPortfolioWork(insertWork: InsertPortfolioWork): Promise<PortfolioWork> {
    const work: PortfolioWork = {
      id: this.currentPortfolioWorkId++,
      ...insertWork,
      createdAt: new Date(),
    };
    this.portfolioWorks.set(work.id, work);
    return work;
  }

  async updatePortfolioWork(id: number, updateData: Partial<PortfolioWork>): Promise<PortfolioWork | undefined> {
    const work = this.portfolioWorks.get(id);
    if (!work) return undefined;
    
    const updatedWork = { ...work, ...updateData };
    this.portfolioWorks.set(id, updatedWork);
    return updatedWork;
  }

  async deletePortfolioWork(id: number): Promise<boolean> {
    return this.portfolioWorks.delete(id);
  }

  // Follow operations
  async getFollowers(userId: number): Promise<User[]> {
    const followerIds = Array.from(this.follows.values())
      .filter(follow => follow.followingId === userId)
      .map(follow => follow.followerId);
    
    return Promise.all(followerIds.map(id => this.getUser(id))).then(users => 
      users.filter(user => user !== undefined) as User[]
    );
  }

  async getFollowing(userId: number): Promise<User[]> {
    const followingIds = Array.from(this.follows.values())
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId);
    
    return Promise.all(followingIds.map(id => this.getUser(id))).then(users => 
      users.filter(user => user !== undefined) as User[]
    );
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    return Array.from(this.follows.values()).some(follow => 
      follow.followerId === followerId && follow.followingId === followingId
    );
  }

  async followUser(insertFollow: InsertFollow): Promise<Follow> {
    const follow: Follow = {
      id: this.currentFollowId++,
      ...insertFollow,
      createdAt: new Date(),
    };
    this.follows.set(follow.id, follow);
    
    // Update follower/following counts
    const follower = await this.getUser(follow.followerId);
    const following = await this.getUser(follow.followingId);
    
    if (follower) {
      await this.updateUser(follower.id, { followingCount: follower.followingCount + 1 });
    }
    if (following) {
      await this.updateUser(following.id, { followerCount: following.followerCount + 1 });
    }
    
    return follow;
  }

  async unfollowUser(followerId: number, followingId: number): Promise<boolean> {
    const follow = Array.from(this.follows.values()).find(f => 
      f.followerId === followerId && f.followingId === followingId
    );
    
    if (!follow) return false;
    
    this.follows.delete(follow.id);
    
    // Update follower/following counts
    const follower = await this.getUser(followerId);
    const following = await this.getUser(followingId);
    
    if (follower) {
      await this.updateUser(follower.id, { followingCount: Math.max(0, follower.followingCount - 1) });
    }
    if (following) {
      await this.updateUser(following.id, { followerCount: Math.max(0, following.followerCount - 1) });
    }
    
    return true;
  }

  // Like operations
  async getLikesByPost(postId: number): Promise<Like[]> {
    return Array.from(this.likes.values()).filter(like => like.postId === postId);
  }

  async getUserLikes(userId: number): Promise<Like[]> {
    return Array.from(this.likes.values()).filter(like => like.userId === userId);
  }

  async isPostLiked(userId: number, postId: number): Promise<boolean> {
    return Array.from(this.likes.values()).some(like => 
      like.userId === userId && like.postId === postId
    );
  }

  async likePost(insertLike: InsertLike): Promise<Like> {
    const like: Like = {
      id: this.currentLikeId++,
      ...insertLike,
      createdAt: new Date(),
    };
    this.likes.set(like.id, like);
    
    // Update post like count
    const post = await this.getPost(like.postId);
    if (post) {
      await this.updatePost(post.id, { likeCount: post.likeCount + 1 });
    }
    
    return like;
  }

  async unlikePost(userId: number, postId: number): Promise<boolean> {
    const like = Array.from(this.likes.values()).find(l => 
      l.userId === userId && l.postId === postId
    );
    
    if (!like) return false;
    
    this.likes.delete(like.id);
    
    // Update post like count
    const post = await this.getPost(postId);
    if (post) {
      await this.updatePost(post.id, { likeCount: Math.max(0, post.likeCount - 1) });
    }
    
    return true;
  }

  // Comment operations
  async getCommentsByPost(postId: number): Promise<CommentWithUser[]> {
    const comments = Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());

    return Promise.all(comments.map(async comment => {
      const user = await this.getUser(comment.userId);
      return {
        ...comment,
        user: user!,
      };
    }));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const comment: Comment = {
      id: this.currentCommentId++,
      ...insertComment,
      createdAt: new Date(),
    };
    this.comments.set(comment.id, comment);
    
    // Update post comment count
    const post = await this.getPost(comment.postId);
    if (post) {
      await this.updatePost(post.id, { commentCount: post.commentCount + 1 });
    }
    
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const comment = this.comments.get(id);
    if (!comment) return false;
    
    this.comments.delete(id);
    
    // Update post comment count
    const post = await this.getPost(comment.postId);
    if (post) {
      await this.updatePost(post.id, { commentCount: Math.max(0, post.commentCount - 1) });
    }
    
    return true;
  }
}

export const storage = new MemStorage();
