declare namespace Models {
  interface User {
    createdAt: string;
    description: string;
    id: string;
    name: string;
    password: string;
    posts: Array<Models.Post>;
    profileImage: Models.ProfileImage;
    username: string;
  }

  interface ProfileImage {
    alt: string;
    height: number;
    id: string;
    width: number;
  }

  interface Post {
    createdAt: string;
    id: string;
    images: Array<Models.Image>;
    movie: Models.Movie;
    sound: Models.Sound;
    text: string;
    user: Models.User;
  }

  interface Image {
    alt: string;
    height: number;
    id: string;
    width: number;
  }

  interface Sound {
    artist: string;
    durationMs: number;
    id: string;
    title: string;
    waveformPeaks: number[];
  }

  interface Movie {
    id: string;
  }

  interface Comment {
    createdAt: string;
    id: string;
    post: Models.Post;
    text: string;
    user: Models.User;
  }

  interface DirectMessage {
    id: string;
    sender: Models.User;
    body: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface DirectMessageConversation {
    id: string;
    initiator: Models.User;
    member: Models.User;
    messages: Array<Models.DirectMessage>;
  }

  interface DirectMessageConversationSummary {
    id: string;
    initiator: Models.User;
    member: Models.User;
    lastMessage: Models.DirectMessage;
    hasUnread: boolean;
  }

  interface ChatMessage {
    role: "user" | "assistant";
    content: string;
  }

  interface Sentiment {
    score: number;
    label: "positive" | "negative" | "neutral";
  }

  interface SearchResponse {
    posts: Array<Models.Post>;
    sentiment: Models.Sentiment | null;
  }

  interface TranslationResponse {
    result: string;
  }

  interface SSEChunk {
    text?: string;
    done?: boolean;
  }
}
