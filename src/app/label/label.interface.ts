export interface FmlLabel {
    componentId: string;
    componentType: string;
    x: number;
    y: number;
    width: number;
    height: number;
    bgColor: string;
    fontColor: string;
    fontSize: number;
    fontFamily: string;
    content: string;
    bold: boolean;
    italic: boolean;
    deleted: boolean;
    horizontalAlign: string;
    verticalAlign: string;
    movable: boolean;
}