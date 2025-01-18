export type TOrderType = {
    table: string;
    remarks: string;
    items: {
        dish: string;
        quantity: number;
        add_ons: string[];
    }[];
};
