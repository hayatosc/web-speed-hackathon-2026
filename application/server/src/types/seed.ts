// Seed types for database insertion
// These match the database column types (dates as ISO strings)

export interface ProfileImageSeed {
  id: string;
  alt: string;
  width: number;
  height: number;
}

export interface UserSeed {
  id: string;
  username: string;
  name: string;
  description: string;
  password: string;
  profileImageId: string;
  createdAt: string;
}

export interface ImageSeed {
  id: string;
  alt: string;
  createdAt: string;
  width: number;
  height: number;
}

export interface MovieSeed {
  id: string;
}

export interface SoundSeed {
  id: string;
  title: string;
  artist: string;
  durationMs: number;
  waveformPeaks: number[];
}

export interface PostSeed {
  id: string;
  userId: string;
  movieId?: string | null;
  soundId?: string | null;
  text: string;
  createdAt: string;
}

export interface PostsImagesRelationSeed {
  postId: string;
  imageId: string;
}

export interface CommentSeed {
  id: string;
  userId: string;
  postId: string;
  text: string;
  createdAt: string;
}

export interface DirectMessageConversationSeed {
  id: string;
  initiatorId: string;
  memberId: string;
}

export interface DirectMessageSeed {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QaSuggestionSeed {
  id: string;
  question: string;
}
