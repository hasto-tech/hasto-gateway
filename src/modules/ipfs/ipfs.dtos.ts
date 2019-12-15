export class UploadDataToIpfsDto {
  readonly rawData: string;
}

export class RemoveDataFromIpfsDto {
  readonly ipfsHash: string;
}
