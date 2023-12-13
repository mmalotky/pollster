
export type Poll = {
    id:string;
    title:string;
    options:Option[];
    endDate:Date;
    active:boolean;
}

export type Option = {
    label:string;
    votes:number;
}