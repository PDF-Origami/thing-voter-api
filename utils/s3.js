import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3Client = new S3Client({ region: 'eu-west-3' });

export async function uploadImage(image, name) {
  const minifiedImage = await sharp(image).webp().toBuffer();

  const params = {
    Bucket: 'thing-voter',
    Key: `${name}.webp`,
    ContentType: 'image/webp',
    Body: minifiedImage,
  };

  await s3Client.send(new PutObjectCommand(params));

  const url = `https://${params.Bucket}.s3.eu-west-3.amazonaws.com/${params.Key}`;
  return url;
}
