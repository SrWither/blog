# Blog using SurrealDB, Rust, and Vue.js

## Screenshots

### Home Page
<kbd>
  <img src="https://github.com/SrWither/blog/assets/59105868/f92520ce-5279-4b67-8d35-43aebe600d5e" alt="image 1">
</kbd>

### Posts List
<kbd>
  <img src="https://github.com/SrWither/blog/assets/59105868/e577edac-63f2-47c3-9ae8-3f3f81bf52e9" alt="image 2">
</kbd>

### Post Details (right click)
<kbd>
  <img src="https://github.com/SrWither/blog/assets/59105868/2e44bb5a-ef0d-480c-b94d-d098e4a85868" alt="image 3">
</kbd>

### Admin Page
<kbd>
  <img src="https://github.com/SrWither/blog/assets/59105868/fef9b45a-3a73-4f41-adc6-01f19e402731" alt="image 4">
</kbd>

### OAuth2
<kbd>
  <img src="https://github.com/SrWither/blog/assets/59105868/368f9f65-b061-41bb-9096-fda1cd68c0ad" alt="image 5">
</kbd>

### Category Details
<kbd>
  <img src="https://github.com/SrWither/blog/assets/59105868/db4ff811-8cac-47dc-9ccb-70969209cbca" alt="image 6">
</kbd>

### Post Creation
<kbd>
  <img src="https://github.com/SrWither/blog/assets/59105868/bf1c9c89-dd67-4f8d-960a-5cc633548788" alt="image 7">
</kbd>

### Post View
<kbd>
  <img src="https://github.com/SrWither/blog/assets/59105868/7744404e-3ec8-40b6-91a9-4b50fe6f4b50" alt="image 8">
</kbd>

### Lightbox
<kbd>
  <img src="https://github.com/SrWither/blog/assets/59105868/052debad-391c-4f0f-88fe-6341dcac238a" alt="image 9">
</kbd>

### Profiles
<kbd>
  <img src="https://github.com/SrWither/blog/assets/59105868/e95b710e-f769-4e48-80ec-32969fd5f86b" alt="image 10">
</kbd>

### Comments
<kbd>
  <img src="https://github.com/SrWither/blog/assets/59105868/ad5f031d-26ca-43b2-8bec-9fc34a8df0f4" alt="image 11">
</kbd>

https://github.com/SrWither/blog/assets/59105868/d3247846-bf02-4a02-8a11-1bc1d3f9755a

## Dependencies

