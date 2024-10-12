import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Kullanıcı Adı",
          type: "text",
          placeholder: "Kullanıcı adını girin",
        },
        password: {
          label: "Şifre",
          type: "password",
          placeholder: "Şifrenizi girin",
        },
      },
      async authorize(credentials) {
        // Kullanıcı doğrulama işlemi
        if (
          credentials.username === "oguz" &&
          credentials.password === "C3q7654321."
        ) {
          return { id: 1, name: "Admin" }; // Başarılı girişte döndürülmesi gereken kullanıcı verisi
        } else {
          return null; // Başarısız giriş
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login", // Giriş sayfasının yolu
  },
  session: {
    strategy: "jwt", // JWT kullan
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
