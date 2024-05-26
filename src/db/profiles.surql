DEFINE TABLE Profiles SCHEMAFULL
    PERMISSIONS
        FOR select FULL
        FOR create, update, delete WHERE user = $auth.id OR $auth.role = roles:admin;

DEFINE FIELD username ON TABLE Profiles TYPE string;
DEFINE FIELD avatar ON TABLE Profiles TYPE string;
DEFINE FIELD user ON TABLE Profiles TYPE record(Users) DEFAULT $auth.id;

DEFINE INDEX profileUsernameIndex ON TABLE Profiles COLUMNS username UNIQUE;