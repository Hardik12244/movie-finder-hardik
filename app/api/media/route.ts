import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import MediaItem from '@/lib/models/MediaItem';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const items = await MediaItem.find({ userEmail: session.user.email }).lean();
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching media items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();

    // Support bulk sync (e.g. syncing localStorage items after login)
    if (Array.isArray(body.items)) {
      const results = [];
      for (const item of body.items) {
        const updated = await MediaItem.findOneAndUpdate(
          { userEmail: session.user.email, mediaId: item.id || item.mediaId, mediaType: item.mediaType },
          {
            $set: {
              userEmail: session.user.email,
              mediaId: item.id || item.mediaId,
              mediaType: item.mediaType,
              title: item.title,
              posterPath: item.posterPath,
              backdropPath: item.backdropPath,
              releaseYear: item.releaseYear,
              tmdbRating: item.tmdbRating,
              status: item.status,
              personalRating: item.personalRating,
              personalNotes: item.personalNotes,
              watchedDate: item.watchedDate,
              rewatchedDate: item.rewatchedDate,
              rewatchCount: item.rewatchCount,
              watchedEpisodes: item.watchedEpisodes || [],
              rewatchingEpisodes: item.rewatchingEpisodes || [],
              totalEpisodes: item.totalEpisodes,
              totalSeasons: item.totalSeasons,
            },
          },
          { upsert: true, new: true }
        );
        results.push(updated);
      }
      return NextResponse.json({ success: true, count: results.length });
    }

    // Single item update/create
    const item = body;
    const updated = await MediaItem.findOneAndUpdate(
      { userEmail: session.user.email, mediaId: item.id || item.mediaId, mediaType: item.mediaType },
      {
        $set: {
          userEmail: session.user.email,
          mediaId: item.id || item.mediaId,
          mediaType: item.mediaType,
          title: item.title,
          posterPath: item.posterPath,
          backdropPath: item.backdropPath,
          releaseYear: item.releaseYear,
          tmdbRating: item.tmdbRating,
          status: item.status,
          personalRating: item.personalRating,
          personalNotes: item.personalNotes,
          watchedDate: item.watchedDate,
          rewatchedDate: item.rewatchedDate,
          rewatchCount: item.rewatchCount,
          watchedEpisodes: item.watchedEpisodes || [],
          rewatchingEpisodes: item.rewatchingEpisodes || [],
          totalEpisodes: item.totalEpisodes,
          totalSeasons: item.totalSeasons,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Error saving media item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');
    const mediaType = searchParams.get('mediaType');

    if (!mediaId || (mediaType !== 'movie' && mediaType !== 'tv')) {
      return NextResponse.json({ error: 'Missing or invalid mediaId / mediaType' }, { status: 400 });
    }

    await connectToDatabase();
    await MediaItem.deleteOne({
      userEmail: session.user.email,
      mediaId: Number(mediaId),
      mediaType: mediaType as 'movie' | 'tv',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
