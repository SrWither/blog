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