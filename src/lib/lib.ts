import { SpaceType, DocumentType } from "./../types";

export const generatespaceId = async (
  spaceType: SpaceType,
  spaceNumber: string
) => {
  return `${spaceType}-${spaceNumber}` as string;
};

export const generateddocId = async (
  document: DocumentType,
  documentnumber: string
) => {
  return `${document}-${documentnumber}` as string;
};
