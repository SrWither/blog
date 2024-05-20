DEFINE TABLE Users SCHEMAFULL
    PERMISSIONS
        FOR select FULL
        FOR update, delete WHERE id = $auth.id OR role = roles:admin;

DEFINE FIELD username ON TABLE Users TYPE string;
DEFINE FIELD email ON TABLE Users TYPE string
    ASSERT string::is::email($value);
DEFINE FIELD password ON TABLE Users TYPE string;
DEFINE FIELD role ON TABLE Users TYPE record(roles) DEFAULT roles:user;

DEFINE INDEX userEmailIndex ON TABLE Users COLUMNS email UNIQUE;
DEFINE INDEX userNameIndex ON TABLE Users COLUMNS username UNIQUE;