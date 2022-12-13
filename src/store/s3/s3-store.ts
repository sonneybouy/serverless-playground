import {MediaStore} from "../media-store";
import {tracer} from "../../powertools/utilities";
import {Media} from "../../model/Media";
import {S3Client, GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {GetObjectCommandOutput} from "@aws-sdk/client-s3/dist-types/commands/GetObjectCommand";
import {Readable} from "stream";

export class S3Store implements MediaStore {

    private static client: S3Client = new S3Client({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID ?? '',
            secretAccessKey: process.env.AWS_SECRET_KEY ?? '',
        }
    })

    @tracer.captureMethod()
    public async putMedia(media: Media): Promise<void> {

        const params: PutObjectCommand = new PutObjectCommand({
            Key: media.id,
            Bucket: process.env.AWS_BUCKET_NAME ?? "",
            Body: media.files as Blob
        })

        await S3Store.client.send(params);

    }

}