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

    // @tracer.captureMethod()
    // public async getMedia(uuid: string): Promise<Media | undefined> {
    //
    //     //Define a GET Command
    //     const params: GetObjectCommand = new GetObjectCommand({
    //         Key: uuid,
    //         Bucket: "bucket-name-for-now"
    //     });
    //     //invoke the S3 Store to go get it
    //
    //     //await result
    //     const result: GetObjectCommandOutput = await S3Store.client.send(params)
    //     //gimme
    //     const stream = result.Body as Readable
    //
    //     return new Promise<Buffer>((resolve, reject) => {
    //        const chunks: Buffer[] =[]
    //         stream.on('data', chunk => chunks.push(chunk))
    //         stream.once('end', () => resolve(Buffer.concat(chunks)))
    //         stream.once('error', reject)
    //     });
    //
    // }
}