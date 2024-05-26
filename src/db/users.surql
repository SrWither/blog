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