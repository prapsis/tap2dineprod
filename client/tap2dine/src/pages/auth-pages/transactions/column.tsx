import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "../../../components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

// Define the type based on your order response
type TOrderType = {
    id: number;
    table: number;
    total_amount: string;
    payment_method: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    status: string;
    created_at: string;
    updated_at: string;
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
        'card': 'Credit/Debit Card',
        'cash': 'Cash',
        'khalti': 'Khalti',
        'esewa': 'eSewa'
    };
    return labels[method?.toLowerCase()] || method;
};

export const columns: ColumnDef<TOrderType>[] = [
    {
        id: "select",
        accessorKey: "id",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Order ID <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <span className="font-medium">#{row.original.id}</span>,
    },
    {
        id:"name",
        accessorKey: "customer_name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Customer <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.customer_name}</span>
                <span className="text-sm text-gray-500">{row.original.customer_email}</span>
            </div>
        ),
    },
    {
        accessorKey: "table",
        header: "Table",
        cell: ({ row }) => <span>Table #{row.original.table}</span>,
    },
    {
        accessorKey: "total_amount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Amount <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="font-medium">
                Rs. {parseFloat(row.original.total_amount).toLocaleString()}
            </span>
        ),
    },
    {
        accessorKey: "payment_method",
        header: "Payment",
        cell: ({ row }) => (
            <Badge variant="outline">
                {getPaymentMethodLabel(row.original.payment_method)}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Status <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Badge className={getStatusColor(row.original.status)}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Date <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.created_at) || new Date();
            return (
                <div className="flex flex-col">
                    <span>{format(date, "MMM dd, yyyy")}</span>
                    <span className="text-sm text-gray-500">{format(date, "hh:mm a")}</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: () => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                        <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];