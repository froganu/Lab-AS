# Forum Platform for Application Security subject

![Banner](upc-logo.png)


A web-based image sharing and discussion platform built with React and Node.js, designed for users to post images with metadata and engage in conversations through comments.

## Overview

This platform enables users to share visual content and participate in discussions. Images can be uploaded with accompanying metadata including titles, descriptions, tags, publication dates, and unique identifiers.

## User Roles

**Administrator**
- Full content management permissions
- Can edit or delete any posts, comments, and user data across the platform

**Standard User**
- Create, edit, and delete own posts and comments
- Cannot modify content from other users

## Technology Stack

**Frontend**
- React.js for a dynamic and responsive user interface

**Backend**
- Node.js with Express
- Handles authentication, authorization, and database operations

**Database**
- Parameterized queries or ORM for secure data access
- Encrypted storage with proper access controls

## Security Features

**SSL/TLS Encryption**
- Self-signed certificate for HTTPS communication
- Suitable for development and educational purposes

**Authentication**
- Standard users: Auth0 integration with OAuth 2.0 and OpenID Connect
- Login options: username/password or Google/GitHub accounts
- Administrators: Local authentication system managed by backend

**Password Security**
- Argon2id hashing algorithm
- Unique cryptographic salts per password
- No plaintext password storage

**Data Protection**
- SQLi detection and prevention using sanitized inputs
- Environment variables for credential management
- Strict access controls on sensitive data

**SSTI and XSS Prevention**
- Input sanitization and validation on all user-generated content
- Context-aware output encoding to prevent script injection
- Content Security Policy headers to restrict executable content sources
