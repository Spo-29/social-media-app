-- create database db_project
use db_project


-- 1. USERS TABLE
CREATE TABLE users (
    id INT IDENTITY(1,1) NOT NULL,
    username VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
    password VARCHAR(200) NOT NULL,
    name VARCHAR(45) NOT NULL,
    coverPic VARCHAR(100) NULL,
    profilePic VARCHAR(100) NULL,
    city VARCHAR(45) NULL,
    website VARCHAR(45) NULL,
    CONSTRAINT PK_users PRIMARY KEY (id),
    CONSTRAINT UQ_users_username UNIQUE (username)
);
GO

-- 2. POSTS TABLE
CREATE TABLE posts (
    id INT IDENTITY(1,1) NOT NULL,
    [desc] VARCHAR(200) NULL,
    img VARCHAR(200) NULL,
    userId INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_posts PRIMARY KEY (id),
    CONSTRAINT FK_posts_users FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
GO

-- 3. COMMENTS TABLE
CREATE TABLE comments (
    id INT IDENTITY(1,1) NOT NULL,
    [desc] VARCHAR(200) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    userId INT NOT NULL,
    postId INT NOT NULL,
    CONSTRAINT PK_comments PRIMARY KEY (id),
    -- Primary Path: Deleting a Post deletes its comments
    CONSTRAINT FK_comments_posts FOREIGN KEY (postId)
        REFERENCES posts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    -- Secondary Path: Set to NO ACTION to avoid Error 1785 (Cycle)
    CONSTRAINT FK_comments_users FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION
);
GO

-- 4. STORIES TABLE
CREATE TABLE stories (
    id INT IDENTITY(1,1) NOT NULL,
    img VARCHAR(200) NOT NULL,
    userId INT NOT NULL,
    CONSTRAINT PK_stories PRIMARY KEY (id),
    CONSTRAINT FK_stories_users FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
GO

-- 5. RELATIONSHIPS TABLE
CREATE TABLE relationships (
    id INT IDENTITY(1,1) NOT NULL,
    followerUserId INT NOT NULL,
    followedUserId INT NOT NULL,
    CONSTRAINT PK_relationships PRIMARY KEY (id),
    -- Cascade deletion for the follower (usually the actor)
    CONSTRAINT FK_relationships_follower FOREIGN KEY (followerUserId)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    -- Set to NO ACTION to avoid Error 1785 (Cycle/Multiple paths on same table)
    CONSTRAINT FK_relationships_followed FOREIGN KEY (followedUserId)
        REFERENCES users(id)
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION,
    CONSTRAINT UQ_relationships UNIQUE (followerUserId, followedUserId)
);
GO

-- 6. LIKES TABLE
CREATE TABLE likes (
    id INT IDENTITY(1,1) NOT NULL,
    userId INT NOT NULL,
    postId INT NOT NULL,
    CONSTRAINT PK_likes PRIMARY KEY (id),
    -- Primary Path: Deleting a Post deletes its likes
    CONSTRAINT FK_likes_posts FOREIGN KEY (postId)
        REFERENCES posts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    -- Secondary Path: Set to NO ACTION to avoid Error 1785 (Cycle)
    CONSTRAINT FK_likes_users FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION,
    CONSTRAINT UQ_likes UNIQUE (userId, postId)
);
GO

-- Optional: Trigger to handle the "impossible" cascade for Comments
CREATE TRIGGER TRG_DeleteUser_Cleanup
ON users
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    -- 1. Delete comments made by this user (Solving FK_comments_users)
    DELETE FROM comments WHERE userId IN (SELECT id FROM deleted);
    
    -- 2. Delete likes made by this user (Solving FK_likes_users)
    DELETE FROM likes WHERE userId IN (SELECT id FROM deleted);

    -- 3. Delete relationships where user is the 'followed' target (Solving FK_relationships_followed)
    DELETE FROM relationships WHERE followedUserId IN (SELECT id FROM deleted);

    -- 4. Finally, delete the user (The Cascades on Posts/Stories/Follower will handle the rest)
    DELETE FROM users WHERE id IN (SELECT id FROM deleted);
END;
GO