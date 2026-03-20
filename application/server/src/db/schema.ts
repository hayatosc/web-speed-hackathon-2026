import { relations } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Profile Images table
export const profileImages = sqliteTable("ProfileImages", {
  id: text("id").primaryKey(),
  alt: text("alt").notNull().default(""),
});

// Users table
export const users = sqliteTable("Users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  password: text("password").notNull(),
  profileImageId: text("profileImageId")
    .notNull()
    .references(() => profileImages.id)
    .default("396fe4ce-aa36-4d96-b54e-6db40bae2eed"),
  createdAt: text("createdAt").notNull(),
});

// Images table
export const images = sqliteTable("Images", {
  id: text("id").primaryKey(),
  alt: text("alt").notNull().default(""),
  createdAt: text("createdAt").notNull(),
});

// Movies table
export const movies = sqliteTable("Movies", {
  id: text("id").primaryKey(),
});

// Sounds table
export const sounds = sqliteTable("Sounds", {
  id: text("id").primaryKey(),
  title: text("title").notNull().default("Unknown"),
  artist: text("artist").notNull().default("Unknown"),
});

// Posts table
export const posts = sqliteTable("Posts", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  movieId: text("movieId").references(() => movies.id),
  soundId: text("soundId").references(() => sounds.id),
  text: text("text").notNull(),
  createdAt: text("createdAt").notNull(),
});

// PostsImagesRelations join table
export const postsImagesRelations = sqliteTable(
  "PostsImagesRelations",
  {
    postId: text("postId")
      .notNull()
      .references(() => posts.id),
    imageId: text("imageId")
      .notNull()
      .references(() => images.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.imageId] }),
  }),
);

// Comments table
export const comments = sqliteTable("Comments", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  postId: text("postId")
    .notNull()
    .references(() => posts.id),
  text: text("text").notNull(),
  createdAt: text("createdAt").notNull(),
});

// DirectMessageConversations table
export const directMessageConversations = sqliteTable("DirectMessageConversations", {
  id: text("id").primaryKey(),
  initiatorId: text("initiatorId")
    .notNull()
    .references(() => users.id),
  memberId: text("memberId")
    .notNull()
    .references(() => users.id),
});

// DirectMessages table
export const directMessages = sqliteTable("DirectMessages", {
  id: text("id").primaryKey(),
  conversationId: text("conversationId")
    .notNull()
    .references(() => directMessageConversations.id),
  senderId: text("senderId")
    .notNull()
    .references(() => users.id),
  body: text("body").notNull(),
  isRead: integer("isRead", { mode: "boolean" }).notNull().default(false),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

// QA Suggestions table
export const qaSuggestions = sqliteTable("qa_suggestions", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
});

// Relations

export const usersRelations = relations(users, ({ one, many }) => ({
  profileImage: one(profileImages, {
    fields: [users.profileImageId],
    references: [profileImages.id],
  }),
  posts: many(posts),
  comments: many(comments),
  sentMessages: many(directMessages),
  initiatedConversations: many(directMessageConversations, { relationName: "initiator" }),
  joinedConversations: many(directMessageConversations, { relationName: "member" }),
}));

export const profileImagesRelations = relations(profileImages, ({ many }) => ({
  users: many(users),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  movie: one(movies, {
    fields: [posts.movieId],
    references: [movies.id],
  }),
  sound: one(sounds, {
    fields: [posts.soundId],
    references: [sounds.id],
  }),
  comments: many(comments),
  postImages: many(postsImagesRelations),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  posts: many(posts),
}));

export const soundsRelations = relations(sounds, ({ many }) => ({
  posts: many(posts),
}));

export const imagesRelations = relations(images, ({ many }) => ({
  postImages: many(postsImagesRelations),
}));

export const postsImagesRelationsRelations = relations(postsImagesRelations, ({ one }) => ({
  post: one(posts, {
    fields: [postsImagesRelations.postId],
    references: [posts.id],
  }),
  image: one(images, {
    fields: [postsImagesRelations.imageId],
    references: [images.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

export const directMessageConversationsRelations = relations(
  directMessageConversations,
  ({ one, many }) => ({
    initiator: one(users, {
      fields: [directMessageConversations.initiatorId],
      references: [users.id],
      relationName: "initiator",
    }),
    member: one(users, {
      fields: [directMessageConversations.memberId],
      references: [users.id],
      relationName: "member",
    }),
    messages: many(directMessages),
  }),
);

export const directMessagesRelations = relations(directMessages, ({ one }) => ({
  conversation: one(directMessageConversations, {
    fields: [directMessages.conversationId],
    references: [directMessageConversations.id],
  }),
  sender: one(users, {
    fields: [directMessages.senderId],
    references: [users.id],
  }),
}));

// Types
export type ProfileImage = typeof profileImages.$inferSelect;
export type NewProfileImage = typeof profileImages.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;

export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;

export type Sound = typeof sounds.$inferSelect;
export type NewSound = typeof sounds.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type PostsImagesRelation = typeof postsImagesRelations.$inferSelect;
export type NewPostsImagesRelation = typeof postsImagesRelations.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type DirectMessageConversation = typeof directMessageConversations.$inferSelect;
export type NewDirectMessageConversation = typeof directMessageConversations.$inferInsert;

export type DirectMessage = typeof directMessages.$inferSelect;
export type NewDirectMessage = typeof directMessages.$inferInsert;

export type QaSuggestion = typeof qaSuggestions.$inferSelect;
export type NewQaSuggestion = typeof qaSuggestions.$inferInsert;
