export interface FmlSignature {
    componentId: string;
    componentType: string;
    x: number;
    y: number;
    width: number;
    height: number;
    weight: number;     // line weight, actually in pixel, not the CSS weight
    bgColor: string;
    fontColor: string;  //  line color aka signature colour
    signatureId: string;
    borderSize: number;
    deleted: boolean;
    movable: boolean;
}