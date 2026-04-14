# Social Media Application Presentation

## Slide 1: Title Slide
Title: Social Media Application for Connected Communities
Subtitle: Full-Stack Web System with SQL Server
Presented by: Your Name
Course: Your Course Name
Date: April 2026

Speaker notes:
- This project is a full-stack social media platform.
- It focuses on secure communication and community engagement.

## Slide 2: Agenda
- Background and problem
- Objectives
- System overview
- Architecture and database design
- Implementation and application features
- SDG and sustainability impact
- Challenges, conclusion, and future work

Speaker notes:
- I will explain both technical and social value.

## Slide 3: Background
- Social interaction is increasingly digital.
- Many users still feel disconnected online.
- Existing platforms can be noisy and less community-focused.

Speaker notes:
- The project addresses meaningful digital interaction, not just posting content.

## Slide 4: Problem Statement
- Real-world issue: digital social disconnection.
- Affected groups: students, remote learners, and young adults.
- Importance: social isolation affects well-being and collaboration.
- Limitation of existing options: weak privacy trust, fragmented communication, and low personalization.

Speaker notes:
- The goal is to build a focused platform with practical, secure features.

## Slide 5: Project Objectives
- Build a secure social networking web application.
- Support posting, liking, commenting, and stories.
- Enable profile management and user search.
- Implement friend connections.
- Use a normalized relational database with data integrity.

Speaker notes:
- These objectives connect user experience with strong backend design.

## Slide 6: Proposed System Overview
- Frontend: React, React Router, React Query, Context API, SCSS.
- Backend: Node.js and Express REST API.
- Database: Microsoft SQL Server.
- Authentication: JWT with hashed passwords.
- Media handling: image upload for posts, stories, and profile pictures.

Speaker notes:
- The architecture follows a clean frontend, API, and database separation.

## Slide 7: System Architecture
Insert architecture diagram from:
- system-architecture-diagram.md

Key flow:
- User interacts with React frontend.
- Frontend calls Express APIs through Axios.
- Backend performs SQL operations in SQL Server.
- Image files are uploaded and served from local upload storage.

Speaker notes:
- Mention protected APIs and cookie-based session handling.

## Slide 8: Database Design (ERD)
Main entities:
- users
- posts
- comments
- likes
- stories
- relationships

Core relationships:
- One user to many posts
- One post to many comments and likes
- User to user connections through relationships

Speaker notes:
- Explain primary keys, foreign keys, and unique constraints.

## Slide 9: Implementation Highlights
- Secure registration and login flow
- CRUD for posts and comments
- Like and unlike operations
- Story add and delete
- Search users by name or username
- Profile edit with image updates
- Friend add and unfriend actions

Speaker notes:
- Mention optimistic updates and query invalidation for responsive UI.

## Slide 10: Application UI Screens
Include screenshots with caption and short explanation:
1. Registration page
2. Login page
3. Home feed
4. Post creation form
5. Comments and likes section
6. Profile page
7. Edit profile form
8. Search results page
9. Friends page
10. SQL query output

Speaker notes:
- Keep each screenshot explanation to one sentence during presentation.

## Slide 11: SQL Examples to Show
- Table creation query
- Insert query
- Update query
- Delete query
- Complex query with JOIN and GROUP BY for engagement analytics

Speaker notes:
- This slide proves your database operations are practical and complete.

## Slide 12: Sustainable Development Impact
Society:
- Improves digital inclusion and social support

Environment:
- Reduces need for physical coordination and paper-based communication

Economy:
- Low-cost community communication platform
- Builds technical skills and employability

Speaker notes:
- Connect technical work to real-world outcomes.

## Slide 13: UN SDG Mapping
- SDG 9: Industry, Innovation and Infrastructure
- SDG 10: Reduced Inequalities
- SDG 11: Sustainable Cities and Communities
- SDG 16: Peace, Justice and Strong Institutions

Speaker notes:
- Explain how secure and inclusive digital systems support these goals.

## Slide 14: Challenges and Limitations
Challenges:
- Managing relational delete dependencies
- Synchronizing frontend state with backend changes
- Integrating image upload and display paths

Limitations:
- No real-time socket updates yet
- Local storage for media is not cloud-scalable
- Limited moderation and advanced analytics dashboard

Speaker notes:
- Be honest about limitations and show improvement direction.

## Slide 15: Conclusion and Future Work
Conclusion:
- Built a working full-stack social media system with secure and meaningful user interactions.

Future work:
- Add real-time notifications
- Add role-based access and stronger secret management
- Move media storage to cloud services
- Add moderation and richer analytics dashboards

Speaker notes:
- End with both achievement and roadmap.

## Slide 16: Demo Flow and Q and A
Demo sequence:
- Register or login
- Create post with image
- Like and comment
- Edit profile
- Search user and add friend
- Show friends list and one SQL output

Speaker notes:
- Keep demo short and stable.
- Thank the audience and open for questions.
