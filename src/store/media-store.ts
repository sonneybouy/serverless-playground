import {Media} from "../model/Media";

export interface MediaStore {
    // getMedia: (uuid: string) => Promise<Media | undefined>;
    putMedia: (media: Media) => Promise<void>;
}