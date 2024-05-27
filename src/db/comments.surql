DEFINE TABLE Comments SCHEMAFULL
    PERMISSIONS
        FOR select FULL
        FOR create, update, delete WHERE user = $auth.id OR $auth.role = roles:admin;

DEFINE FIELD user ON TABLE Comments TYPE record<Users>;
DEFINE FIELD post ON TABLE Comments TYPE record<Posts>;
DEFINE FIELD body ON TABLE Comments TYPE string;
DEFINE FIELD created_at ON TABLE Comments TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE Comments TYPE datetime DEFAULT time::now() VALUE time::now();