DEFINE TABLE Categories SCHEMAFULL
  PERMISSIONS
        FOR select FULL
        FOR create, update, delete WHERE $auth.role = roles:admin;

DEFINE FIELD name ON TABLE Categories TYPE string;
DEFINE FIELD description ON TABLE Categories TYPE string;