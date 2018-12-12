interface MediaItem {
    /**
     * Identifier for the media item. This is a persistent identifier that can be
     * used between sessions to identify this media item.
     */
    id: string;
    description: string;
    productUrl: string;
    /**
     * A URL to the media item's bytes.
     */
    baseUrl: string;
    mimeType: string;
    mediaMetadata: unknown;
    contributorInfo: unknown;
    location: {};
    filename: string;
}

interface MediaItemsResponse {
    mediaItems: MediaItem[];
    nextPageToken?: string;
}

class GooglePhotos {
    static readonly API = 'https://photoslibrary.googleapis.com/v1';

    private readonly headers: Headers;

    constructor(oath2Token: string) {
        this.headers = new Headers({
            'Content-type': 'application/json',
            Authorization: `Bearer ${oath2Token}`,
        });
    }

    /**
     * Searches for media items in a user's album in their Google Photos library.
     * @param albumId ID of the album.
     * @param pageSize Maximum number of media items to return in the response.
     */
    async listAlbum(albumId: string, pageSize: number) {
        const res = await fetch(`${GooglePhotos.API}/mediaItems:search`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                pageSize: pageSize.toString(),
                albumId,
            }),
        });

        const { mediaItems } = (await res.json()) as MediaItemsResponse;
        return mediaItems;
    }

    /**
     * Returns the media item for the specified media item `id`.
     * @param mediaItemId ID of the media item.
     */
    async get(mediaItemId: string) {
        const res = await fetch(
            `${GooglePhotos.API}/mediaItems/${mediaItemId}`,
            {
                headers: this.headers,
            },
        );

        return (await res.json()) as MediaItem;
    }

    /**
     * List all media items in a user's Google Photos library.
     * @param pageSize Maximum number of media items to return in the response.
     */
    async *list(pageSize: number) {
        const url = `${GooglePhotos.API}/mediaItems?pageSize=${pageSize}`;
        const res = await fetch(url);
        let {
            mediaItems,
            nextPageToken,
        } = (await res.json()) as MediaItemsResponse;

        yield* mediaItems;

        while (nextPageToken) {
            const res = await fetch(`${url}&pageToken=${nextPageToken}`);
            ({
                mediaItems,
                nextPageToken,
            } = (await res.json()) as MediaItemsResponse);

            yield* mediaItems;
        }
    }
}
