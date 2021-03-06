export interface FmlCheckbox {
    componentId: string;
    componentType: string;
    x: number;
    y: number;
    width: number;
    height: number;
    bgColor: string;
    fontColor: string;
    fontSize: number;
    deleted: boolean;
    borderSize: number;
    // symbolId: string;
    // pfId: string;
    // varId: string;
    // comparison: string;
    // compareTo: string;
    movable: boolean;
    conditions: string[];
}