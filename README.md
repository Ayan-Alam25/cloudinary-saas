# Build cloudinary AI powered SAAS

**Project is Build using NextJS, cloudinary, Prisma, NeonDB and Daisy UI**

## Prerequisites

-   Node.js (v14 or later)
-   npm (v6 or later)
-   A Clerk account (for authentication)
-   A Neon account (for PostgreSQL database)

## Installation

1. Clone the repository & Install dependencies:
    ```bash
    git clone https://github.com/AdarshTheki/cloud-based-app.git
    cd cloud-based-app
    npm install
    ```
2. Set up environment variables: Create a `.env.local` file in the root directory and add the following variables:

    ```bash
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_SECRET=
    CLOUDINARY_API_KEY=

    DATABASE_URL=
    ```

3. Set up Prisma ORM:

    - Create TypeScript project and set up Prisma ORM

        ```bash
        npm install typescript tsx @types/node --save-dev
        ```

    - Model your data in the Prisma schema:

        ```js
        model Video {
            id              String @id @default(cuid())
            title           String
            description     String
            publicId        String
            originSize      String
            compressedSize  String
            duration        Float
            createdAt       DateTime @default(now())
            updatedAt       DateTime @updatedAt
        }

        ```

    - Run a migration to create your database tables with Prisma Migrate

        ```bash
        npx prisma migrate dev --name init
        ```

## Features

-   User authentication with Clerk
-   Role-based access control (Admin and User roles)
-   Todo management (Create, Read, Update, Delete)
-   Subscription-based todo limits
-   Admin dashboard for user management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.