import {SpaceType} from './../types'

export const generatespaceId = async (spaceType:SpaceType,spaceNumber:string)=>{

    return `${spaceType}-${spaceNumber}` as string;

}