- **SurrealDB**: [GitHub - surrealdb/surrealdb](https://github.com/surrealdb/surrealdb/)
- **Rust**: [rustup.rs](https://rustup.rs/)
- **Node.js**: [nodejs.org](https://nodejs.org/en)


# Setup
### Start surrealDB
```sh
surreal start --log debug --user root --pass root --bind 0.0.0.0:7435  memory
```
### Open sql
```
surreal sql --conn http://0.0.0.0:7435 -u root -p root --ns blog --db blog --pretty
```
### Setup database
```hs
DEFINE SCOPE Auth
    SESSION 3d

    SIGNUP (
      CREATE Users
      SET username = $username,
          email = $email,
          password = crypto::argon2::generate($password)
    )

    SIGNIN (
      SELECT * FROM Users WHERE
      email = $email
      AND crypto::argon2::compare(password, $password)
    )
;

DEFINE TABLE Categories SCHEMAFULL
  PERMISSIONS
        FOR select FULL
        FOR create, update, delete WHERE $auth.role = roles:admin;

DEFINE FIELD name ON TABLE Categories TYPE string;
DEFINE FIELD description ON TABLE Categories TYPE string;

DEFINE SCOPE OAuth2
    SESSION 3d

    SIGNUP (
      INSERT INTO Users
      (email, sub, provider)
      VALUES
      ($email, crypto::argon2::generate($sub), $provider)
    )

    SIGNIN (
      SELECT * FROM Users WHERE
      email = $email
      AND crypto::argon2::compare(sub, $sub)
    )
;

DEFINE TABLE Posts SCHEMALESS
    PERMISSIONS
        FOR select
            WHERE published = true
            OR user = $auth.id
            OR $auth.role = roles:admin
        FOR create, update, delete
            WHERE 
            user = $auth.id
            OR $auth.role = roles:admin
;

DEFINE FIELD title ON TABLE Posts TYPE string;
DEFINE FIELD description ON TABLE Posts TYPE string;
DEFINE FIELD content ON TABLE Posts TYPE string;
DEFINE FIELD published ON TABLE Posts TYPE bool DEFAULT false;
DEFINE FIELD created_at ON TABLE Posts TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE Posts TYPE datetime DEFAULT time::now() VALUE time::now();
DEFINE FIELD user ON TABLE Posts TYPE record<Users> DEFAULT $auth.id;
DEFINE FIELD category ON TABLE Posts TYPE record<Categories>;
DEFINE FIELD tags ON TABLE Posts TYPE option<array<string>>;

DEFINE TABLE Profiles SCHEMAFULL
    PERMISSIONS
        FOR select FULL
        FOR create, update, delete WHERE user = $auth.id OR $auth.role = roles:admin;

DEFINE FIELD username ON TABLE Profiles TYPE string;
DEFINE FIELD oauth ON TABLE Profiles TYPE bool DEFAULT false;
DEFINE FIELD avatar ON TABLE Profiles TYPE string;
DEFINE FIELD user ON TABLE Profiles TYPE record(Users) DEFAULT $auth.id;

DEFINE INDEX profileUsernameIndex ON TABLE Profiles COLUMNS username UNIQUE;

CREATE roles:admin SET name = "administrator";
CREATE roles:user SET name = "user";

DEFINE TABLE Users SCHEMALESS
    PERMISSIONS
        FOR select, update, delete WHERE id = $auth.id OR role = roles:admin;

DEFINE FIELD email ON TABLE Users TYPE string
    ASSERT string::is::email($value);
DEFINE FIELD sub ON TABLE Users TYPE option<string>;
DEFINE FIELD provider ON TABLE Users TYPE option<string>;
DEFINE FIELD password ON TABLE Users TYPE option<string>;
DEFINE FIELD role ON TABLE Users TYPE record(roles) DEFAULT roles:user;

DEFINE INDEX userEmailIndex ON TABLE Users COLUMNS email UNIQUE;
DEFINE INDEX userSubIndex ON TABLE Users COLUMNS sub UNIQUE;

DEFINE TABLE Comments SCHEMAFULL
    PERMISSIONS
        FOR select FULL
        FOR create, update, delete WHERE user = $auth.id OR $auth.role = roles:admin;

DEFINE FIELD user ON TABLE Comments TYPE record<Users> DEFAULT $auth.id;
DEFINE FIELD post ON TABLE Comments TYPE record<Posts>;
DEFINE FIELD body ON TABLE Comments TYPE string;
DEFINE FIELD created_at ON TABLE Comments TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE Comments TYPE datetime DEFAULT time::now() VALUE time::now();
```
```hs
CREATE Categories SET name = "Tutorials", description = "Step-by-step guides on various programming topics, from beginner to advanced levels.";
CREATE Categories SET name = "Code Snippets", description = "Short pieces of reusable code for common tasks and problems, ready to be integrated into your projects.";
CREATE Categories SET name = "Development Tools", description = "Reviews and tutorials on tools that enhance productivity, such as IDEs, debuggers, and code editors.";
CREATE Categories SET name = "Programming Languages", description = "Articles and guides on different programming languages, including their syntax, features, and best use cases.";
CREATE Categories SET name = "Frameworks", description = "In-depth looks at popular frameworks for web, mobile, and desktop development, including usage examples and best practices.";
CREATE Categories SET name = "Software Development", description = "General articles on software development methodologies, best practices, and the software lifecycle.";
CREATE Categories SET name = "Web Development", description = "Resources and tutorials focused on building websites and web applications, including front-end and back-end development.";
CREATE Categories SET name = "Mobile Development", description = "Guides and tips for developing mobile applications for iOS, Android, and cross-platform solutions.";
CREATE Categories SET name = "Game Development", description = "Tutorials, tips, and resources for creating video games, including graphics, physics, and user interaction.";
CREATE Categories SET name = "DevOps", description = "Articles on integrating development and operations, including CI/CD pipelines, automation, and monitoring.";
CREATE Categories SET name = "Cloud Computing", description = "Guides on leveraging cloud services for development, including infrastructure as a service (IaaS), platform as a service (PaaS), and software as a service (SaaS).";
CREATE Categories SET name = "Artificial Intelligence", description = "Articles and tutorials on AI concepts, tools, and applications, from machine learning to neural networks.";
CREATE Categories SET name = "Machine Learning", description = "In-depth resources on machine learning algorithms, tools, and real-world applications.";
CREATE Categories SET name = "Data Science", description = "Guides and tutorials on data analysis, visualization, and interpretation using various data science tools and techniques.";
CREATE Categories SET name = "Cybersecurity", description = "Tips, tools, and best practices for securing software, systems, and networks against cyber threats.";
CREATE Categories SET name = "Project Management", description = "Articles on managing software projects, including methodologies like Agile, Scrum, and Kanban.";
CREATE Categories SET name = "Version Control", description = "Tutorials on using version control systems like Git, including branching strategies, collaboration tips, and workflow integration.";
CREATE Categories SET name = "Algorithms", description = "Detailed explanations and implementations of common algorithms, along with their use cases and performance considerations.";
CREATE Categories SET name = "Data Structures", description = "Guides on various data structures, their implementations, and their applications in software development.";
CREATE Categories SET name = "Best Practices", description = "Articles on best practices in coding, design patterns, and maintaining code quality and readability.";
CREATE Categories SET name = "Tips and Tricks", description = "Quick tips and shortcuts to improve efficiency and effectiveness in programming and development.";
CREATE Categories SET name = "Career Advice", description = "Guidance on building a career in software development, including job search tips, resume writing, and interview preparation.";
CREATE Categories SET name = "Industry News", description = "Updates and commentary on the latest trends, technologies, and events in the software development industry.";
CREATE Categories SET name = "Open Source", description = "Information on contributing to and benefiting from open-source projects, including popular open-source tools and libraries.";
CREATE Categories SET name = "Personal Projects", description = "Showcases and case studies of personal projects, including the development process, challenges faced, and solutions implemented.";
CREATE Categories SET name = "Interviews", description = "Interviews with industry experts, developers, and thought leaders, sharing their insights and experiences.";
CREATE Categories SET name = "Reviews", description = "Reviews of software, tools, books, and other resources relevant to programmers and developers.";
CREATE Categories SET name = "Books and Resources", description = "Recommendations and reviews of books, online courses, and other educational resources for developers.";
CREATE Categories SET name = "Community Events", description = "Information on upcoming conferences, meetups, hackathons, and other events in the developer community.";
CREATE Categories SET name = "Code Challenges", description = "Programming challenges and puzzles to test and improve coding skills, along with solutions and explanations.";
```
```hs
CREATE Users SET 
    username = "USERNAME",
    email    = "EMAILf@gmail.com",
    role     = roles:admin,
    password = crypto::argon2::generate("123456")
```

### Clone repository
```sh
git clone https://github.com/SrWither/blog
cd blog
npm install
```

### Set up `.env`
```env
VITE_SURREALDB="http://0.0.0.0:7435/rpc"
VITE_IMAGEAPI="http://0.0.0.0:5800/"

# Google
VITE_CLIENTID=""
VITE_SECRET=""
VITE_REDIRECTURI="http://localhost:5173"


# Discord
VITE_DSID=""
VITE_DSSECRET=""
VITE_DSURL=""
VITE_DSREDIRECTURI="http://localhost:5173/callback"
```
To create oauth2 app:
- **Discord**: [Discord Developer Portal](https://discord.com/developers/applications)
- **Google**: [Google Console](https://console.cloud.google.com/)

### Start image api and app
```sh
npm run dev
```
```sh
cd src-image-api
cargo run
```
