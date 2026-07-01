import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      try {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name || undefined,
            image: user.image || undefined,
            googleId: user.id || undefined,
          });
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return true; // Still allow sign in if DB connection is unconfigured during dev
      }
    },
    async session({ session }) {
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'cinefolio-secret-key-fallback-123456789',
});
