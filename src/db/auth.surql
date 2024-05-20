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